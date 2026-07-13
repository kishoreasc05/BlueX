import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { Bell, FileSignature, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/notifications")({
  component: Page,
});

function Page() {
  const { user } = useAuth();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["clientBookingsForNotifications", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select(
          `
          id,
          status,
          scheduled_at,
          updated_at,
          provider:organizations(name),
          service:provider_services(name)
        `,
        )
        .eq("client_id", user!.id)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return (data || []) as any[];
    },
  });

  const notifications = (bookings || []).map((b) => {
    let title = "";
    let desc = "";
    let color = "text-blue-600";
    let bg = "bg-blue-50";
    let Icon = FileSignature;

    if (b.status === "pending") {
      title = "Booking request submitted";
      desc = `Your request for ${b.service?.name || "General Service"} with ${b.provider?.name || "Provider"} is pending confirmation.`;
      color = "text-amber-600";
      bg = "bg-amber-50";
      Icon = AlertCircle;
    } else if (b.status === "confirmed") {
      title = "Booking request accepted!";
      desc = `Your booking for ${b.service?.name || "General Service"} with ${b.provider?.name || "Provider"} has been accepted and confirmed.`;
      color = "text-blue-600";
      bg = "bg-blue-50";
      Icon = CheckCircle2;
    } else if (b.status === "completed") {
      title = "Service Completed";
      desc = `The service for ${b.service?.name || "General Service"} with ${b.provider?.name || "Provider"} has been completed successfully.`;
      color = "text-emerald-600";
      bg = "bg-emerald-50";
      Icon = CheckCircle2;
    } else if (b.status === "cancelled") {
      title = "Booking Cancelled";
      desc = `Your booking for ${b.service?.name || "General Service"} was cancelled.`;
      color = "text-red-600";
      bg = "bg-red-50";
      Icon = XCircle;
    }

    return {
      id: b.id,
      title,
      desc,
      color,
      bg,
      Icon,
      timeStr: new Date(b.updated_at).toLocaleDateString("en-CH", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  });

  return (
    <div className="space-y-6 pb-12 max-w-[800px] mx-auto text-slate-800">
      <PageHeader
        title="Notifications"
        description="Stay updated with your recent activity."
        action={
          <Button variant="outline" className="rounded-xl text-sm border-slate-200 text-slate-600">
            Mark all as read
          </Button>
        }
      />

      {isLoading ? (
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-12 text-center text-slate-400 font-medium">
          Loading notifications...
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-12 text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-400">
            <Bell className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900">All caught up</h3>
            <p className="text-xs text-slate-400">
              When updates occur on your bookings or messages, they will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
          {notifications.map((n) => (
            <div key={n.id} className="p-6 flex gap-4 hover:bg-slate-50/50 transition-colors">
              <div
                className={`h-10 w-10 rounded-full ${n.bg} flex items-center justify-center shrink-0`}
              >
                <n.Icon className={`h-5 w-5 ${n.color}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-900 font-medium">{n.title}</p>
                <p className="text-sm text-slate-500 mt-1">{n.desc}</p>
                <p className="text-xs text-slate-400 mt-2">{n.timeStr}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
