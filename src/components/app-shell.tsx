import { type ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  HardHat,
  FolderKanban,
  CheckSquare,
  FileText,
  Settings,
  Sparkles,
  Search,
  ChevronsUpDown,
  Plus,
  LogOut,
  Check,
  Building,
  FileSignature,
  Briefcase,
  GitMerge,
  BarChart3,
  CircleDollarSign,
  CreditCard,
  Bell,
  MessageSquare,
  Command,
  Bot,
  Activity,
  ShieldAlert,
  ChevronDown,
  Heart,
  Star,
  MapPin,
  Wallet,
  Calendar,
  Clock,
  TrendingUp,
  Shield,
  BadgeCheck,
  Eye,
  Grid3X3,
  Zap,
  Image,
  Server,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useActiveOrg } from "@/hooks/use-orgs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CreateOrgDialog } from "@/components/create-org-dialog";

/* ──────────────────────────────────────────────────────
   CLIENT SIDEBAR NAV
   ────────────────────────────────────────────────────── */
const getClientNavGroups = (unreadCount: number) => [
  {
    items: [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/client/search", label: "Search Services", icon: Search },
      { to: "/client/bookings", label: "Bookings", icon: Briefcase },
      {
        to: "/client/messages",
        label: "Messages",
        icon: MessageSquare,
        badge: unreadCount > 0 ? String(unreadCount) : undefined,
      },
      { to: "/notifications", label: "Notifications", icon: Bell },
      { to: "/payments", label: "Payments", icon: Wallet },
      { to: "/client/favorites", label: "Saved Providers", icon: Heart },
      { to: "/settings", search: { tab: "profile" }, label: "Profile", icon: Users },
      { to: "/settings", search: { tab: "settings" }, label: "Settings", icon: Settings },
    ],
  },
];

/* ──────────────────────────────────────────────────────
   PROVIDER SIDEBAR NAV — matches Image 2
   ────────────────────────────────────────────────────── */
/* ──────────────────────────────────────────────────────
   PROVIDER SIDEBAR NAV
   ────────────────────────────────────────────────────── */
const getProviderNavGroups = (isApproved: boolean) => {
  if (!isApproved) {
    return [
      {
        items: [{ to: "/dashboard", label: "Verification", icon: LayoutDashboard, highlight: true }],
      },
    ];
  }

  return [
    {
      items: [{ to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, highlight: true }],
    },
    {
      label: "JOBS",
      items: [
        { to: "/jobs", label: "My Jobs", icon: Briefcase, badge: "5" },
        { to: "/tasks", label: "Calendar", icon: Calendar },
        { to: "/client/bookings", label: "Bookings", icon: CheckSquare },
        { to: "/client/messages", label: "Messages", icon: MessageSquare },
        { to: "/settings", label: "Availability", icon: Clock },
      ],
    },
    {
      label: "BUSINESS",
      items: [
        { to: "/payments", label: "Earnings", icon: CircleDollarSign },
        { to: "/contracts", label: "Services & Pricing", icon: CreditCard },
        { to: "/settings", label: "Reviews", icon: Star },
        { to: "/documents", label: "Portfolio", icon: Image },
      ],
    },
    {
      label: "GROWTH",
      items: [
        { to: "/ai-assistant", label: "AI Coach", icon: Bot, badge: "New", badgeColor: "emerald" },
        { to: "/client/tenders", label: "Public Tenders", icon: Briefcase, badge: "12" },
        { to: "/reports", label: "Insights", icon: TrendingUp },
      ],
    },
    {
      label: "SETTINGS",
      items: [
        { to: "/settings", search: { tab: "profile" }, label: "Profile", icon: Users },
        { to: "/documents", label: "Documents", icon: FileText },
        { to: "/payments", label: "Payouts", icon: Wallet },
        { to: "/settings", search: { tab: "settings" }, label: "Settings", icon: Settings },
      ],
    },
  ];
};

/* ──────────────────────────────────────────────────────
   OPERATIONS SIDEBAR NAV
   ────────────────────────────────────────────────────── */
const operationsNavGroups = [
  {
    items: [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/ops/users", label: "Users", icon: Users },
      { to: "/ops/users", label: "Providers", icon: HardHat },
      { to: "/ops/users", label: "Companies", icon: Building },
      { to: "/ops/bookings", label: "Bookings", icon: Calendar },
      { to: "/payments", label: "Payments", icon: CreditCard },
      { to: "/dashboard", label: "Disputes", icon: ShieldAlert, badge: "8" },
      { to: "/dashboard", label: "Compliance", icon: CheckSquare },
      { to: "/dashboard", label: "AI & Matching", icon: Sparkles },
      { to: "/dashboard", label: "Support", icon: MessageSquare, badge: "5" },
      { to: "/reports", label: "Analytics", icon: BarChart3 },
      { to: "/reports", label: "Reports", icon: FileText },
      { to: "/dashboard", label: "CMS", icon: Grid3X3 },
      { to: "/notifications", label: "Notifications", icon: Bell },
      { to: "/dashboard", label: "Integrations", icon: GitMerge },
      { to: "/settings", label: "Settings", icon: Settings },
      { to: "/dashboard", label: "Audit Logs", icon: Activity },
      { to: "/dashboard", label: "System Health", icon: Server },
    ],
  },
];


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

/* ──────────────────────────────────────────────────────
   NAV GROUP COMPONENT — renders labeled or unlabeled groups
   ────────────────────────────────────────────────────── */
function NavGroup({ group, location }: { group: any; location: any }) {
  return (
    <div className="mt-5 first:mt-0">
      {/* Section Label */}
      {group.label && (
        <div className="px-3 mb-2 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
          {group.label}
        </div>
      )}
      <ul className="space-y-0.5">
        {group.items.map((n: any) => {
          const isActive =
            location.pathname === n.to &&
            (n.search ? JSON.stringify(location.search) === JSON.stringify(n.search) : true);
          const Icon = n.icon;
          return (
            <li key={n.to + n.label}>
              <Link
                to={n.to}
                search={n.search}
                className={cn(
                  "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-all relative",
                  n.highlight && isActive
                    ? "text-white bg-blue-600 shadow-md shadow-blue-600/25"
                    : isActive
                      ? "text-white bg-slate-800 shadow-sm"
                      : "text-slate-400 hover:text-white hover:bg-white/5",
                )}
              >
                <Icon
                  className={cn(
                    "h-[18px] w-[18px] shrink-0",
                    n.highlight && isActive
                      ? "text-white"
                      : isActive
                        ? "text-white"
                        : "text-slate-500 group-hover:text-slate-300",
                  )}
                  strokeWidth={isActive ? 2 : 1.5}
                />
                <span className="flex-1 truncate">{n.label}</span>

                {/* Badge */}
                {n.badge && (
                  <span
                    className={cn(
                      "text-[10px] font-bold px-1.5 py-0.5 rounded-md",
                      n.badgeColor === "emerald"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-white/10 text-slate-300",
                    )}
                  >
                    {n.badge}
                  </span>
                )}

                {/* Dot indicator (e.g., Emergency) */}
                {n.dot && (
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full shrink-0",
                      n.dot === "green" ? "bg-emerald-400" : "bg-red-400",
                    )}
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ──────────────────────────────────────────────────────
   APP SHELL — Main Layout
   ────────────────────────────────────────────────────── */
export function AppShell({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();
  const { active, orgs, setActiveId } = useActiveOrg();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);

  // Query unread messages count
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["unreadMessagesCount", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { count, error } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("receiver_id", user!.id)
        .eq("is_read", false);

      if (error) throw error;
      return count || 0;
    },
  });

  // Setup Realtime subscription for unread count updates
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel("unread-count-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["unreadMessagesCount"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  // Query user profile from database to resolve real-time role
  const { data: userProfile } = useQuery({
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
  const firstName = userProfile?.full_name?.split(" ")[0] || user?.user_metadata?.full_name?.split(" ")[0] || "User";
  const fullName = userProfile?.full_name || user?.user_metadata?.full_name || "User";


  // Query provider details and reviews
  const { data: providerProfile } = useQuery({
    queryKey: ["providerProfileStatusCard", user?.id, active?.organization?.id],
    enabled: !!user?.id && activePortal === "provider",
    queryFn: async () => {
      const profileQuery = await supabase
        .from("provider_profiles")
        .select("verification_status, skills")
        .eq("user_id", user!.id)
        .maybeSingle();

      if (profileQuery.error) throw profileQuery.error;
      const profile = profileQuery.data;

      const orgId = active?.organization?.id;

      let avgRating = 5.0;
      let reviewCount = 0;
      let servicesList: string[] = [];

      if (orgId) {
        const reviewsQuery = await supabase
          .from("reviews")
          .select("rating")
          .eq("provider_id", orgId);

        if (reviewsQuery.error) throw reviewsQuery.error;
        const reviewsList = reviewsQuery.data || [];
        if (reviewsList.length > 0) {
          reviewCount = reviewsList.length;
          avgRating = Number((reviewsList.reduce((sum, r) => sum + r.rating, 0) / reviewsList.length).toFixed(1));
        }

        const servicesQuery = await supabase
          .from("provider_services")
          .select("name")
          .eq("provider_id", orgId);

        if (servicesQuery.error) throw servicesQuery.error;
        servicesList = (servicesQuery.data || []).map((s) => s.name);
      }

      return {
        verification_status: profile?.verification_status || "none",
        skills: profile?.skills || [],
        avgRating,
        reviewCount,
        servicesList,
      };
    },
  });

  const isApproved = activePortal === "provider"
    ? (providerProfile?.verification_status === "approved")
    : true;

  const servicesList = providerProfile?.servicesList || [];
  let specialty = "No services offered";
  if (servicesList.length > 0) {
    if (servicesList.length <= 2) {
      specialty = servicesList.join(", ");
    } else {
      specialty = `${servicesList.slice(0, 2).join(", ")} +${servicesList.length - 2}`;
    }
  }
  const avgRating = providerProfile?.avgRating ?? 5.0;
  const reviewCount = providerProfile?.reviewCount ?? 0;

  const navGroups =
    activePortal === "client"
      ? getClientNavGroups(unreadCount)
      : activePortal === "operations"
        ? operationsNavGroups
        : getProviderNavGroups(isApproved);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* ── SIDEBAR ── */}
      <aside className="hidden w-[260px] shrink-0 flex-col bg-[#0a0e1a] text-slate-300 md:flex relative z-20 transition-all duration-300 border-r border-slate-800/60">
        {/* Logo */}
        <div className="flex h-16 items-center px-5 mt-1">
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white text-sm font-black">
              X
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              BlueX<span className="text-blue-400">.ch</span>
            </span>
          </Link>
        </div>

        {/* Provider User Profile Card (top, only for provider) */}
        {activePortal === "provider" && (
          <div className="px-4 pb-2 pt-1">
            <button 
              onClick={() => navigate({ to: "/settings", search: { tab: "services" } as any })}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-left focus:outline-none cursor-pointer"
            >
              <Avatar className="h-10 w-10 rounded-full border-2 border-blue-500/50 shrink-0">
                <AvatarFallback className="bg-blue-600 text-white text-xs font-bold">
                  {initials(fullName)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  {isApproved ? (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <BadgeCheck className="h-3 w-3" /> Verified
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <Clock className="h-3 w-3" /> Pending
                    </span>
                  )}
                </div>
                <div className="text-sm font-semibold text-white truncate mt-0.5">{fullName}</div>
                <div className="text-[11px] text-slate-400">{specialty}</div>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                  <span className="text-[11px] text-slate-300 font-medium">{avgRating}</span>
                  <span className="text-[10px] text-slate-500">({reviewCount} reviews)</span>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-500 shrink-0" />
            </button>
          </div>
        )}

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {navGroups.map((group: any, idx: number) => (
            <NavGroup key={idx} group={group} location={location} />
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="px-3 pb-4 mt-auto">
          {activePortal === "operations" ? (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Platform Status</span>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-[11px] font-bold text-white">All Systems Operational</span>
              </div>
              <button 
                onClick={() => navigate({ to: "/dashboard" })}
                className="w-full py-1.5 border border-slate-800 hover:bg-slate-800 rounded-lg text-[9px] font-black text-slate-400 transition-colors block text-center cursor-pointer"
              >
                View System Health
              </button>
            </div>
          ) : activePortal === "provider" ? (
            /* View Client Mode button */
            <button
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
              onClick={() => navigate({ to: "/settings" })}
            >
              <Eye className="h-4 w-4" />
              View Client Mode
            </button>
          ) : (
            /* Client user profile card (bottom) */
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-left focus:outline-none cursor-pointer">
                  <Avatar className="h-9 w-9 rounded-full border border-slate-700 shrink-0">
                    <AvatarFallback className="bg-blue-600 text-white text-xs font-bold">
                      {initials(fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-white truncate">{fullName}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> Zurich, Switzerland
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-500 shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-slate-900">{fullName}</p>
                    <p className="text-xs leading-none text-slate-500">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigate({ to: "/settings" })}
                  className="cursor-pointer"
                >
                  <Settings className="mr-2 h-4 w-4 text-slate-400" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </aside>

      {/* ── MAIN CONTAINER ── */}
      <div className="flex min-w-0 flex-1 flex-col bg-[#f0f4f8]">
        {/* Header */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white px-6 lg:px-8 relative z-10 shadow-sm">
          {/* Left: mobile menu trigger */}
          <div className="flex items-center gap-4 md:hidden">
            <button className="text-slate-500">
              <LayoutDashboard className="h-5 w-5" />
            </button>
          </div>

          {/* Center: spacer for desktop */}
          <div className="hidden md:flex flex-1" />

          {/* Right side */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Location Badge */}
            <div className="hidden sm:flex items-center gap-1.5 text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5">
              <MapPin className="h-3.5 w-3.5 text-blue-500" />
              <span className="font-medium text-xs">Zurich, Switzerland</span>
            </div>

            {/* Notifications */}
            <Link
              to="/notifications"
              className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
            >
              <Bell className="h-5 w-5" strokeWidth={1.5} />
              <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 ring-2 ring-white text-[9px] text-white font-bold flex items-center justify-center">
                2
              </span>
            </Link>

            {/* User Avatar */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none flex items-center gap-2 group">
                  <Avatar className="h-8 w-8 rounded-full border-2 border-slate-200 shadow-sm transition-transform group-hover:scale-105">
                    <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-semibold">
                      {initials(user?.email || "User")}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-slate-900">
                      {user?.user_metadata?.full_name || "User"}
                    </p>
                    <p className="text-xs leading-none text-slate-500">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigate({ to: "/settings" })}
                  className="cursor-pointer"
                >
                  <Settings className="mr-2 h-4 w-4 text-slate-400" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto relative h-full">
          <div className="absolute inset-0 max-w-full">
            <div className="h-full w-full p-4 md:p-6 lg:p-8">{children}</div>
          </div>
        </main>
      </div>

      <CreateOrgDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center">
          {title}
        </h1>
        {description && <p className="text-slate-500 mt-1">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
