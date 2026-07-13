import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function ClientCalendarPage({ hideHeader = false }: { hideHeader?: boolean }) {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());

  // Fetch client bookings
  const { data: bookings } = useQuery({
    queryKey: ["clientCalendarBookings", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select(
          `
          id,
          status,
          scheduled_at,
          duration_hours,
          total_price,
          provider:organizations(name),
          service:provider_services(name)
        `,
        )
        .eq("client_id", user!.id);

      if (error) throw error;
      return data || [];
    },
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Calendar generation logic
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Padding for starting day of week (0 = Sunday, 1 = Monday, etc. Adjust for Mon as first day)
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const paddings = Array.from({ length: startOffset });

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Check if a day has bookings
  const getDayBookings = (dayNum: number) => {
    if (!bookings) return [];
    return bookings.filter((b) => {
      const bDate = new Date(b.scheduled_at);
      return (
        bDate.getFullYear() === year && bDate.getMonth() === month && bDate.getDate() === dayNum
      );
    });
  };

  return (
    <div className={cn("space-y-6 pb-12 max-w-[1400px] mx-auto text-slate-800", hideHeader && "space-y-0 pb-0")}>
      {!hideHeader && (
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-blue-600" />
            Calendar Schedule
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Manage your upcoming and past bookings in a calendar view.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Calendar Grid */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              {monthNames[month]} {year}
            </h2>
            <div className="flex gap-1.5">
              <Button
                variant="outline"
                size="icon"
                onClick={prevMonth}
                className="h-8 w-8 rounded-lg cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextMonth}
                className="h-8 w-8 rounded-lg cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Days labels */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <div key={d} className="py-2">
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-2">
            {paddings.map((_, i) => (
              <div key={`pad-${i}`} className="aspect-square rounded-xl bg-slate-50/50" />
            ))}
            {days.map((day) => {
              const dayBookings = getDayBookings(day);
              const hasBookings = dayBookings.length > 0;
              return (
                <div
                  key={day}
                  className={`aspect-square rounded-xl border p-2 flex flex-col justify-between transition-colors relative cursor-pointer ${
                    hasBookings
                      ? "border-blue-200 bg-blue-50/30 hover:bg-blue-50/50"
                      : "border-slate-100 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`text-xs font-bold ${hasBookings ? "text-blue-600" : "text-slate-600"}`}
                  >
                    {day}
                  </span>

                  {hasBookings && (
                    <div className="flex gap-1 justify-center md:justify-start">
                      {dayBookings.map((b) => (
                        <div
                          key={b.id}
                          title={`${(b.service as any)?.name || "Service"} by ${(b.provider as any)?.name}`}
                          className="h-2 w-2 rounded-full bg-blue-600"
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar: Job details for the selected month */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Jobs in {monthNames[month]}</h3>

          <div className="space-y-3">
            {!bookings ||
            bookings.filter((b) => {
              const bDate = new Date(b.scheduled_at);
              return bDate.getFullYear() === year && bDate.getMonth() === month;
            }).length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No bookings scheduled for this month.
              </div>
            ) : (
              bookings
                .filter((b) => {
                  const bDate = new Date(b.scheduled_at);
                  return bDate.getFullYear() === year && bDate.getMonth() === month;
                })
                .map((b) => (
                  <div
                    key={b.id}
                    className="p-3 border border-slate-100 rounded-xl bg-slate-50/50 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">
                        {(b.service as any)?.name || "General Service"}
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-wider">
                        {b.status}
                      </span>
                    </div>
                    <div className="text-slate-400">by {(b.provider as any)?.name}</div>

                    <div className="flex flex-col gap-1 text-[10px] text-slate-400 pt-1.5 border-t border-slate-100/60 mt-1">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />{" "}
                        {new Date(b.scheduled_at).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />{" "}
                        {new Date(b.scheduled_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        ({b.duration_hours}h)
                      </span>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
