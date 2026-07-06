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
  Atom,
  Bot,
  Activity,
  ShieldAlert,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useActiveOrg } from "@/hooks/use-orgs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const navGroups = [
  {
    items: [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard }
    ]
  },
  {
    label: "AI Workspace",
    icon: Bot,
    items: [
      { to: "/ai-assistant", label: "AI Assistant" },
      { to: "/ai-conversations", label: "AI Conversations" },
      { to: "/ai-automations", label: "AI Automations" }
    ]
  },
  {
    label: "Organizations",
    icon: Building,
    items: [
      { to: "/organizations", label: "Organization" },
      { to: "/organizations/members", label: "Members" },
      { to: "/organizations/branding", label: "Branding" },
      { to: "/organizations/permissions", label: "Permissions" }
    ]
  },
  {
    items: [
      { to: "/clients", label: "Clients", icon: Users },
      { to: "/contractors", label: "Contractors", icon: HardHat }
    ]
  },
  {
    label: "Projects",
    icon: FolderKanban,
    to: "/projects",
    items: [
      { to: "/tasks", label: "Tasks" }
    ]
  },
  {
    items: [
      { to: "/jobs", label: "Jobs", icon: Briefcase },
      { to: "/contracts", label: "Contracts", icon: FileSignature }
    ]
  },
  {
    items: [
      { to: "/documents", label: "Documents", icon: FileText },
      { to: "/payments", label: "Payments", icon: CircleDollarSign },
      { to: "/subscriptions", label: "Subscriptions", icon: CreditCard }
    ]
  },
  {
    items: [
      { to: "/workflows", label: "Workflow Engine", icon: GitMerge },
      { to: "/notifications", label: "Notifications", icon: Bell },
      { to: "/reports", label: "Analytics", icon: BarChart3 },
      { to: "/activity-logs", label: "Activity Logs", icon: Activity },
      { to: "/audit-logs", label: "Audit Logs", icon: ShieldAlert }
    ]
  }
];

const bottomNav = [
  { to: "/settings", label: "Settings", icon: Settings }
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

function NavGroup({ group, location }: { group: any, location: any }) {
  const [isOpen, setIsOpen] = useState(true);

  if (!group.label) {
    return (
      <ul className="space-y-1 mt-4 first:mt-0">
        {group.items.map((n: any) => {
          const isActive = location.pathname === n.to;
          const Icon = n.icon;
          return (
            <li key={n.to}>
              <Link
                to={n.to}
                className={cn(
                  "group flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all relative",
                  isActive
                    ? "text-white bg-slate-800 shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300")} strokeWidth={isActive ? 2 : 1.5} />
                <span className="flex-1 truncate">{n.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    );
  }

  const isParentActive = group.to && location.pathname === group.to;
  
  return (
    <div className="mt-4">
      {group.to ? (
        <Link
          to={group.to}
          className={cn(
            "group flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all relative",
            isParentActive
              ? "text-white bg-slate-800 shadow-sm"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          )}
        >
          {group.icon && <group.icon className={cn("h-4 w-4 shrink-0", isParentActive ? "text-white" : "text-slate-500 group-hover:text-slate-300")} strokeWidth={isParentActive ? 2 : 1.5} />}
          <span className="flex-1 truncate">{group.label}</span>
        </Link>
      ) : (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full group flex items-center justify-between px-3 py-2 text-[14px] font-medium text-slate-400 hover:text-white transition-all"
        >
          <div className="flex items-center gap-3.5">
            {group.icon && <group.icon className="h-4 w-4 shrink-0 text-slate-500 group-hover:text-slate-300" strokeWidth={1.5} />}
            <span className="flex-1 truncate">{group.label}</span>
          </div>
          <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform text-slate-500", isOpen ? "" : "-rotate-90")} />
        </button>
      )}

      {isOpen && (
        <ul className="mt-1 space-y-1 relative before:absolute before:left-5 before:top-1 before:bottom-1 before:w-px before:bg-slate-800 ml-0">
          {group.items.map((n: any) => {
            const isActive = location.pathname === n.to;
            return (
              <li key={n.to}>
                <Link
                  to={n.to}
                  className={cn(
                    "flex items-center pl-10 pr-3 py-2 rounded-xl text-[13px] font-medium transition-all relative",
                    isActive
                      ? "text-white bg-slate-800"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <span className="flex-1 truncate">{n.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();
  const { active, orgs, setActiveId } = useActiveOrg();
  const location = useLocation();
  const navigate = useNavigate();
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* Sidebar - Dark blue black theme */}
      <aside className="hidden w-[260px] shrink-0 flex-col bg-slate-950 text-slate-300 md:flex relative z-20 transition-all duration-300 border-r border-slate-900">
        
        {/* Logo area */}
        <div className="flex h-16 items-center px-6 mt-2">
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <Atom className="h-7 w-7 text-indigo-400 group-hover:text-indigo-300 transition-colors" strokeWidth={2.5} />
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-indigo-200 transition-colors duration-300">BlueX</span>
          </Link>
        </div>

        {/* Org switcher */}
        <div className="px-4 py-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-3 py-2.5 text-left text-sm hover:bg-white/10 transition-all focus:outline-none">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-purple-500/20 text-purple-300 text-xs font-semibold">
                  {initials(active?.organization.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-white">
                    {active?.organization.name ?? "Acme Corporation"}
                  </div>
                  <div className="truncate text-[11px] text-slate-400">
                    Enterprise Plan
                  </div>
                </div>
                <ChevronsUpDown className="h-4 w-4 shrink-0 text-slate-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 rounded-xl shadow-lg border-border/40">
              <DropdownMenuLabel className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">
                Workspaces
              </DropdownMenuLabel>
              {orgs.map((o) => (
                <DropdownMenuItem key={o.organization.id} onClick={() => setActiveId(o.organization.id)} className="rounded-lg gap-2 mt-1 cursor-pointer">
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-[9px] font-semibold">
                    {initials(o.organization.name)}
                  </div>
                  <span className="flex-1 truncate text-xs font-medium">{o.organization.name}</span>
                  {active?.organization.id === o.organization.id ? (
                    <Check className="h-3.5 w-3.5 text-indigo-500" />
                  ) : null}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator className="bg-border/40" />
              <DropdownMenuItem onClick={() => setCreateOpen(true)} className="rounded-lg gap-2 text-xs font-medium text-indigo-500 hover:text-indigo-600 mt-0.5 cursor-pointer">
                <Plus className="h-4 w-4" /> New workspace
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Main Nav */}
        <nav className="flex-1 overflow-y-auto px-4 py-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {navGroups.map((group, idx) => (
            <NavGroup key={idx} group={group} location={location} />
          ))}

          {/* Divider */}
          <div className="my-6 mx-3 h-px bg-slate-800" />

          {/* Bottom Nav */}
          <ul className="space-y-1">
            {bottomNav.map((n) => {
              const isActive = location.pathname === n.to;
              const Icon = n.icon;
              return (
                <li key={n.to}>
                  <Link
                    to={n.to as any}
                    className={cn(
                      "group flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all relative",
                      isActive
                        ? "text-white bg-slate-800 shadow-sm"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300")} strokeWidth={isActive ? 2 : 1.5} />
                    <span className="flex-1 truncate">{n.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Container */}
      <div className="flex min-w-0 flex-1 flex-col bg-[#eef2f6]">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/60 bg-white px-6 lg:px-8 relative z-10 shadow-sm">
          {/* Left side mobile menu trigger (hidden on desktop) */}
          <div className="flex items-center gap-4 md:hidden">
            <button className="text-slate-500">
              <LayoutDashboard className="h-5 w-5" />
            </button>
          </div>

          {/* Center Search Bar */}
          <div className="hidden md:flex flex-1 justify-center max-w-2xl px-8">
            <div className="relative w-full group max-w-xl">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" strokeWidth={1.5} />
              <Input
                placeholder="Search anything..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-12 text-sm focus-visible:ring-1 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 transition-all placeholder:text-slate-400 shadow-sm"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <kbd className="pointer-events-none inline-flex h-5 items-center gap-1 rounded border border-slate-200 bg-white px-1.5 font-mono text-[10px] font-medium text-slate-500">
                  <Command className="h-3 w-3" /> K
                </kbd>
              </div>
            </div>
          </div>
          
          {/* Right Actions */}
          <div className="flex items-center gap-4 md:gap-5 ml-auto">
            <Button asChild size="sm" variant="secondary" className="h-9 gap-2 rounded-xl bg-indigo-50/80 text-indigo-700 hover:bg-indigo-100/80 border-0 text-xs font-semibold shadow-none cursor-pointer">
              <Link to="/ai-assistant">
                <Sparkles className="h-3.5 w-3.5 text-indigo-500" strokeWidth={2} /> AI Copilot
              </Link>
            </Button>
            
            <div className="flex items-center gap-1.5">
              <Link to="/notifications" className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                <Bell className="h-5 w-5" strokeWidth={1.5} />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
              </Link>
              <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors hidden sm:block">
                <MessageSquare className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
            
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none flex items-center gap-2 group">
                  <Avatar className="h-8 w-8 rounded-full border border-slate-200 shadow-sm transition-transform group-hover:scale-105">
                    <AvatarImage src="https://i.pravatar.cc/150?u=jane" />
                    <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs font-semibold">
                      {initials(user?.email || "Jane Doe")}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-slate-900">{user?.user_metadata?.full_name || "User"}</p>
                    <p className="text-xs leading-none text-slate-500">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate({ to: "/settings" })} className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4 text-slate-400" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto relative h-full">
          <div className="absolute inset-0 max-w-full">
            <div className="h-full w-full p-4 md:p-6 lg:p-8">
              {children}
            </div>
          </div>
        </main>
      </div>

      <CreateOrgDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}

export function PageHeader({ title, description, action }: { title: ReactNode, description?: ReactNode, action?: ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center">{title}</h1>
        {description && <p className="text-slate-500 mt-1">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}