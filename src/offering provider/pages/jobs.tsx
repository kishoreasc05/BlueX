import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useActiveOrg } from "@/hooks/use-orgs";
import { useState } from "react";
import { toast } from "sonner";
import {
  Calendar,
  Clock,
  DollarSign,
  MessageSquare,
  MapPin,
  User,
  ShieldAlert,
  Sparkles,
  Play,
  CheckCircle,
} from "lucide-react";
import { PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/kpi-card";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";

export function JobsPage() {
  const { user } = useAuth();
  const { activeId } = useActiveOrg();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"today" | "upcoming" | "completed">("today");

  // Query provider profile to determine type (individual vs company)
  const { data: providerProfile } = useQuery({
    queryKey: ["providerProfileJobs", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("provider_profiles")
        .select("provider_type")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
  const isCompany = providerProfile?.provider_type === "company";

  // Query active employees (organization members)
  const { data: employees = [] } = useQuery({
    queryKey: ["companyEmployeesJobs", activeId],
    enabled: !!activeId && isCompany,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organization_members")
        .select(
          `
          id,
          role,
          user_id,
          profile:profiles(id, full_name, email)
        `,
        )
        .eq("organization_id", activeId!);
      if (error) throw error;
      return data || [];
    },
  });

  // Query confirmed, in_progress, and completed bookings for this provider organization
  const { data: bookings, isLoading } = useQuery({
    queryKey: ["providerJobs", activeId],
    enabled: !!activeId,
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
          notes,
          client_id,
          assigned_employee_id,
          client:profiles!bookings_client_id_fkey(id, full_name, customer_id, phone, home_address, apartment_no, postal_code, city),
          service:provider_services(name)
        `,
        )
        .eq("provider_id", activeId!)
        .in("status", ["confirmed", "in_progress", "completed"])
        .order("scheduled_at", { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  // Mutation to update employee assignment
  const updateAssigneeMutation = useMutation({
    mutationFn: async ({ id, employeeId }: { id: string; employeeId: string | null }) => {
      const { error } = await supabase
        .from("bookings")
        .update({ assigned_employee_id: employeeId })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Employee assignment updated!");
      queryClient.invalidateQueries({ queryKey: ["providerJobs", activeId] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update assignment.");
    },
  });

  // Mutation to transition booking status (confirmed -> in_progress -> completed)
  const updateJobStatus = useMutation({
    mutationFn: async ({
      id,
      newStatus,
    }: {
      id: string;
      newStatus: "in_progress" | "completed";
    }) => {
      const { error } = await supabase.from("bookings").update({ status: newStatus }).eq("id", id);
      if (error) throw error;

      // Post chat status update notification
      const bookingRecord = bookings?.find((b) => b.id === id);
      if (bookingRecord && user) {
        const content =
          newStatus === "in_progress"
            ? "🚀 Job started! The provider is on their way or has started the work."
            : "🏁 Job completed! The provider has marked the work as done.";

        await supabase.from("messages").insert({
          sender_id: user.id,
          receiver_id: bookingRecord.client_id,
          booking_id: id,
          content,
        });
      }
    },
    onSuccess: (_, variables) => {
      toast.success(variables.newStatus === "in_progress" ? "Job started!" : "Job completed!");
      queryClient.invalidateQueries({ queryKey: ["providerJobs", activeId] });
      queryClient.invalidateQueries({ queryKey: ["messagesForUser"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update job status.");
    },
  });

  const getFilteredJobs = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tonight = new Date(today);
    tonight.setHours(23, 59, 59, 999);

    return (bookings || []).filter((b) => {
      const jobDate = new Date(b.scheduled_at);
      if (activeTab === "today") {
        return (
          (b.status === "confirmed" || b.status === "in_progress") &&
          jobDate >= today &&
          jobDate <= tonight
        );
      }
      if (activeTab === "upcoming") {
        return b.status === "confirmed" && jobDate > tonight;
      }
      return b.status === "completed";
    });
  };

  const getJobCounts = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tonight = new Date(today);
    tonight.setHours(23, 59, 59, 999);

    let todayCount = 0;
    let upcomingCount = 0;
    let completedCount = 0;

    (bookings || []).forEach((b) => {
      const jobDate = new Date(b.scheduled_at);
      if (b.status === "completed") {
        completedCount++;
      } else if (b.status === "confirmed" || b.status === "in_progress") {
        if (jobDate >= today && jobDate <= tonight) {
          todayCount++;
        } else if (jobDate > tonight) {
          upcomingCount++;
        }
      }
    });

    return { today: todayCount, upcoming: upcomingCount, completed: completedCount };
  };

  const counts = getJobCounts();
  const filteredJobs = getFilteredJobs();

  return (
    <div className="space-y-6 pb-12 max-w-[1400px] mx-auto text-slate-800">
      <PageHeader
        title="My Jobs Feed"
        description="Track active assignments, view client service locations, and update work progress."
      />

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        {(["today", "upcoming", "completed"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 text-xs font-bold border-b-2 capitalize transition-all cursor-pointer",
              activeTab === tab
                ? "border-blue-650 border-blue-600 text-blue-600 font-extrabold"
                : "border-transparent text-slate-450 text-slate-500 hover:text-slate-700",
            )}
          >
            {tab === "today" && `Today's Jobs (${counts.today})`}
            {tab === "upcoming" && `Upcoming Schedule (${counts.upcoming})`}
            {tab === "completed" && `Completed Jobs (${counts.completed})`}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-12 text-center text-slate-400 font-medium">
          Loading jobs...
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-12 text-center">
          <EmptyState
            title={`No ${activeTab} jobs`}
            description={
              activeTab === "today"
                ? "You do not have any jobs scheduled for today."
                : activeTab === "upcoming"
                  ? "You do not have any upcoming bookings in your calendar."
                  : "No completed jobs found."
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {filteredJobs.map((booking) => {
            const client = booking.client as any;
            const clientName = client?.full_name || "Unknown Client";
            const serviceName = (booking.service as any)?.name || "General Service";
            const formattedDate = new Date(booking.scheduled_at).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={booking.id}
                className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 flex flex-col gap-6 hover:shadow-md transition-all duration-250"
              >
                {/* Job Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-extrabold select-none">
                      {clientName
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                        {clientName}
                      </h3>
                      {client?.customer_id && (
                        <span className="text-[10px] font-bold text-slate-400">
                          Customer ID: {client.customer_id}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "text-[9px] font-black px-2.5 py-0.5 rounded-full border uppercase tracking-wider",
                        booking.status === "in_progress"
                          ? "bg-amber-50 text-amber-700 border-amber-100"
                          : booking.status === "completed"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : "bg-blue-50 text-blue-700 border-blue-100",
                      )}
                    >
                      {booking.status === "in_progress" ? "In Progress" : booking.status}
                    </span>
                  </div>
                </div>

                {/* Job Card Body */}
                <div
                  className={cn(
                    "grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold",
                    isCompany ? "lg:grid-cols-4" : "lg:grid-cols-3",
                  )}
                >
                  {/* Service & Pricing */}
                  <div className="space-y-2">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                      Service Offered
                    </span>
                    <span className="text-slate-800 text-sm font-bold block">{serviceName}</span>
                    <div className="flex items-center gap-1 text-slate-500 font-bold mt-1">
                      <DollarSign className="h-4 w-4 text-slate-400" />
                      <span>Estimate Price: CHF {Number(booking.total_price).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="space-y-2">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                      Work Timing
                    </span>
                    <div className="flex items-center gap-2 text-slate-800">
                      <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                      <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 mt-1">
                      <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                      <span>Duration: {booking.duration_hours} hours</span>
                    </div>
                  </div>

                  {/* Customer Address */}
                  <div className="space-y-2">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                      Service Location
                    </span>
                    {client?.home_address ? (
                      <div className="flex items-start gap-2 text-slate-800">
                        <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                        <div>
                          <p>{client.home_address}</p>
                          {client.apartment_no && (
                            <p className="text-[10px] text-slate-500">
                              Apartment: {client.apartment_no}
                            </p>
                          )}
                          <p>
                            {client.postal_code} {client.city}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-400 italic">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span>No address specified by customer</span>
                      </div>
                    )}
                  </div>

                  {/* Assigned Employee (Company Only) */}
                  {isCompany && (
                    <div className="space-y-2">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                        Assigned Employee
                      </span>
                      <select
                        value={booking.assigned_employee_id || ""}
                        disabled={booking.status === "completed"}
                        onChange={(e) =>
                          updateAssigneeMutation.mutate({
                            id: booking.id,
                            employeeId: e.target.value || null,
                          })
                        }
                        className="h-9 px-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 font-bold cursor-pointer w-full"
                      >
                        <option value="">Unassigned</option>
                        {employees.map((member: any) => (
                          <option key={member.id} value={member.profile?.id}>
                            {member.profile?.full_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {booking.notes && (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs text-slate-500 font-semibold italic">
                    Notes: {booking.notes}
                  </div>
                )}

                {/* Card Actions */}
                <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                  <Button
                    variant="outline"
                    onClick={() =>
                      navigate({ to: "/client/messages", search: { bookingId: booking.id } as any })
                    }
                    className="rounded-xl text-xs gap-1.5 h-9 px-4 cursor-pointer"
                  >
                    <MessageSquare className="h-4 w-4 text-slate-400" /> Chat with Client
                  </Button>

                  {booking.status === "confirmed" && (
                    <Button
                      onClick={() =>
                        updateJobStatus.mutate({ id: booking.id, newStatus: "in_progress" })
                      }
                      disabled={updateJobStatus.isPending}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs gap-1.5 h-9 px-4 cursor-pointer"
                    >
                      <Play className="h-4 w-4" /> Start Job
                    </Button>
                  )}

                  {booking.status === "in_progress" && (
                    <Button
                      onClick={() =>
                        updateJobStatus.mutate({ id: booking.id, newStatus: "completed" })
                      }
                      disabled={updateJobStatus.isPending}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs gap-1.5 h-9 px-4 cursor-pointer"
                    >
                      <CheckCircle className="h-4 w-4" /> Complete Job
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
