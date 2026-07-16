import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useActiveOrg } from "@/hooks/use-orgs";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import {
  Users,
  UserPlus,
  Mail,
  Trash2,
  Clock,
  ShieldCheck,
  CheckCircle,
  Copy,
  User,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/app-shell";

export function EmployeesPage() {
  const { activeId } = useActiveOrg();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"member" | "admin">("member");

  // Query active employees
  const { data: employees = [], isLoading: employeesLoading } = useQuery({
    queryKey: ["companyEmployeesList", activeId],
    enabled: !!activeId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organization_members")
        .select(
          `
          id,
          role,
          user_id,
          created_at,
          profile:profiles(id, full_name, email)
        `,
        )
        .eq("organization_id", activeId!);
      if (error) throw error;
      return data || [];
    },
  });

  // Query pending invites
  const { data: invites = [], isLoading: invitesLoading } = useQuery({
    queryKey: ["companyInvitesList", activeId],
    enabled: !!activeId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organization_invites")
        .select("*")
        .eq("organization_id", activeId!)
        .is("accepted_at", null)
        .gt("expires_at", new Date().toISOString());
      if (error) throw error;
      return data || [];
    },
  });

  // Create invite mutation
  const inviteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("organization_invites").insert({
        organization_id: activeId!,
        email: inviteEmail,
        role: inviteRole,
        invited_by: user!.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Invitation created! Copy the link to invite your employee.");
      queryClient.invalidateQueries({ queryKey: ["companyInvitesList", activeId] });
      setInviteEmail("");
      setInviteOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to create invitation.");
    },
  });

  // Remove member mutation
  const removeMemberMutation = useMutation({
    mutationFn: async (memberId: string) => {
      const { error } = await supabase.from("organization_members").delete().eq("id", memberId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Employee removed from organization.");
      queryClient.invalidateQueries({ queryKey: ["companyEmployeesList", activeId] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to remove employee.");
    },
  });

  // Delete invite mutation
  const cancelInviteMutation = useMutation({
    mutationFn: async (inviteId: string) => {
      const { error } = await supabase.from("organization_invites").delete().eq("id", inviteId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Invitation cancelled.");
      queryClient.invalidateQueries({ queryKey: ["companyInvitesList", activeId] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to cancel invitation.");
    },
  });

  const handleCopyInviteLink = (token: string) => {
    const inviteLink = `${window.location.origin}/invite/${token}`;
    navigator.clipboard.writeText(inviteLink);
    toast.success("Invite link copied to clipboard!");
  };

  return (
    <div className="space-y-6 pb-12 max-w-[1400px] mx-auto text-slate-800">
      <PageHeader
        title={
          <div className="flex items-center gap-2 text-slate-900">
            <Users className="h-6 w-6 text-slate-900" /> Employees & Team
          </div>
        }
        description="Add, remove, and manage roles and permissions for your team members."
        action={
          <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2 font-bold cursor-pointer">
                <UserPlus className="h-4 w-4" /> Invite Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Invite Employee to Team</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-bold text-slate-700">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="employee@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-xs font-bold text-slate-700">
                    Team Role
                  </Label>
                  <select
                    id="role"
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="member">Member (Can complete jobs)</option>
                    <option value="admin">Admin (Can manage organization & bookings)</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setInviteOpen(false)}
                  className="rounded-xl text-xs font-bold"
                >
                  Cancel
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
                  onClick={() => inviteMutation.mutate()}
                  disabled={!inviteEmail || inviteMutation.isPending}
                >
                  {inviteMutation.isPending ? "Sending..." : "Create Invite"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* Employees List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-950">Active Team Members</h3>
          </div>
          <div className="p-0">
            {employeesLoading ? (
              <div className="py-12 text-center text-slate-400 text-xs font-bold">
                Loading employees...
              </div>
            ) : employees.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Users className="h-8 w-8 mx-auto text-slate-350 mb-2" />
                <p className="text-xs font-bold text-slate-800">No team members</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Invite your employees using the invite button.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {employees.map((member: any) => {
                  const initials =
                    member.profile?.full_name
                      ?.split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase() || "?";

                  return (
                    <div key={member.id} className="p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center font-black text-blue-600 text-xs">
                          {initials}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">
                            {member.profile?.full_name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-semibold">
                            {member.profile?.email}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border",
                            member.role === "owner"
                              ? "bg-purple-50 text-purple-700 border-purple-100"
                              : member.role === "admin"
                                ? "bg-blue-50 text-blue-700 border-blue-100"
                                : "bg-slate-50 text-slate-700 border-slate-100",
                          )}
                        >
                          {member.role}
                        </span>

                        {member.user_id !== user?.id && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeMemberMutation.mutate(member.id)}
                            className="h-8 w-8 text-slate-400 hover:text-red-650 hover:bg-red-50 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Pending Invites Sidebar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 h-fit">
          <h3 className="text-sm font-bold text-slate-950 flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-500" /> Pending Invitations
          </h3>

          <div className="space-y-3">
            {invitesLoading ? (
              <p className="text-slate-400 text-xs text-center">Loading invites...</p>
            ) : invites.length === 0 ? (
              <p className="text-slate-450 text-[11px] text-center font-medium py-4">
                No pending invitations.
              </p>
            ) : (
              invites.map((invite: any) => (
                <div
                  key={invite.id}
                  className="border border-slate-100 rounded-xl p-3 bg-slate-50/50 space-y-2"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {invite.email}
                      </div>
                      <div className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                        {invite.role}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => cancelInviteMutation.mutate(invite.id)}
                      className="h-6 w-6 text-slate-400 hover:text-red-650 hover:bg-red-50 rounded-md cursor-pointer shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100/50">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyInviteLink(invite.token)}
                      className="h-6 text-[9px] font-bold border-slate-200 rounded-lg flex-1 cursor-pointer flex items-center justify-center gap-1 text-slate-600"
                    >
                      <Copy className="h-3 w-3" /> Copy Link
                    </Button>
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
