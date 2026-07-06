import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Mail, Trash2, Copy, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useActiveOrg } from "@/hooks/use-orgs";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { active, activeId } = useActiveOrg();
  const { user } = useAuth();
  const qc = useQueryClient();
  const isAdmin = active?.role === "owner" || active?.role === "admin";

  const [orgName, setOrgName] = useState(active?.organization.name ?? "");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"member" | "admin">("member");

  const members = useQuery({
    queryKey: ["members", activeId],
    enabled: !!activeId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organization_members")
        .select("id, role, user_id, created_at, profile:profiles(email, full_name)")
        .eq("organization_id", activeId!);
      if (error) throw error;
      return data ?? [];
    },
  });

  const invites = useQuery({
    queryKey: ["invites", activeId],
    enabled: !!activeId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organization_invites")
        .select("*")
        .eq("organization_id", activeId!)
        .is("accepted_at", null)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const renameOrg = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("organizations")
        .update({ name: orgName })
        .eq("id", activeId!);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Workspace renamed");
      qc.invalidateQueries({ queryKey: ["orgs"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const invite = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("organization_invites").insert({
        organization_id: activeId!,
        email: inviteEmail.trim().toLowerCase(),
        role: inviteRole,
        invited_by: user!.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Invite created");
      setInviteEmail("");
      qc.invalidateQueries({ queryKey: ["invites"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const revokeInvite = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("organization_invites").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Invite revoked");
      qc.invalidateQueries({ queryKey: ["invites"] });
    },
  });

  const removeMember = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("organization_members").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Member removed");
      qc.invalidateQueries({ queryKey: ["members"] });
    },
  });

  function copyInvite(token: string) {
    const url = `${window.location.origin}/invite/${token}`;
    navigator.clipboard.writeText(url);
    toast.success("Invite link copied");
  }

  return (
    <div>
      <PageHeader title="Settings" description="Manage your workspace, team, and preferences." />

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="invites">Invites</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <div className="max-w-lg space-y-4 rounded-xl border border-border bg-card p-6">
            <div className="space-y-1.5">
              <Label>Workspace name</Label>
              <Input
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                disabled={!isAdmin}
              />
            </div>
            <Button
              onClick={() => renameOrg.mutate()}
              disabled={
                !isAdmin ||
                !orgName.trim() ||
                renameOrg.isPending ||
                orgName === active?.organization.name
              }
            >
              Save changes
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="members" className="mt-6">
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            {members.data?.map((m) => {
              const p = m.profile as { email?: string; full_name?: string } | null;
              return (
                <div
                  key={m.id}
                  className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-0"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-xs font-medium text-primary">
                    {(p?.full_name || p?.email || "?").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">{p?.full_name ?? p?.email}</div>
                    <div className="truncate text-xs text-muted-foreground">{p?.email}</div>
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    {m.role}
                  </Badge>
                  {isAdmin && m.user_id !== user?.id && m.role !== "owner" && (
                    <button
                      onClick={() => {
                        if (confirm("Remove member?")) removeMember.mutate(m.id);
                      }}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="invites" className="mt-6 space-y-6">
          {isAdmin && (
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 text-sm font-medium">
                <UserPlus className="h-4 w-4" /> Invite a teammate
              </div>
              <div className="mt-4 flex flex-col gap-3 md:flex-row">
                <Input
                  placeholder="teammate@company.com"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="flex-1"
                />
                <Select
                  value={inviteRole}
                  onValueChange={(v) => setInviteRole(v as "member" | "admin")}
                >
                  <SelectTrigger className="md:w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => invite.mutate()}
                  disabled={!inviteEmail.trim() || invite.isPending}
                >
                  Send invite
                </Button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Invites generate a shareable link. Share it with your teammate; they'll sign in and
                join automatically.
              </p>
            </div>
          )}

          <div className="overflow-hidden rounded-xl border border-border bg-card">
            {invites.data && invites.data.length > 0 ? (
              invites.data.map((i) => (
                <div
                  key={i.id}
                  className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-0"
                >
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">{i.email}</div>
                    <div className="text-xs text-muted-foreground">
                      Expires {new Date(i.expires_at).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    {i.role}
                  </Badge>
                  <button
                    onClick={() => copyInvite(i.token)}
                    className="text-muted-foreground hover:text-foreground"
                    title="Copy invite link"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => revokeInvite.mutate(i.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center text-sm text-muted-foreground">
                No pending invites.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
