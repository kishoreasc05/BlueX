import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import {
  ChevronLeft,
  Calendar as CalendarIcon,
  Clock,
  DollarSign,
  Info,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  User,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MOCK_PROVIDERS } from "@/customer/mockData";
import { AiJobExpanderModal } from "@/ai module/ai search/components/ai-job-expander-modal";

const TIME_SLOTS = [
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
];

export function BookingRequestPage() {
  const { id } = useParams({ from: "/_authenticated/client/book/$id" } as any);
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("09:00 AM");
  const [duration, setDuration] = useState(2);
  const [notes, setNotes] = useState("");
  const [expanderOpen, setExpanderOpen] = useState(false);

  const isMock = id in MOCK_PROVIDERS;

  // Fetch real contractor details if not a mock
  const { data: dbContractor, isLoading } = useQuery({
    queryKey: ["contractorBookingDetails", id],
    enabled: !isMock && !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contractors")
        .select("id, name, specialty, hourly_rate, organization_id")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const provider = (
    isMock
      ? MOCK_PROVIDERS[id]
      : dbContractor
        ? {
            name: dbContractor.name,
            type:
              dbContractor.name.toLowerCase().includes("gmbh") ||
              dbContractor.name.toLowerCase().includes("ag") ||
              dbContractor.name.toLowerCase().includes("company")
                ? ("company" as const)
                : ("private" as const),
            specialty: dbContractor.specialty || "General Contractor",
            hourlyRate: Number(dbContractor.hourly_rate || 90),
            avatar: "",
            organizationId: dbContractor.organization_id,
          }
        : null
  ) as any;

  // Pricing calculations
  const hourlyRate = provider?.hourlyRate || 0;
  const serviceFee = 5.0; // CHF
  const subtotal = hourlyRate * duration;
  const isCompany = provider?.type === "company";
  const vat = isCompany ? Number((subtotal * 0.081).toFixed(2)) : 0; // Swiss VAT 8.1%
  const socialContributions = !isCompany && provider ? Number((subtotal * 0.12).toFixed(2)) : 0; // AHV/ALV/UVG 12%
  const total = subtotal + serviceFee + vat + socialContributions;

  // Mutation to create booking
  const createBooking = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("You must be logged in to book.");
      if (!date) throw new Error("Please select a date.");
      if (!provider) throw new Error("Provider not found.");

      // Parse date and time into a single Date object
      const [timeStr, ampm] = timeSlot.split(" ");
      const [hoursStr, minutesStr] = timeStr.split(":");
      let hoursNum = parseInt(hoursStr);
      if (ampm === "PM" && hoursNum !== 12) hoursNum += 12;
      if (ampm === "AM" && hoursNum === 12) hoursNum = 0;

      const scheduledDate = new Date(date);
      scheduledDate.setHours(hoursNum, parseInt(minutesStr), 0, 0);

      if (isMock) {
        // Mock success delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return;
      }

      const { error } = await supabase.from("bookings").insert({
        client_id: user.id,
        provider_id: provider.organizationId,
        scheduled_at: scheduledDate.toISOString(),
        duration_hours: duration,
        total_price: total,
        notes: notes,
        status: "pending",
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Booking request submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["clientBookings"] });
      navigate({ to: "/client/bookings" });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create booking request.");
    },
  });

  if (isLoading) {
    return <div className="py-20 text-center text-slate-500 font-medium">Loading details...</div>;
  }

  if (!provider) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Provider not found</h2>
        <Button
          onClick={() => navigate({ to: "/client/search" })}
          className="bg-blue-600 text-white rounded-xl"
        >
          Back to Search
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 max-w-[1400px] mx-auto text-slate-800">
      {/* ── BACK BUTTON ── */}
      <div>
        <button
          onClick={() => window.history.back()}
          className="text-xs font-semibold text-slate-400 hover:text-slate-600 flex items-center gap-1 cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to provider profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* LEFT COLUMN: Booking Form */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Request Booking
            </h1>
            <p className="text-slate-400 text-xs mt-0.5">
              Select your preferred date, time and requirements.
            </p>
          </div>

          <div className="space-y-4">
            {/* Date Selection */}
            <div className="space-y-1.5">
              <Label htmlFor="date" className="text-xs font-bold text-slate-700">
                Date
              </Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="pl-9 h-10 rounded-xl border-slate-200"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>

            {/* Time Slot Selector */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">Start Time</Label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {TIME_SLOTS.map((slot) => {
                  const isSelected = timeSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTimeSlot(slot)}
                      className={`h-9 text-xs rounded-xl font-semibold border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-blue-50 border-blue-200 text-blue-600"
                          : "bg-white border-slate-200 hover:bg-slate-50 text-slate-600"
                      }`}
                    >
                      {slot.replace(" AM", "").replace(" PM", "")}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Duration Selector */}
            <div className="space-y-1.5">
              <Label
                htmlFor="duration"
                className="text-xs font-bold text-slate-700 flex justify-between"
              >
                <span>Duration</span>
                <span className="text-slate-500">{duration} hours</span>
              </Label>
              <div className="flex items-center gap-3">
                <input
                  id="duration"
                  type="range"
                  min="1"
                  max="8"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="notes" className="text-xs font-bold text-slate-700">
                  Instructions / Notes
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpanderOpen(true)}
                  className="h-6 text-[11px] font-bold text-indigo-600 hover:bg-indigo-50 px-2 rounded-lg cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-indigo-600 fill-indigo-600/10" />
                  <span>Expand with AI</span>
                </Button>
              </div>
              <Textarea
                id="notes"
                placeholder="Explain the job, any specific requirements, or details about accessibility..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="rounded-xl border-slate-200"
              />
            </div>

            {/* AI Job Expander Modal */}
            <AiJobExpanderModal
              open={expanderOpen}
              onOpenChange={setExpanderOpen}
              initialPrompt={notes || "Need service for residential house"}
              onApplyExpandedJob={(expanded) => {
                setNotes(expanded.notes);
              }}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Order Summary */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
              Booking Summary
            </h2>

            {/* Provider Mini Info */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center border border-slate-200">
                {provider.avatar &&
                !provider.avatar.includes("pravatar") &&
                !provider.avatar.includes("unsplash") ? (
                  <img
                    src={provider.avatar}
                    alt={provider.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-slate-100 text-slate-400 flex items-center justify-center select-none">
                    {provider.type === "company" ? (
                      <Building className="h-5 w-5 text-slate-400" />
                    ) : (
                      <User className="h-5 w-5 text-slate-400" />
                    )}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">{provider.name}</h3>
                <span className="text-[10px] text-slate-400 font-semibold">
                  {provider.specialty}
                </span>
              </div>
            </div>

            {/* Date / Time summary */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100 text-xs text-slate-600 font-medium">
              <div className="flex justify-between">
                <span className="text-slate-400">Date</span>
                <span>
                  {date
                    ? new Date(date).toLocaleDateString("en-US", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "Select date"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Time slot</span>
                <span>{timeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Duration</span>
                <span>{duration} hours</span>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100 text-xs text-slate-600 font-medium">
              <div className="flex justify-between">
                <span className="text-slate-400">
                  CHF {hourlyRate} x {duration} hrs
                </span>
                <span>CHF {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Platform service fee</span>
                <span>CHF {serviceFee.toFixed(2)}</span>
              </div>
              {isCompany ? (
                <div className="flex justify-between">
                  <span className="text-slate-400">Swiss VAT (8.1%)</span>
                  <span>CHF {vat.toFixed(2)}</span>
                </div>
              ) : (
                <div className="flex justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    Payroll & Insurance (12.0%)
                    <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-1 py-0.5 rounded">
                      AHV/UVG
                    </span>
                  </span>
                  <span>CHF {socialContributions.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-50">
                <span>Total Estimate</span>
                <span>CHF {total.toFixed(2)}</span>
              </div>
            </div>

            <Button
              onClick={() => createBooking.mutate()}
              disabled={createBooking.isPending || !date}
              className="w-full h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/10 cursor-pointer"
            >
              {createBooking.isPending ? "Submitting..." : "Submit Booking Request"}
            </Button>

            {/* Trust highlights */}
            <div className="space-y-2.5 pt-4 border-t border-slate-100 text-[10px] text-slate-400 leading-normal">
              <div className="flex gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>
                  **Escrow Protection**: Your payment is securely held and only released to the
                  provider after service completion.
                </span>
              </div>
              <div className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0" />
                <span>
                  **Free Cancellation**: Cancel up to 24 hours in advance for a full refund.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
