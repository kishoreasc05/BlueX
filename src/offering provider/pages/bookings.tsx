import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useActiveOrg } from "@/hooks/use-orgs";
import { useState } from "react";
import { toast } from "sonner";
import { Calendar, Clock, DollarSign, MessageSquare, Check, X, ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/kpi-card";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";

export function ProviderBookingsPage() {
  const { user } = useAuth();
  const { activeId } = useActiveOrg();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [listSubTab, setListSubTab] = useState<"confirmed" | "pending" | "completed" | "cancelled">(
    "confirmed",
  );
  const [selectedAssignees, setSelectedAssignees] = useState<Record<string, string>>({});

  // Query provider profile to determine type (individual vs company)
  const { data: providerProfile } = useQuery({
    queryKey: ["providerProfileBookings", user?.id],
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
    queryKey: ["companyEmployeesBookings", activeId],
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

  // Query bookings for this provider organization
  const { data: bookings, isLoading } = useQuery({
    queryKey: ["providerBookings", activeId],
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
          client:profiles!bookings_client_id_fkey(id, full_name, customer_id, phone, home_address, city),
          service:provider_services(name)
        `,
        )
        .eq("provider_id", activeId!)
        .order("scheduled_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Mutation to accept or decline a booking request
  const updateBookingStatus = useMutation({
    mutationFn: async ({
      id,
      newStatus,
      assignedEmployeeId,
    }: {
      id: string;
      newStatus: "confirmed" | "cancelled";
      assignedEmployeeId?: string;
    }) => {
      const updateData: Record<string, any> = { status: newStatus };
      if (newStatus === "confirmed" && assignedEmployeeId) {
        updateData.assigned_employee_id = assignedEmployeeId;
      }
      const { error } = await supabase.from("bookings").update(updateData).eq("id", id);
      if (error) throw error;

      // Find the booking to get the client id and post chat notification
      const bookingRecord = bookings?.find((b) => b.id === id);
      if (bookingRecord && user) {
        const content =
          newStatus === "confirmed"
            ? `✅ Booking request accepted!${assignedEmployeeId ? " An employee has been assigned to your service." : ""}`
            : "❌ Booking request declined.";

        await supabase.from("messages").insert({
          sender_id: user.id,
          receiver_id: bookingRecord.client_id,
          booking_id: id,
          content,
        });
      }
    },
    onSuccess: (_, variables) => {
      toast.success(
        variables.newStatus === "confirmed" ? "Booking accepted!" : "Booking declined.",
      );
      queryClient.invalidateQueries({ queryKey: ["providerBookings", activeId] });
      queryClient.invalidateQueries({ queryKey: ["messagesForUser"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update booking status.");
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
      queryClient.invalidateQueries({ queryKey: ["providerBookings", activeId] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update assignment.");
    },
  });

  const filteredBookings = (bookings || []).filter((b) => {
    if (listSubTab === "confirmed") return b.status === "confirmed";
    if (listSubTab === "pending") return b.status === "pending";
    if (listSubTab === "completed") return b.status === "completed";
    return b.status === "cancelled" || b.status === "declined";
  });

  return (
    <div className="space-y-6 pb-12 max-w-[1400px] mx-auto text-slate-800">
      <PageHeader
        title="Jobs Bookings"
        description="View and manage customer bookings, accept new job requests, and communicate with clients."
      />

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        {(["confirmed", "pending", "completed", "cancelled"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setListSubTab(tab)}
            className={cn(
              "px-4 py-2 text-xs font-bold border-b-2 capitalize transition-all cursor-pointer",
              listSubTab === tab
                ? "border-blue-650 border-blue-600 text-blue-600 font-extrabold"
                : "border-transparent text-slate-450 text-slate-500 hover:text-slate-700",
            )}
          >
            {tab === "cancelled" ? "Cancelled / Declined" : `${tab} Requests`}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-12 text-center text-slate-400 font-medium">
          Loading bookings...
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-12 text-center">
          <EmptyState
            title={`No ${listSubTab} bookings`}
            description={`You do not have any ${listSubTab} bookings at the moment.`}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredBookings.map((booking) => {
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
                className="bg-white border border-slate-200/80 shadow-sm rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-all duration-255"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-bold text-slate-900 text-sm md:text-base">{serviceName}</h3>
                    <span
                      className={cn(
                        "text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-wider",
                        booking.status === "completed"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : booking.status === "confirmed"
                            ? "bg-blue-50 text-blue-700 border-blue-100"
                            : booking.status === "pending"
                              ? "bg-amber-50 text-amber-700 border-amber-100"
                              : "bg-slate-50 text-slate-700 border-slate-100",
                      )}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-6 text-xs text-slate-500 font-semibold">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Customer:</span>
                      <span className="text-slate-800">{clientName}</span>
                      {client?.customer_id && (
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[9px] font-bold text-slate-500">
                          {client.customer_id}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{booking.duration_hours} hours</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                      <span>Total Price: CHF {Number(booking.total_price).toFixed(2)}</span>
                    </div>
                    {client?.home_address && (
                      <div className="flex items-center gap-1.5 sm:col-span-2">
                        <span className="text-slate-400">Address:</span>
                        <span className="text-slate-800">
                          {client.home_address}, {client.city}
                        </span>
                      </div>
                    )}
                  </div>

                  {booking.notes && (
                    <p className="text-xs text-slate-405 text-slate-400 italic bg-slate-50/50 p-2 rounded-lg mt-1 border border-slate-100">
                      Notes: {booking.notes}
                    </p>
                  )}

                  {isCompany && booking.status === "confirmed" && (
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 w-fit">
                      <span className="text-[10px] text-slate-400 font-bold">Assignee:</span>
                      <select
                        value={booking.assigned_employee_id || ""}
                        onChange={(e) =>
                          updateAssigneeMutation.mutate({
                            id: booking.id,
                            employeeId: e.target.value || null,
                          })
                        }
                        className="h-7 px-2 rounded-md border border-slate-200 bg-slate-50 text-[10px] focus:outline-none focus:ring-1 focus:ring-blue-600 font-bold cursor-pointer"
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

                  {isCompany && booking.status === "pending" && (
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 w-fit">
                      <span className="text-[10px] text-slate-400 font-bold">Assign to:</span>
                      <select
                        value={selectedAssignees[booking.id] || ""}
                        onChange={(e) =>
                          setSelectedAssignees((prev) => ({
                            ...prev,
                            [booking.id]: e.target.value,
                          }))
                        }
                        className="h-7 px-2 rounded-md border border-slate-200 bg-white text-[10px] focus:outline-none focus:ring-1 focus:ring-blue-600 font-bold cursor-pointer"
                      >
                        <option value="">Choose Employee</option>
                        {employees.map((member: any) => (
                          <option key={member.id} value={member.profile?.id}>
                            {member.profile?.full_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 md:self-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl text-xs gap-1.5 cursor-pointer h-9 px-3.5"
                    onClick={() =>
                      navigate({ to: "/client/messages", search: { bookingId: booking.id } as any })
                    }
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400" /> Chat
                  </Button>

                  {booking.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        disabled={updateBookingStatus.isPending}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs gap-1.5 cursor-pointer h-9 px-3.5"
                        onClick={() =>
                          updateBookingStatus.mutate({
                            id: booking.id,
                            newStatus: "confirmed",
                            assignedEmployeeId: selectedAssignees[booking.id],
                          })
                        }
                      >
                        <Check className="w-3.5 h-3.5" /> Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={updateBookingStatus.isPending}
                        className="border-red-200 hover:bg-red-50 text-red-650 hover:text-red-700 text-red-600 rounded-xl text-xs gap-1.5 cursor-pointer h-9 px-3.5"
                        onClick={() =>
                          updateBookingStatus.mutate({ id: booking.id, newStatus: "cancelled" })
                        }
                      >
                        <X className="w-3.5 h-3.5" /> Decline
                      </Button>
                    </>
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
