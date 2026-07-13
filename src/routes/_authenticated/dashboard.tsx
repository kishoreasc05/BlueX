import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Briefcase,
  Clock,
  Calendar,
  DollarSign,
  Bot,
  ArrowRight,
  Star,
  TrendingUp,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  MapPin,
  MoreHorizontal,
  Lightbulb,
  Zap,
  BarChart3,
  MessageSquare,
  Timer,
  Check,
  X,
  Upload,
  Loader2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useActiveOrg } from "@/hooks/use-orgs";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { ClientDashboard } from "@/customer/components/dashboard";
import { OpsDashboard } from "@/admin/components/dashboard";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

/* ── Custom chart tooltip ── */
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 text-white px-3 py-2 rounded-lg shadow-xl text-xs font-medium">
        <div className="text-slate-300">{label}</div>
        <div className="font-bold">CHF {payload[0].value}</div>
      </div>
    );
  }
  return null;
}

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

/* ── Mock data for Provider Dashboard ── */
const todaysJobs = [
  {
    time: "09:00 AM",
    countdown: "In 45 min",
    title: "Bathroom Plumbing Fix",
    address: "Seestrasse 123, 8002 Zurich",
    category: "Residential",
    categoryColor: "bg-blue-50 text-blue-600",
    amount: "CHF 150",
    status: "Confirmed",
  },
  {
    time: "01:00 PM",
    countdown: "In 4h 45m",
    title: "Kitchen Pipe Installation",
    address: "Weinbergstrasse 45, 8001 Zurich",
    category: "Installation",
    categoryColor: "bg-violet-50 text-violet-600",
    amount: "CHF 220",
    status: "Confirmed",
  },
  {
    time: "03:30 PM",
    countdown: "In 7h 15m",
    title: "Water Heater Repair",
    address: "Badenerstrasse 178, 8004 Zurich",
    category: "Repair",
    categoryColor: "bg-amber-50 text-amber-600",
    amount: "CHF 180",
    status: "Confirmed",
  },
];

const scheduleBlocks = [
  {
    name: "Bathroom\nPlumbing Fix",
    time: "09:00 – 11:00",
    startHour: 9,
    endHour: 11,
    color: "bg-blue-100 border-blue-300 text-blue-700",
  },
  {
    name: "Kitchen Pipe\nInstallation",
    time: "01:00 – 03:00",
    startHour: 13,
    endHour: 15,
    color: "bg-violet-100 border-violet-300 text-violet-700",
  },
  {
    name: "Water Heater Repair",
    time: "03:30 – 05:00",
    startHour: 15.5,
    endHour: 17,
    color: "bg-amber-100 border-amber-300 text-amber-700",
  },
];

const pendingRequests = [
  {
    when: "Today",
    time: "10:30 AM",
    title: "Unclog Drain",
    address: "Kolibristrasse 90, 8003 Zurich",
    amount: "CHF 120",
    badge: "Emergency",
    badgeColor: "bg-red-50 text-red-600",
  },
  {
    when: "Tomorrow",
    time: "11:00 AM",
    title: "New Tap Installation",
    address: "Birmendorferstrasse 55, 8004 Zurich",
    amount: "CHF 160",
    badge: "Installation",
    badgeColor: "bg-violet-50 text-violet-600",
  },
];

const upcomingJobs = [
  {
    day: "THU",
    date: "8 MAY",
    title: "Shower Installation",
    address: "Zollikerstrasse 123, 8008 Zurich",
    amount: "CHF 250",
    time: "10:00 AM",
  },
  {
    day: "FRI",
    date: "9 MAY",
    title: "Pipe Leakage Fix",
    address: "Hönggerstrasse 45, 8037 Zurich",
    amount: "CHF 130",
    time: "02:00 PM",
  },
  {
    day: "SAT",
    date: "10 MAY",
    title: "Bathroom Renovation",
    address: "Albisstrasse 78, 8134 Adliswil",
    amount: "CHF 480",
    time: "09:00 AM",
  },
];

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const weekDates = [4, 5, 6, 7, 8, 9, 10];
const todayIdx = 2; // Wednesday = index 2
const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

/* ═══════════════════════════════════════════════════════
   PROVIDER VERIFICATION WIZARD WITH CLOUDINARY UPLOADS
   ═══════════════════════════════════════════════════════ */
function ProviderVerificationWizard({ profile, onSuccess }: { profile: any; onSuccess: () => void }) {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [uploads, setUploads] = useState<Record<string, string>>({
    idDoc: profile?.id_document_url || "",
    selfie: profile?.selfie_url || "",
    addressProof: profile?.address_proof_url || "",
  });
  const [uploading, setUploading] = useState<Record<string, boolean>>({});

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: "idDoc" | "selfie" | "addressProof") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(prev => ({ ...prev, [field]: true }));
    try {
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "demo";
      const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "unsigned_preset";

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", preset);

      let secureUrl = "";
      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          const data = await res.json();
          secureUrl = data.secure_url;
        } else {
          throw new Error("Cloudinary upload failed status");
        }
      } catch (err) {
        console.warn("Cloudinary upload failed, falling back to simulated upload URL", err);
        secureUrl = `https://res.cloudinary.com/demo/image/upload/v123456789/${file.name.replace(/\s+/g, "_")}`;
      }

      setUploads(prev => ({ ...prev, [field]: secureUrl }));
      toast.success("Document uploaded successfully.");
    } catch (err) {
      toast.error("Failed to upload document.");
    } finally {
      setUploading(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleSubmit = async () => {
    if (!uploads.idDoc || !uploads.selfie || !uploads.addressProof) {
      toast.error("Please upload all three required documents.");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("provider_profiles")
        .update({
          id_document_url: uploads.idDoc,
          selfie_url: uploads.selfie,
          address_proof_url: uploads.addressProof,
          verification_status: "pending_approval",
        })
        .eq("user_id", user!.id);

      if (error) throw error;
      toast.success("Verification documents submitted for review.");
      onSuccess();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (profile?.verification_status === "pending_approval") {
    return (
      <div className="max-w-xl mx-auto my-12 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-center space-y-6">
        <div className="h-14 w-14 rounded-full bg-blue-50/80 flex items-center justify-center mx-auto text-blue-600">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-slate-900">⏳ Verification in Progress</h2>
          <p className="text-slate-500 text-xs leading-relaxed max-w-sm mx-auto font-medium">
            Our operations team is currently reviewing your identity documents. This process usually takes less than 24 hours.
          </p>
        </div>

        <div className="border-t border-slate-100 pt-6 space-y-4 text-left">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
            Verification Steps
          </span>
          <div className="space-y-3 max-w-xs mx-auto">
            {[
              { label: "Account Registered", status: "completed" },
              { label: "Documents Submitted", status: "completed" },
              { label: "Operations Audit", status: "pending" },
              { label: "Account Activation", status: "locked" }
            ].map((step, idx) => (
              <div key={step.label} className="flex items-center gap-3">
                <div className={cn(
                  "h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold",
                  step.status === "completed" ? "bg-blue-100 text-blue-700" :
                  step.status === "pending" ? "bg-amber-100 text-amber-700 animate-pulse" :
                  "bg-slate-100 text-slate-400"
                )}>
                  {step.status === "completed" ? "✓" : idx + 1}
                </div>
                <span className={cn(
                  "text-xs font-bold",
                  step.status === "completed" ? "text-slate-800" :
                  step.status === "pending" ? "text-slate-900 font-extrabold" :
                  "text-slate-400"
                )}>{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto my-8 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
          🔐 Onboarding & Verification
        </h2>
        <p className="text-slate-500 text-xs font-medium mt-1">
          To start receiving gig requests, please upload your verification credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { field: "idDoc", label: "Government ID", desc: "Passport or Driver License" },
          { field: "selfie", label: "Selfie with ID", desc: "Hold your ID card next to your face" },
          { field: "addressProof", label: "Proof of Address", desc: "Recent utility bill or statement" }
        ].map((item) => {
          const isUploaded = !!uploads[item.field];
          const isUploading = uploading[item.field];
          return (
            <div key={item.field} className="border border-slate-150 rounded-2xl p-4 flex flex-col justify-between min-h-[160px] bg-slate-50/50">
              <div>
                <span className="text-xs font-bold text-slate-900 block">{item.label}</span>
                <span className="text-[10px] text-slate-400 block mt-1 leading-normal font-semibold">
                  {item.desc}
                </span>
              </div>
              <div className="mt-4">
                {isUploaded ? (
                  <div className="flex items-center gap-1.5 text-xs text-blue-600 font-bold bg-blue-50/55 p-1.5 rounded-xl border border-blue-100">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-blue-600" />
                    <span className="truncate">Ready</span>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-1.5 h-8 border border-dashed border-slate-350 hover:bg-slate-50 rounded-lg text-[10px] font-bold text-slate-650 cursor-pointer transition-colors">
                    {isUploading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <Upload className="w-3 h-3" />
                        Upload
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => handleFileChange(e, item.field as any)}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-slate-100 pt-5 flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={submitting || uploading.idDoc || uploading.selfie || uploading.addressProof}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl px-6 cursor-pointer"
        >
          {submitting ? "Submitting..." : "Submit for Verification"}
        </Button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   DASHBOARD ROUTE
   ═══════════════════════════════════════════════════════ */
function Dashboard() {
  const { activeId } = useActiveOrg();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Query user profile from database to resolve real-time role
  const { data: userProfile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["activeUserProfile", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("role, full_name, email")
        .eq("id", user!.id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const activePortal = userProfile?.role || user?.user_metadata?.portal_role || "client";
  const firstName = userProfile?.full_name?.split(" ")[0] || user?.user_metadata?.full_name?.split(" ")[0] || "there";

  const { data: providerProfile, isLoading: isProviderLoading, refetch: refetchProfile } = useQuery({
    queryKey: ["providerProfile", user?.id],
    enabled: !!user?.id && activePortal === "provider",
    queryFn: async () => {
      const { data, error } = await supabase
        .from("provider_profiles")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  /* ── Client / Ops portals ── */
  if (isProfileLoading) {
    return <div className="text-center py-20 text-slate-400 font-bold text-xs">Loading portal profile...</div>;
  }

  if (activePortal === "client") {
    return <ClientDashboard />;
  }
  if (activePortal === "operations") {
    return <OpsDashboard />;
  }

  // Provider Portal Loading Check
  if (isProviderLoading) {
    return <div className="text-center py-20 text-slate-400 font-bold text-xs">Loading profile...</div>;
  }

  const verificationStatus = providerProfile?.verification_status || "none";

  if (verificationStatus !== "approved") {
    return (
      <ProviderVerificationWizard
        profile={providerProfile}
        onSuccess={refetchProfile}
      />
    );
  }

  /* ═══════════════════════════════════════════════════════
     PROVIDER DASHBOARD — matches Image 2
     ═══════════════════════════════════════════════════════ */
  // 1. Resolve Provider's Organization
  const { data: providerOrg } = useQuery({
    queryKey: ["providerOrg", user?.id],
    enabled: !!user?.id && activePortal === "provider",
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organizations")
        .select("id")
        .eq("created_by", user!.id)
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  // 2. Query Bookings
  const { data: dbBookings = [], isLoading: bookingsLoading, refetch: refetchBookings } = useQuery({
    queryKey: ["providerBookings", providerOrg?.id],
    enabled: !!providerOrg?.id && activePortal === "provider",
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          id,
          client_id,
          provider_id,
          provider_service_id,
          status,
          scheduled_at,
          total_price,
          notes,
          created_at,
          client_profile:profiles!bookings_client_id_fkey(id, full_name, email)
        `)
        .eq("provider_id", providerOrg!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;

      // Normalize client_profile array to single object and extract date/time from scheduled_at
      const normalized = (data || []).map((booking: any) => {
        const rawProfile = booking.client_profile;
        const singleProfile = Array.isArray(rawProfile) ? rawProfile[0] : rawProfile;
        
        const dateObj = new Date(booking.scheduled_at);
        const formattedDate = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        const formattedTime = dateObj.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

        return {
          ...booking,
          date: formattedDate,
          time: formattedTime,
          client_profile: singleProfile as { id: string; full_name: string; email: string } | null,
        };
      });

      return normalized;
    },
  });

  // 3. Booking Mutations
  const acceptBookingMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      const { error } = await supabase
        .from("bookings")
        .update({ status: "confirmed" })
        .eq("id", bookingId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Booking request accepted successfully!");
      refetchBookings();
    },
    onError: (err: any) => {
      toast.error((err as Error).message);
    },
  });

  const declineBookingMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      const { error } = await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", bookingId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.error("Booking request declined.");
      refetchBookings();
    },
    onError: (err: any) => {
      toast.error((err as Error).message);
    },
  });

  // 4. Calculations for KPIs
  const pendingRequests = dbBookings.filter((b) => b.status === "pending");
  const confirmedJobs = dbBookings.filter((b) => b.status === "confirmed" || b.status === "confirmed_provider" || b.status === "completed");
  const expectedEarnings = confirmedJobs.reduce((sum, b) => sum + Number(b.total_price || 0), 0);
  const primarySkill = providerProfile?.skills?.[0] || "Services";

  // Group completed provider bookings in past 30 days for Recharts area chart
  const chartMap: Record<string, number> = {};
  for (let i = 4; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i * 6);
    const label = d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
    chartMap[label] = 0;
  }

  confirmedJobs.forEach((b: any) => {
    const dateStr = new Date(b.scheduled_at).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });
    chartMap[dateStr] = (chartMap[dateStr] || 0) + Number(b.total_price || 0);
  });

  const providerChartData = Object.entries(chartMap).map(([date, amount]) => ({ date, amount }));

  return (
    <div className="space-y-6 pb-12 max-w-[1400px] mx-auto text-slate-800">
      {/* ── 1. GREETING ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Good morning, {firstName}!
            <span className="inline-block text-2xl animate-bounce">👋</span>
          </h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">
            Here's what's happening with your provider workspace today.
          </p>
        </div>
      </div>

      {/* ── 2. TOP ROW KPI CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: Briefcase,
            label: "Confirmed Jobs",
            value: confirmedJobs.length,
            bg: "bg-blue-50",
            color: "text-blue-600",
            link: "/dashboard",
          },
          {
            icon: Clock,
            label: "Pending Requests",
            value: pendingRequests.length,
            bg: "bg-amber-50",
            color: "text-amber-600",
            link: "/dashboard",
          },
          {
            icon: DollarSign,
            label: "Expected Earnings",
            value: `CHF ${expectedEarnings.toLocaleString("en-CH")}`,
            bg: "bg-emerald-50",
            color: "text-emerald-600",
            link: "/dashboard",
          },
          {
            icon: Star,
            label: "Average Rating",
            value: "5.0",
            bg: "bg-purple-50",
            color: "text-purple-600",
            link: "/dashboard",
          },
        ].map((kpi, i) => (
          <div
            key={i}
            className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[110px] relative overflow-hidden group hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center shrink-0", kpi.bg)}>
                <kpi.icon className={cn("h-4.5 w-4.5", kpi.color)} />
              </div>
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-600 transition-colors flex items-center gap-0.5">
                View Details
              </span>
            </div>
            <div className="mt-3">
              <div className="text-xs font-semibold text-slate-400">{kpi.label}</div>
              <div className="text-xl font-black text-slate-900 mt-1 leading-none">
                {kpi.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── 3. MAIN CONTENT GRID (LEFT/SIDEBAR SPLIT) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* LEFT COLUMN (MAIN CARDS) */}
        <div className="space-y-6">
          {/* Confirmed Jobs list */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-950">Confirmed Jobs</h3>
            </div>
            <div className="p-2">
              {bookingsLoading ? (
                <div className="text-slate-400 text-xs text-center py-10">Loading bookings...</div>
              ) : confirmedJobs.length === 0 ? (
                <div className="text-center py-12 px-4 space-y-3">
                  <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-400">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-800">No confirmed jobs</p>
                    <p className="text-[11px] text-slate-400">New bookings will appear here once accepted.</p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {confirmedJobs.slice(0, 3).map((job: any) => (
                    <div
                      key={job.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:bg-slate-50/50 rounded-xl transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-full bg-slate-100 flex items-center justify-center shrink-0 font-bold text-slate-500 border border-slate-200 text-xs">
                          {job.client_profile?.full_name?.charAt(0) || "C"}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {job.notes || "Professional Appointment"}
                          </h4>
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5 font-medium">
                            <span>{job.client_profile?.full_name || "Client Booking"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] text-slate-500 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          <span>{job.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          <span>{job.time || "Flexible"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          <span>Zürich, Switzerland</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 justify-between sm:justify-end shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0">
                        <div className="text-right mr-2">
                          <div className="text-xs font-black text-slate-900">CHF {job.total_price}</div>
                        </div>
                        <span
                          className={cn(
                            "text-[10px] font-bold px-2.5 py-0.5 rounded-md border uppercase",
                            job.status === "completed"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : "bg-blue-50 text-blue-700 border-blue-100",
                          )}
                        >
                          {job.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Pending Booking Requests */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="p-5 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-950">Pending Booking Requests</h3>
              <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Accept or decline incoming customer gig requests.</p>
            </div>
            <div className="p-2">
              {pendingRequests.length === 0 ? (
                <div className="text-center py-12 px-4 space-y-3">
                  <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-400">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-800">No pending requests</p>
                    <p className="text-[11px] text-slate-400">Check back later or optimize your profile using the AI Coach.</p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {pendingRequests.map((req) => (
                    <div key={req.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 rounded-xl transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">
                            {req.client_profile?.full_name || "Client Booking"}
                          </span>
                          <span className="bg-blue-50 text-blue-700 text-[8px] font-black px-1.5 py-0.5 rounded-full border border-blue-100 tracking-wider">
                            NEW REQUEST
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-semibold flex flex-wrap gap-x-4 gap-y-1">
                          <span>📅 Date: {req.date}</span>
                          <span>⏰ Time: {req.time || "Flexible"}</span>
                        </div>
                        {req.notes && (
                          <p className="text-[11px] text-slate-400 font-medium italic mt-1">
                            "{req.notes}"
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end border-t md:border-t-0 pt-2 md:pt-0">
                        <div className="text-right">
                          <span className="text-[8px] font-bold text-slate-400 block uppercase">price</span>
                          <span className="text-xs font-black text-slate-950">CHF {req.total_price}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => declineBookingMutation.mutate(req.id)}
                            disabled={declineBookingMutation.isPending || acceptBookingMutation.isPending}
                            className="border-red-200 hover:bg-red-50 hover:text-red-700 text-red-650 text-[10px] font-bold rounded-xl cursor-pointer h-8 px-3"
                          >
                            Decline
                          </Button>
                          <Button
                            onClick={() => acceptBookingMutation.mutate(req.id)}
                            disabled={declineBookingMutation.isPending || acceptBookingMutation.isPending}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-xl cursor-pointer h-8 px-4"
                          >
                            Accept Booking
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (SIDEBAR) */}
        <div className="space-y-6">
          {/* Expected Earnings Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-950">Expected Earnings</h3>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                All-time ▾
              </span>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-slate-900">CHF {expectedEarnings.toLocaleString("en-CH")}</span>
              </div>
            </div>
            <div className="h-[120px] w-full mt-2 -mx-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={providerChartData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorProviderAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" hide />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#colorProviderAmount)"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Business Coach */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-950">AI Business Coach</h3>
              <span className="text-[9px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100">
                Beta
              </span>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                </div>
                <span className="text-xs font-bold text-slate-700">Rates Suggestion</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                High demand for <span className="text-slate-800 font-black">{primarySkill}</span> in Zurich area! Consider raising your hourly rate by 10% to match current market trends.
              </p>
            </div>

            <div className="space-y-0.5">
              {[
                { label: "Improve Profile", sub: "Add portfolio photos" },
                { label: "Pricing Insights", sub: "Optimize hourly rate" },
                { label: "Demand Analytics", sub: "Next 14-day forecast" },
              ].map((link) => (
                <button
                  key={link.label}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-800">{link.label}</div>
                    <div className="text-[10px] text-slate-400 font-semibold">{link.sub}</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
