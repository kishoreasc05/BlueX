import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { 
  FolderKanban, Clock, ListTodo, Zap, Calendar, User, 
  Building2, DollarSign, Bot, AlertTriangle, ArrowRight, 
  CheckCircle2, CheckSquare, Settings2, BarChart3, Activity, 
  Search, ShieldAlert, ArrowUpRight, Briefcase
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useActiveOrg } from "@/hooks/use-orgs";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { activeId } = useActiveOrg();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || "there";

  const { data, isLoading } = useQuery({
    queryKey: ["dashboardData", activeId],
    enabled: !!activeId,
    queryFn: async () => {
      const [
        clientsRes, 
        allProjectsRes, 
        activeProjectsRes, 
        tasksRes, 
        recentProjectsRes, 
        orgsRes,
        workflowsRes,
        contractsRes,
        jobsRes,
        upcomingTasksRes,
      ] = await Promise.all([
        supabase.from("clients").select("*", { count: "exact", head: true }).eq("organization_id", activeId!),
        supabase.from("projects").select("id, status").eq("organization_id", activeId!),
        supabase.from("projects").select("*", { count: "exact", head: true }).eq("organization_id", activeId!).eq("status", "active"),
        supabase.from("tasks").select("*", { count: "exact", head: true }).eq("organization_id", activeId!).neq("status", "done"),
        supabase.from("projects").select("id, name, status, created_at, client:clients(name)").eq("organization_id", activeId!).order("created_at", { ascending: false }).limit(5),
        supabase.from("organizations").select("id", { count: "exact", head: true }),
        supabase.from("workflows" as any).select("status").eq("organization_id", activeId!),
        supabase.from("contracts" as any).select("value, status").eq("organization_id", activeId!),
        supabase.from("jobs" as any).select("id", { count: "exact", head: true }).eq("organization_id", activeId!),
        supabase.from("tasks").select("id, title, due_date, project_id").eq("organization_id", activeId!).neq("status", "done").not("due_date", "is", null).order("due_date", { ascending: true }).limit(5),
      ]);

      const projects = (allProjectsRes.data as any[]) || [];
      const totalProjects = projects.length;
      
      const workflows: any[] = (workflowsRes.data as any) || [];
      const contracts: any[] = (contractsRes.data as any) || [];
      const upcomingTasks: any[] = (upcomingTasksRes.data as any) || [];
      
      const workflowStats = {
        active: workflows.filter((w: any) => w.status === 'active').length,
        paused: workflows.filter((w: any) => w.status === 'paused').length,
      };

      const revenue = contracts
        .filter((c: any) => c.status === 'signed')
        .reduce((sum: number, c: any) => sum + (Number(c.value) || 0), 0);

      let formattedRevenue = `$0`;
      if (revenue > 0) {
         if (revenue >= 1000) {
            formattedRevenue = `$${(revenue / 1000).toFixed(1)}k`;
         } else {
            formattedRevenue = `$${revenue}`;
         }
      }

      // We need project names for tasks, since we couldn't left join in the same query reliably without knowing schema exactly
      const upcomingTasksWithProjects = await Promise.all(upcomingTasks.map(async (task: any) => {
         if (!task.project_id) return { ...task, project_name: "No Project" };
         const pRes: any = await supabase.from("projects").select("name").eq("id", task.project_id).single();
         const p = pRes.data;
         return { ...task, project_name: p?.name || "No Project" };
      }));

      return {
        kpi: {
          organizations: orgsRes.count ?? 0,
          totalProjects: totalProjects,
          activeWorkflows: workflowStats.active,
          revenue: formattedRevenue,
          tasks: tasksRes.count ?? 0,
          jobs: jobsRes.count ?? 0,
        },
        workflowStats,
        recentProjects: (recentProjectsRes.data as any[]) || [],
        upcomingTasks: upcomingTasksWithProjects,
      };
    },
  });

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "planning": return "bg-indigo-100 text-indigo-700 border-indigo-200";
      case "active": return "bg-blue-100 text-blue-700 border-blue-200";
      case "on_hold": return "bg-amber-100 text-amber-700 border-amber-200";
      case "completed": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "cancelled": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-[1600px] mx-auto text-slate-800">
      
      {/* 1. Topbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Welcome back, {firstName} <span className="inline-block origin-bottom-right hover:animate-pulse cursor-pointer">👋</span>
          </h1>
          <p className="text-slate-500 mt-1">Here's what's happening across your workspace today.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Ask AI Copilot to find anything..." 
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm shadow-sm transition-all placeholder:text-slate-400"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
             <div className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 border border-indigo-100">
               <Bot className="w-3 h-3"/> AI
             </div>
          </div>
        </div>
      </div>

      {/* 2. Quick Stats Grid (6 cards) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: "Organizations", value: isLoading ? "-" : data?.kpi.organizations, icon: Building2, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100", to: "/organizations" },
          { label: "Total Projects", value: isLoading ? "-" : data?.kpi.totalProjects, icon: FolderKanban, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100", to: "/projects" },
          { label: "Active Workflows", value: isLoading ? "-" : data?.kpi.activeWorkflows, icon: Settings2, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100", to: "/workflows" },
          { label: "Revenue", value: isLoading ? "-" : data?.kpi.revenue, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", to: "/contracts" },
          { label: "Tasks Due", value: isLoading ? "-" : data?.kpi.tasks, icon: Clock, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", to: "/projects" },
          { label: "Active Jobs", value: isLoading ? "-" : data?.kpi.jobs, icon: Briefcase, color: "text-pink-600", bg: "bg-pink-50", border: "border-pink-100", to: "/jobs" },
        ].map((stat, i) => (
          <div key={i} onClick={() => navigate({ to: stat.to })} className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm flex flex-col justify-between group hover:border-indigo-300 transition-colors cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="text-sm font-semibold text-slate-500 line-clamp-1 group-hover:text-slate-700 transition-colors">{stat.label}</div>
              <div className={cn("p-1.5 rounded-lg border", stat.bg, stat.border)}>
                <stat.icon className={cn("h-4 w-4", stat.color)} />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Bento Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Span 2) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 7. Workflow Status */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm flex flex-col cursor-pointer hover:border-indigo-300 transition-colors" onClick={() => navigate({ to: "/workflows" })}>
              <h3 className="font-bold text-lg text-slate-900 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings2 className="w-5 h-5 text-slate-400" /> Workflow Status
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400" />
              </h3>
              <div className="flex-1 grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col justify-center">
                  <div className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider mb-1">Active</div>
                  <div className="text-2xl font-bold text-emerald-600">{isLoading ? "-" : data?.workflowStats.active}</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col justify-center">
                  <div className="text-[11px] font-bold text-amber-500 uppercase tracking-wider mb-1">Paused</div>
                  <div className="text-2xl font-bold text-amber-600">{isLoading ? "-" : data?.workflowStats.paused}</div>
                </div>
              </div>
            </div>
            
            {/* Analytics Placeholder (Using Real Totals) */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm flex flex-col justify-center">
               <h3 className="font-bold text-lg text-slate-900 mb-6 flex items-center gap-2">
                 <BarChart3 className="w-5 h-5 text-slate-400" /> Database Activity
               </h3>
               <div className="space-y-4">
                 <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                    <span className="text-sm font-medium text-slate-500">Total Projects</span>
                    <span className="text-sm font-bold text-slate-900">{isLoading ? "-" : data?.kpi.totalProjects}</span>
                 </div>
                 <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                    <span className="text-sm font-medium text-slate-500">Tasks Due</span>
                    <span className="text-sm font-bold text-slate-900">{isLoading ? "-" : data?.kpi.tasks}</span>
                 </div>
                 <div className="flex justify-between items-center pb-2">
                    <span className="text-sm font-medium text-slate-500">Active Workflows</span>
                    <span className="text-sm font-bold text-slate-900">{isLoading ? "-" : data?.kpi.activeWorkflows}</span>
                 </div>
               </div>
            </div>
          </div>

          {/* 5. Business Activity (Recent Projects) */}
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
             <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="font-bold text-lg text-slate-900">Recent Projects</h3>
                <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/projects" })} className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">View all</Button>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50/50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">Project</th>
                      <th className="px-6 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider hidden sm:table-cell">Client</th>
                      <th className="px-6 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider text-right hidden sm:table-cell">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {isLoading ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-500">Loading...</td>
                      </tr>
                    ) : (data?.recentProjects?.length === 0 ? (
                       <tr>
                         <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-500">No projects found.</td>
                       </tr>
                    ) : data?.recentProjects?.map((project: any, i: number) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-800">{project.name}</td>
                        <td className="px-6 py-4 text-slate-500 hidden sm:table-cell">{project.client?.name || "No Client"}</td>
                        <td className="px-6 py-4">
                          <span className={cn("text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md border inline-block whitespace-nowrap", getStageColor(project.status))}>
                            {project.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400 text-right text-xs hidden sm:table-cell whitespace-nowrap">
                          {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
                        </td>
                      </tr>
                    )))}
                  </tbody>
                </table>
             </div>
          </div>
          
        </div>

        {/* Right Column (Span 1) */}
        <div className="flex flex-col gap-6">
          
          {/* 6. Upcoming Tasks */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm flex-1">
             <h3 className="font-bold text-lg text-slate-900 mb-6 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-slate-400" /> Upcoming Tasks
             </h3>
             <div className="space-y-6">
               {isLoading ? (
                  <p className="text-sm text-slate-500">Loading tasks...</p>
               ) : (
                  data?.upcomingTasks?.length === 0 ? (
                     <p className="text-sm text-slate-500">No upcoming tasks found.</p>
                  ) : (
                     <div className="space-y-4">
                        {data?.upcomingTasks?.map((task: any) => (
                           <div key={task.id} className="flex items-start gap-3 group">
                           <div className="mt-0.5 w-4 h-4 rounded border-2 border-slate-300 shrink-0 group-hover:border-indigo-500 transition-colors cursor-pointer" />
                           <div>
                              <p className="text-sm font-medium text-slate-800 leading-tight">{task.title}</p>
                              <p className="text-xs text-slate-500 mt-1">{task.project_name} - {new Date(task.due_date).toLocaleDateString()}</p>
                           </div>
                           </div>
                        ))}
                     </div>
                  )
               )}
             </div>
          </div>

        </div>
      </div>
      
    </div>
  );
}
