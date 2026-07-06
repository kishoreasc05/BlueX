import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, FolderKanban, Trash2, Calendar, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useActiveOrg } from "@/hooks/use-orgs";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/app-shell";
import { EmptyState } from "@/components/kpi-card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/projects")({
  component: ProjectsPage,
});

const STATUSES = ["planning", "active", "on_hold", "completed", "cancelled"] as const;

type Project = {
  id: string;
  name: string;
  description: string | null;
  status: (typeof STATUSES)[number];
  due_date: string | null;
  client: { name: string } | null;
};

const getStatusColor = (status: Project["status"]) => {
  switch (status) {
    case "planning": return "bg-slate-100 text-slate-700 border-slate-200";
    case "active": return "bg-blue-100 text-blue-700 border-blue-200";
    case "on_hold": return "bg-amber-100 text-amber-700 border-amber-200";
    case "completed": return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "cancelled": return "bg-red-100 text-red-700 border-red-200";
  }
};

function ProjectsPage() {
  const { activeId } = useActiveOrg();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", client_id: "", status: "planning" as Project["status"], due_date: "" });

  const [draggedProjectId, setDraggedProjectId] = useState<string | null>(null);

  const projects = useQuery({
    queryKey: ["projects", activeId],
    enabled: !!activeId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("id, name, description, status, due_date, client:clients(name)")
        .eq("organization_id", activeId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Project[];
    },
  });

  const clients = useQuery({
    queryKey: ["clients-picker", activeId],
    enabled: !!activeId && open,
    queryFn: async () => {
      const { data } = await supabase.from("clients").select("id, name").eq("organization_id", activeId!).order("name");
      return data ?? [];
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("projects").insert({
        organization_id: activeId!,
        name: form.name,
        description: form.description || null,
        client_id: form.client_id || null,
        status: form.status,
        due_date: form.due_date || null,
        owner_id: user!.id,
        created_by: user!.id,
      });
      if (error) throw error;
      await supabase.from("activity_log").insert({ organization_id: activeId!, actor_id: user!.id, action: "created", entity_type: "project" });
    },
    onSuccess: () => {
      toast.success("Project created");
      setForm({ name: "", description: "", client_id: "", status: "planning", due_date: "" });
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["projects"] });
      qc.invalidateQueries({ queryKey: ["kpi"] });
      qc.invalidateQueries({ queryKey: ["recent-projects"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["projects"] }); },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: Project["status"] }) => {
      const { error } = await supabase.from("projects").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: ["projects", activeId] });
      const previous = qc.getQueryData(["projects", activeId]);
      qc.setQueryData(["projects", activeId], (old: any) => 
        old?.map((p: any) => p.id === id ? { ...p, status } : p)
      );
      return { previous };
    },
    onError: (err, newTodo, context) => {
      qc.setQueryData(["projects", activeId], context?.previous);
      toast.error(err.message);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["projects", activeId] });
    },
  });

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedProjectId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, status: Project["status"]) => {
    e.preventDefault();
    if (draggedProjectId) {
      const project = projects.data?.find(p => p.id === draggedProjectId);
      if (project && project.status !== status) {
         updateStatus.mutate({ id: draggedProjectId, status });
      }
    }
    setDraggedProjectId(null);
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col">
      <PageHeader
        title="Projects"
        description="Every initiative your team is running."
        action={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> New project</Button>}
      />
      
      {projects.data ? (
        <div className="flex-1 grid grid-cols-5 gap-3 lg:gap-4 pb-4 overflow-hidden">
          {STATUSES.map(status => {
            const columnProjects = projects.data.filter(p => p.status === status);
            let colStyle = "";
            let emptyIcon = null;
            let emptyTitle = "";
            let emptyDesc = "";
            let btnColor = "";
            
            switch (status) {
              case "planning": 
                colStyle = "bg-indigo-50/30 border-indigo-200 border-dashed"; 
                btnColor = "text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50";
                emptyIcon = <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3"><FolderKanban className="h-5 w-5" /></div>;
                emptyTitle = "No planning projects";
                emptyDesc = "Projects in planning phase will appear here";
                break;
              case "active": 
                colStyle = "bg-blue-50/30 border-blue-200 border-dashed"; 
                btnColor = "text-blue-600 hover:text-blue-700 hover:bg-blue-50";
                emptyIcon = <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3"><FolderKanban className="h-5 w-5" /></div>;
                emptyTitle = "No active projects";
                emptyDesc = "Drag and drop projects here or add new";
                break;
              case "on_hold": 
                colStyle = "bg-amber-50/30 border-amber-200 border-dashed"; 
                btnColor = "text-amber-600 hover:text-amber-700 hover:bg-amber-50";
                emptyIcon = <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-3"><FolderKanban className="h-5 w-5" /></div>;
                emptyTitle = "No projects on hold";
                emptyDesc = "Paused projects will appear here";
                break;
              case "completed": 
                colStyle = "bg-emerald-50/30 border-emerald-200 border-dashed"; 
                btnColor = "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50";
                emptyIcon = <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3"><FolderKanban className="h-5 w-5" /></div>;
                emptyTitle = "No completed projects";
                emptyDesc = "Completed projects will appear here";
                break;
              case "cancelled": 
                colStyle = "bg-red-50/30 border-red-200 border-dashed"; 
                btnColor = "text-red-600 hover:text-red-700 hover:bg-red-50";
                emptyIcon = <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-3"><FolderKanban className="h-5 w-5" /></div>;
                emptyTitle = "No cancelled projects";
                emptyDesc = "Cancelled projects will appear here";
                break;
            }

            return (
              <div 
                key={status}
                className={cn("flex flex-col rounded-2xl border p-3 h-full", colStyle)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, status)}
              >
                <div className="flex items-center justify-between mb-4 px-1">
                  <h3 className="font-semibold text-sm text-slate-800 capitalize flex items-center gap-2">
                    <span className={cn("w-2.5 h-2.5 rounded-full", getStatusColor(status).split(" ")[0])} />
                    {status.replace("_", " ")}
                  </h3>
                  <span className="text-xs font-medium bg-white px-2 py-1 rounded-md border border-slate-200 text-slate-500 shadow-sm">
                    {columnProjects.length}
                  </span>
                </div>

                <div className="flex-1 flex flex-col gap-3 overflow-y-auto min-h-[150px]">
                  {columnProjects.length > 0 ? (
                    columnProjects.map(project => (
                      <div
                        key={project.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, project.id)}
                        className={cn(
                          "bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-400 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group flex flex-col gap-1.5",
                          draggedProjectId === project.id && "opacity-50 scale-[0.98] rotate-1 shadow-xl"
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-xs text-slate-800 leading-tight">{project.name}</h4>
                          <button 
                            onClick={(e) => { e.stopPropagation(); if (confirm(`Delete ${project.name}?`)) remove.mutate(project.id); }} 
                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-600 transition-opacity p-1 -mr-1 -mt-1"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        
                        {project.description && (
                          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                            {project.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between mt-1 pt-2 border-t border-slate-50">
                          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md max-w-[120px] truncate">
                            {project.client?.name ?? "No Client"}
                          </div>
                          {project.due_date && (
                            <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
                              <Calendar className="h-3 w-3" />
                              {new Date(project.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                      {emptyIcon}
                      <h4 className="font-medium text-sm text-slate-700 mb-1">{emptyTitle}</h4>
                      <p className="text-xs text-slate-500 mb-4">{emptyDesc}</p>
                    </div>
                  )}
                  
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New project</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoFocus /></div>
            <div className="space-y-1.5"><Label>Description</Label><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Client</Label>
                <Select value={form.client_id || "none"} onValueChange={(v) => setForm({ ...form, client_id: v === "none" ? "" : v })}>
                  <SelectTrigger><SelectValue placeholder="No client" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No client</SelectItem>
                    {clients.data?.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Project["status"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5"><Label>Due date</Label><Input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => create.mutate()} disabled={!form.name.trim() || create.isPending}>{create.isPending ? "Saving…" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}