import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { Activity, Clock, Calendar, XCircle, UserCheck, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/kpi-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function OpsBookingsPage() {
  const queryClient = useQueryClient();
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [reassignOpen, setReassignOpen] = useState(false);
  const [newOrgId, setNewOrgId] = useState("");

  // 1. Fetch bookings
  const { data: bookings, isLoading } = useQuery({
    queryKey: ["opsBookings"],
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
          client:profiles(full_name, email),
          provider:organizations(id, name),
          service:provider_services(name)
        `,
        )
        .order("scheduled_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // 2. Fetch all verified providers' organizations
  const { data: availableProviders = [] } = useQuery({
    queryKey: ["verifiedProvidersOrgs"],
    queryFn: async () => {
      const { data: verifiedProfiles, error: profilesError } = await supabase
        .from("provider_profiles")
        .select("user_id")
        .eq("verification_status", "approved");

      if (profilesError) throw profilesError;
      const userIds = verifiedProfiles?.map((p) => p.user_id) || [];

      if (userIds.length === 0) return [];

      const { data: orgs, error: orgsError } = await supabase
        .from("organizations")
        .select("id, name")
        .in("created_by", userIds);

      if (orgsError) throw orgsError;
      return orgs || [];
    },
  });

  // 3. Cancel Mutation
  const cancelBooking = useMutation({
    mutationFn: async (bookingId: string) => {
      const { error } = await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", bookingId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Booking cancelled successfully.");
      queryClient.invalidateQueries({ queryKey: ["opsBookings"] });
      queryClient.invalidateQueries({ queryKey: ["opsDashboardData"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // 4. Reassign Mutation
  const reassignMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("bookings")
        .update({ provider_id: newOrgId })
        .eq("id", selectedBooking.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Booking reassigned successfully!");
      queryClient.invalidateQueries({ queryKey: ["opsBookings"] });
      setReassignOpen(false);
      setSelectedBooking(null);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleReassignClick = (booking: any) => {
    setSelectedBooking(booking);
    setNewOrgId(booking.provider?.id || "");
    setReassignOpen(true);
  };

  return (
    <div className="space-y-6 pb-12 max-w-[1400px] mx-auto text-slate-800">
      <PageHeader
        title="Marketplace Bookings Monitor"
        description="Monitor all service contracts, transactions, and bookings in Switzerland."
      />

      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
        {isLoading ? (
          <p className="text-sm text-slate-500 text-center py-12">Loading platform bookings...</p>
        ) : !bookings || bookings.length === 0 ? (
          <EmptyState
            title="No bookings recorded"
            description="No bookings have been made on the platform yet."
            icon={Activity}
          />
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                  Provider
                </th>
                <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                  Schedule
                </th>
                <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                  Total price
                </th>
                <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.map((b: any) => (
                <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">
                      {b.service?.name || "General Service"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800 text-xs">
                      {b.client?.full_name || "Unknown"}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{b.client?.email}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-xs font-semibold">
                    {b.provider?.name || "Independent"}
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-xs">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(b.scheduled_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(b.scheduled_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      ({b.duration_hours}h)
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                        b.status === "completed"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : b.status === "confirmed"
                            ? "bg-blue-50 text-blue-700 border-blue-100"
                            : b.status === "pending"
                              ? "bg-amber-50 text-amber-700 border-amber-100"
                              : "bg-red-50 text-red-700 border-red-100"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-900 font-bold text-xs">
                    CHF {Number(b.total_price).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {b.status !== "cancelled" && b.status !== "completed" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-600 border-blue-100 hover:bg-blue-50 rounded-xl text-xs gap-1 cursor-pointer font-bold"
                            onClick={() => handleReassignClick(b)}
                          >
                            <UserCheck className="w-3.5 h-3.5" /> Reassign
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-650 hover:bg-red-50 rounded-xl text-xs gap-1 cursor-pointer"
                            onClick={() => cancelBooking.mutate(b.id)}
                            disabled={cancelBooking.isPending}
                          >
                            <XCircle className="w-3.5 h-3.5" /> Force Cancel
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Reassign Provider Dialog ── */}
      <Dialog open={reassignOpen} onOpenChange={setReassignOpen}>
        <DialogContent className="max-w-md p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-950 flex items-center gap-1.5">
              🔄 Manual Provider Dispatch Reassignment
            </DialogTitle>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4 py-4">
              <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[9px] block">
                    Customer / Service
                  </span>
                  <span className="text-slate-900 font-bold">
                    {selectedBooking.client?.full_name} — {selectedBooking.service?.name}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[9px] block">
                    Current Provider
                  </span>
                  <span className="text-slate-600 font-semibold">
                    {selectedBooking.provider?.name || "Independent"}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-500">
                  Select Target Service Provider
                </Label>
                <Select value={newOrgId} onValueChange={setNewOrgId}>
                  <SelectTrigger className="rounded-xl border-slate-200 h-10">
                    <SelectValue placeholder="Choose provider organization..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableProviders.map((org: any) => (
                      <SelectItem key={org.id} value={org.id}>
                        {org.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-slate-400">
                  Only active, verified individual providers and registered staffing companies
                  appear in this list.
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="pt-4 border-t border-slate-100 flex gap-2">
            <Button
              variant="outline"
              onClick={() => setReassignOpen(false)}
              className="rounded-xl border-slate-200 text-xs font-bold"
            >
              Cancel
            </Button>
            <Button
              onClick={() => reassignMutation.mutate()}
              disabled={reassignMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold px-6 cursor-pointer flex items-center gap-1"
            >
              <CheckCircle2 className="w-4 h-4" /> Confirm Dispatch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
