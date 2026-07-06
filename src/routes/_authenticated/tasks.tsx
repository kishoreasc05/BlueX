import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, CheckSquare, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useActiveOrg } from "@/hooks/use-orgs";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/app-shell";
import { EmptyState } from "@/components/kpi-card";
import { EntityTable } from "@/components/entity-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/tasks")({
  component: TasksPage,
});

const STATUS = ["todo", "in_progress", "blocked", "done"] as const;
const PRIORITY = ["low", "medium", "high", "urgent"] as const;

type Task = {
  id: string;
  title: string;
  status: (typeof STATUS)[number];
  priority: (typeof PRIORITY)[number];
  due_date: string | null;
  project: { name: string } | null;
};

const statusTone: Record<Task["status"], string> = {
  todo: "secondary",
  in_progress: "default",
  blocked: "destructive",
  done: "outline",
} as const as Record<Task["status"], string>;

function TasksPage() {
  const { activeId } = useActiveOrg();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    project_id: "",
    status: "todo" as Task["status"],
    priority: "medium" as Task["priority"],
    due_date: "",
  });

  const tasks = useQuery({
    queryKey: ["tasks", activeId],
    enabled: !!activeId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("id, title, status, priority, due_date, project:projects(name)")
        .eq("organization_id", activeId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Task[];
    },
  });

  const projects = useQuery({
    queryKey: ["projects-picker", activeId],
    enabled: !!activeId && open,
    queryFn: async () => {
      const { data } = await supabase
        .from("projects")
        .select("id, name")
        .eq("organization_id", activeId!)
        .order("name");
      return data ?? [];
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("tasks").insert({
        organization_id: activeId!,
        title: form.title,
        project_id: form.project_id || null,
        status: form.status,
        priority: form.priority,
        due_date: form.due_date || null,
        created_by: user!.id,
      });
      if (error) throw error;
      await supabase
        .from("activity_log")
        .insert({
          organization_id: activeId!,
          actor_id: user!.id,
          action: "created",
          entity_type: "task",
        });
    },
    onSuccess: () => {
      toast.success("Task created");
      setForm({ title: "", project_id: "", status: "todo", priority: "medium", due_date: "" });
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["kpi"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Task["status"] }) => {
      const { error } = await supabase.from("tasks").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["kpi"] });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return (
    <div>
      <PageHeader
        title="Tasks"
        description="What needs to get done, and by when."
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> New task
          </Button>
        }
      />
      {tasks.data && tasks.data.length > 0 ? (
        <EntityTable
          rows={tasks.data}
          columns={[
            {
              key: "title",
              header: "Title",
              render: (r) => (
                <span
                  className={`font-medium ${r.status === "done" ? "line-through text-muted-foreground" : ""}`}
                >
                  {r.title}
                </span>
              ),
            },
            { key: "project", header: "Project", render: (r) => r.project?.name ?? "—" },
            {
              key: "priority",
              header: "Priority",
              render: (r) => (
                <Badge variant="outline" className="capitalize">
                  {r.priority}
                </Badge>
              ),
            },
            {
              key: "status",
              header: "Status",
              render: (r) => (
                <Select
                  value={r.status}
                  onValueChange={(v) =>
                    updateStatus.mutate({ id: r.id, status: v as Task["status"] })
                  }
                >
                  <SelectTrigger className="h-8 w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS.map((s) => (
                      <SelectItem key={s} value={s} className="capitalize">
                        {s.replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ),
            },
            {
              key: "due",
              header: "Due",
              render: (r) => (r.due_date ? new Date(r.due_date).toLocaleDateString() : "—"),
            },
            {
              key: "actions",
              header: "",
              className: "w-10",
              render: (r) => (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Delete task?`)) remove.mutate(r.id);
                  }}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              ),
            },
          ]}
        />
      ) : (
        <EmptyState
          icon={CheckSquare}
          title="No tasks yet"
          description="Add tasks to track what needs to get done."
          action={
            <Button onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" /> New task
            </Button>
          }
        />
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New task</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                autoFocus
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Project</Label>
                <Select
                  value={form.project_id || "none"}
                  onValueChange={(v) => setForm({ ...form, project_id: v === "none" ? "" : v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="No project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No project</SelectItem>
                    {projects.data?.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Priority</Label>
                <Select
                  value={form.priority}
                  onValueChange={(v) => setForm({ ...form, priority: v as Task["priority"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITY.map((p) => (
                      <SelectItem key={p} value={p} className="capitalize">
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Due date</Label>
              <Input
                type="date"
                value={form.due_date}
                onChange={(e) => setForm({ ...form, due_date: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => create.mutate()}
              disabled={!form.title.trim() || create.isPending}
            >
              {create.isPending ? "Saving…" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// referenced to satisfy TS on statusTone unused
void statusTone;
