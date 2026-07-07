import { PageHeader } from "@/components/app-shell";
import { GitMerge, MoreHorizontal, Plus, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useActiveOrg } from "@/hooks/use-orgs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function WorkflowsPage() {
  const { activeId } = useActiveOrg();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [trigger, setTrigger] = useState("");

  const { data: workflows, isLoading } = useQuery({
    queryKey: ["workflows", activeId],
    enabled: !!activeId,
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("workflows")
        .select("*")
        .eq("organization_id", activeId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createWorkflow = useMutation({
    mutationFn: async () => {
      const { data, error } = await (supabase as any)
        .from("workflows")
        .insert({
          organization_id: activeId!,
          name: name,
          trigger_condition: trigger,
          status: "active",
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflows", activeId] });
      setOpen(false);
      setName("");
      setTrigger("");
    },
  });

  return (
    <div className="space-y-6 pb-12 max-w-[1400px] mx-auto">
      <PageHeader
        title="Workflows"
        description="Automate your business processes."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl gap-2">
                <Plus className="h-4 w-4" /> New Workflow
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Workflow</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Workflow Name</label>
                  <Input
                    placeholder="e.g. Client Onboarding"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Trigger Condition</label>
                  <Input
                    placeholder="e.g. New Client Added"
                    value={trigger}
                    onChange={(e) => setTrigger(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-indigo-600 text-white hover:bg-indigo-700"
                  onClick={() => createWorkflow.mutate()}
                  disabled={!name || createWorkflow.isPending}
                >
                  {createWorkflow.isPending ? "Creating..." : "Create Workflow"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      {isLoading ? (
        <div className="text-center py-12 text-slate-500">Loading workflows...</div>
      ) : workflows && workflows.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflows.map((workflow: any) => (
            <div
              key={workflow.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <GitMerge className="h-5 w-5" />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-400 hover:text-slate-600 -mr-2 -mt-2"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              <h3 className="text-lg font-bold text-slate-900">{workflow.name}</h3>
              <div className="mt-2 text-sm text-slate-500 line-clamp-2">
                <span className="font-semibold text-slate-700">Trigger:</span>{" "}
                {workflow.trigger_condition || "None"}
              </div>
              <div className="mt-auto pt-6 flex items-center justify-between">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    workflow.status === "active"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {workflow.status === "active" ? "Active" : "Paused"}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-lg gap-2 text-xs font-semibold"
                >
                  {workflow.status === "active" ? (
                    <>
                      <Pause className="h-3 w-3" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3" /> Resume
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <GitMerge className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900">No workflows yet</h3>
          <p className="text-slate-500 mt-2 mb-6">Create your first workflow to automate tasks.</p>
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
            onClick={() => setOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" /> Create Workflow
          </Button>
        </div>
      )}
    </div>
  );
}
