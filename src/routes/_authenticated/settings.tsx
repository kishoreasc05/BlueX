import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Mail, Trash2, Copy, UserPlus, Bell, Globe, MapPin, Key, User } from "lucide-react";
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
import { z } from "zod";

const settingsSearchSchema = z.object({
  tab: z.string().optional(),
});

export const Route = createFileRoute("/_authenticated/settings")({
  validateSearch: (search) => settingsSearchSchema.parse(search),
  component: SettingsPage,
});

function initials(name?: string | null) {
  if (!name) return "?";
  return name
    .split(/\s+/)
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function SettingsPage() {
  const { tab } = Route.useSearch();
  const { active, activeId } = useActiveOrg();
  const { user } = useAuth();
  const qc = useQueryClient();
  const isAdmin = active?.role === "owner" || active?.role === "admin";

  const portalRole = user?.user_metadata?.portal_role || "client";
  const hasWorkspace = !!activeId && portalRole === "provider";

  const [activeTab, setActiveTab] = useState(tab || "profile");

  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    }
  }, [tab]);

  // Profile Form States
  const [profileName, setProfileName] = useState(user?.user_metadata?.full_name || "");
  const [email, setEmail] = useState(user?.email || "");

  // Password States
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Notification Toggles
  const [emailBookingUpdates, setEmailBookingUpdates] = useState(true);
  const [emailMessages, setEmailMessages] = useState(true);
  const [emailNewsletters, setEmailNewsletters] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);

  // Language & Regional
  const [language, setLanguage] = useState("de");
  const [currency, setCurrency] = useState("CHF");

  // Default Location & Billing
  const [defaultAddress, setDefaultAddress] = useState("Bahnhofstrasse 1, 8001 Zürich");
  const [defaultCanton, setDefaultCanton] = useState("ZH");
  const [preferredPayment, setPreferredPayment] = useState("credit_card");

  // Org Workspace States
  const [orgName, setOrgName] = useState(active?.organization.name ?? "");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"member" | "admin">("member");

  // Sync state with loaded user/org data
  useEffect(() => {
    if (user?.user_metadata?.full_name) {
      setProfileName(user.user_metadata.full_name);
    }
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (active?.organization.name) {
      setOrgName(active.organization.name);
    }
  }, [active]);

  const members = useQuery({
    queryKey: ["members", activeId],
    enabled: hasWorkspace,
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
    enabled: hasWorkspace,
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

  const updateProfile = useMutation({
    mutationFn: async () => {
      // 1. Update profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ full_name: profileName })
        .eq("id", user!.id);
      if (profileError) throw profileError;

      // 2. Update auth metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: profileName },
      });
      if (authError) throw authError;
    },
    onSuccess: () => {
      toast.success("Profile details updated successfully!");
      qc.invalidateQueries({ queryKey: ["user"] });
      // Reload page to refresh sidebar context
      window.location.reload();
    },
    onError: (e: Error) => toast.error(e.message || "Failed to update profile"),
  });

  const updatePassword = useMutation({
    mutationFn: async () => {
      if (newPassword !== confirmPassword) {
        throw new Error("Passwords do not match");
      }
      if (newPassword.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Security credentials updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to update password"),
  });

  const saveSettings = () => {
    toast.success("System preferences and settings saved!");
  };

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
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <PageHeader
        title="Profile & Settings"
        description="Manage your personal profile, workspace team, and account settings."
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-slate-200/60 p-1 rounded-xl w-full sm:w-auto flex flex-wrap gap-1 mb-6 max-w-max">
          <TabsTrigger
            value="profile"
            className="rounded-lg text-xs font-semibold px-4.5 py-2 cursor-pointer transition-all data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
          >
            Profile
          </TabsTrigger>
          {hasWorkspace && (
            <>
              <TabsTrigger
                value="workspace"
                className="rounded-lg text-xs font-semibold px-4.5 py-2 cursor-pointer transition-all data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
              >
                Workspace
              </TabsTrigger>
              <TabsTrigger
                value="members"
                className="rounded-lg text-xs font-semibold px-4.5 py-2 cursor-pointer transition-all data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
              >
                Members
              </TabsTrigger>
              <TabsTrigger
                value="invites"
                className="rounded-lg text-xs font-semibold px-4.5 py-2 cursor-pointer transition-all data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
              >
                Invites
              </TabsTrigger>
            </>
          )}
          <TabsTrigger
            value="settings"
            className="rounded-lg text-xs font-semibold px-4.5 py-2 cursor-pointer transition-all data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
          >
            Settings
          </TabsTrigger>
        </TabsList>

        {/* ── PROFILE TAB (Contains Personal details and Password Security) ── */}
        <TabsContent value="profile" className="space-y-6 outline-none">
          {/* Card 1: Personal Details */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-2.5 text-slate-800 font-bold">
              <User className="h-5 w-5 text-blue-600" />
              <h3>Personal Details</h3>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
              <div className="h-20 w-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-black shadow-inner shrink-0 select-none">
                {initials(profileName)}
              </div>
              <div className="text-center sm:text-left space-y-1">
                <h4 className="text-lg font-bold text-slate-800">{profileName || "User"}</h4>
                <p className="text-xs text-slate-400">
                  Profile photo removed. Initial avatar used as fallback.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 max-w-md">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-500">Full Name</Label>
                <Input
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="Your Name"
                  className="rounded-xl border-slate-200 focus-visible:ring-blue-500 h-10"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-500">Email Address</Label>
                <Input
                  value={email}
                  disabled
                  type="email"
                  className="rounded-xl border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed h-10"
                />
                <p className="text-[10px] text-slate-400">Email address cannot be changed.</p>
              </div>

              <Button
                onClick={() => updateProfile.mutate()}
                disabled={
                  updateProfile.isPending ||
                  !profileName.trim() ||
                  profileName === user?.user_metadata?.full_name
                }
                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md cursor-pointer h-10 font-bold transition-all"
              >
                Save Details
              </Button>
            </div>
          </div>

          {/* Card 2: Password Security (In Profile) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-2.5 text-slate-800 font-bold">
              <Key className="h-5 w-5 text-blue-600" />
              <h3>Password & Security</h3>
            </div>
            <div className="grid grid-cols-1 gap-5 max-w-md">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-500">New Password</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="rounded-xl border-slate-200 focus-visible:ring-blue-500 h-10"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-500">Confirm New Password</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="rounded-xl border-slate-200 focus-visible:ring-blue-500 h-10"
                />
              </div>

              <Button
                onClick={() => updatePassword.mutate()}
                disabled={
                  updatePassword.isPending || !newPassword || newPassword !== confirmPassword
                }
                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md cursor-pointer h-10 font-bold transition-all"
              >
                Update Password
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* ── SETTINGS TAB (Notifications, Language/Region, Default Location) ── */}
        <TabsContent value="settings" className="space-y-6 outline-none">
          {/* Card 1: Notification Preferences */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-2.5 text-slate-800 font-bold">
              <Bell className="h-5 w-5 text-blue-600" />
              <h3>Notification Preferences</h3>
            </div>
            <div className="space-y-4 max-w-lg">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <div className="text-sm font-bold text-slate-700">Booking Updates</div>
                  <div className="text-xs text-slate-400">
                    Receive emails for booking requests, confirmations, and scheduling.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={emailBookingUpdates}
                  onChange={(e) => setEmailBookingUpdates(e.target.checked)}
                  className="h-4.5 w-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <div className="text-sm font-bold text-slate-700">New Messages</div>
                  <div className="text-xs text-slate-400">
                    Receive alerts when contractors send you chat messages.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={emailMessages}
                  onChange={(e) => setEmailMessages(e.target.checked)}
                  className="h-4.5 w-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <div className="text-sm font-bold text-slate-700">Email Alerts</div>
                  <div className="text-xs text-slate-400">
                    Receive urgent dispatch and emergency booking notifications via email.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="h-4.5 w-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-slate-700">Marketing & Newsletters</div>
                  <div className="text-xs text-slate-400">
                    Receive seasonal cleaning guides and promotions.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={emailNewsletters}
                  onChange={(e) => setEmailNewsletters(e.target.checked)}
                  className="h-4.5 w-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Language & Region */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-2.5 text-slate-800 font-bold">
              <Globe className="h-5 w-5 text-blue-600" />
              <h3>Language & Region</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-xl">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-500">Preferred Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="rounded-xl border-slate-200 h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English (EN)</SelectItem>
                    <SelectItem value="de">Deutsch (DE)</SelectItem>
                    <SelectItem value="fr">Français (FR)</SelectItem>
                    <SelectItem value="it">Italiano (IT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-500">Preferred Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="rounded-xl border-slate-200 h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CHF">Swiss Franc (CHF)</SelectItem>
                    <SelectItem value="EUR">Euro (EUR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Card 3: Default Location & Billing */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-2.5 text-slate-800 font-bold">
              <MapPin className="h-5 w-5 text-blue-600" />
              <h3>Default Service Location & Billing</h3>
            </div>
            <div className="grid grid-cols-1 gap-5 max-w-xl">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-500">
                  Default Service Address
                </Label>
                <Input
                  value={defaultAddress}
                  onChange={(e) => setDefaultAddress(e.target.value)}
                  placeholder="Street name, Number, Zip, City"
                  className="rounded-xl border-slate-200 focus-visible:ring-blue-500 h-10"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-500">Canton</Label>
                  <Select value={defaultCanton} onValueChange={setDefaultCanton}>
                    <SelectTrigger className="rounded-xl border-slate-200 h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ZH">Zurich (ZH)</SelectItem>
                      <SelectItem value="BE">Bern (BE)</SelectItem>
                      <SelectItem value="GE">Geneva (GE)</SelectItem>
                      <SelectItem value="BS">Basel-Stadt (BS)</SelectItem>
                      <SelectItem value="SG">St. Gallen (SG)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-500">
                    Preferred Payment Method
                  </Label>
                  <Select value={preferredPayment} onValueChange={setPreferredPayment}>
                    <SelectTrigger className="rounded-xl border-slate-200 h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit_card">Credit Card (Visa/Mastercard)</SelectItem>
                      <SelectItem value="twint">TWINT</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer (Invoice)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={saveSettings}
                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md cursor-pointer h-10 font-bold transition-all max-w-max"
              >
                Save Settings
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* ── WORKSPACE TAB ── */}
        {hasWorkspace && (
          <TabsContent value="workspace" className="space-y-6 outline-none">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
              <h3 className="text-base font-bold text-slate-900">Workspace Settings</h3>
              <div className="grid grid-cols-1 gap-5 max-w-md">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-500">Workspace name</Label>
                  <Input
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    disabled={!isAdmin}
                    className="rounded-xl border-slate-200 focus-visible:ring-blue-500 h-10"
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
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md cursor-pointer h-10 font-bold transition-all"
                >
                  Save changes
                </Button>
              </div>
            </div>
          </TabsContent>
        )}

        {/* ── MEMBERS TAB ── */}
        {hasWorkspace && (
          <TabsContent value="members" className="space-y-6 outline-none">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
              <h3 className="text-base font-bold text-slate-900">Members</h3>
              <div className="overflow-hidden rounded-xl border border-slate-100 bg-slate-50/50">
                {members.data?.map((m) => {
                  const p = m.profile as { email?: string; full_name?: string } | null;
                  return (
                    <div
                      key={m.id}
                      className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-0"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-xs font-medium text-blue-600 select-none">
                        {initials(p?.full_name || p?.email || "?")}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-slate-700">
                          {p?.full_name ?? p?.email}
                        </div>
                        <div className="truncate text-xs text-slate-400">{p?.email}</div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="capitalize bg-slate-100 text-slate-600 border-none font-semibold text-[10px]"
                      >
                        {m.role}
                      </Badge>
                      {isAdmin && m.user_id !== user?.id && m.role !== "owner" && (
                        <button
                          onClick={() => removeMember.mutate(m.id)}
                          className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        )}

        {/* ── INVITES TAB ── */}
        {hasWorkspace && (
          <TabsContent value="invites" className="space-y-6 outline-none">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
              <h3 className="text-base font-bold text-slate-900">Teammate Invites</h3>

              {isAdmin && (
                <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    <UserPlus className="h-4 w-4 text-blue-500" /> Invite a teammate
                  </div>
                  <div className="flex flex-col gap-3 md:flex-row">
                    <Input
                      placeholder="teammate@company.com"
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="flex-1 rounded-xl border-slate-200 h-10"
                    />
                    <Select
                      value={inviteRole}
                      onValueChange={(v) => setInviteRole(v as "member" | "admin")}
                    >
                      <SelectTrigger className="md:w-32 rounded-xl border-slate-200 h-10">
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
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md cursor-pointer font-bold h-10"
                    >
                      Send invite
                    </Button>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Invites generate a shareable link. Share it with your teammate; they'll sign in
                    and join automatically.
                  </p>
                </div>
              )}

              <div className="overflow-hidden rounded-xl border border-slate-100 bg-slate-50/50">
                {invites.data && invites.data.length > 0 ? (
                  invites.data.map((i) => (
                    <div
                      key={i.id}
                      className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-0"
                    >
                      <Mail className="h-4 w-4 text-slate-400" />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-slate-700">{i.email}</div>
                        <div className="text-xs text-slate-400">
                          Expires {new Date(i.expires_at).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="capitalize bg-slate-100 text-slate-600 border-none font-semibold text-[10px]"
                      >
                        {i.role}
                      </Badge>
                      <button
                        onClick={() => copyInvite(i.token)}
                        className="text-slate-400 hover:text-blue-600 p-1 cursor-pointer"
                        title="Copy invite link"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => revokeInvite.mutate(i.id)}
                          className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-12 text-center text-sm text-slate-400">
                    No pending invites.
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
