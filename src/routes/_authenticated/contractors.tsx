import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, HardHat, Trash2 } from "lucide-react";
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

export const Route = createFileRoute("/_authenticated/contractors")({
  component: ContractorsPage,
});

type Contractor = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  specialty: string | null;
  hourly_rate: number | null;
  status: "active" | "inactive" | "archived";
};

function ContractorsPage() {
  const { activeId } = useActiveOrg();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    specialty: "",
    hourly_rate: "",
  });

  const rows = useQuery({
    queryKey: ["contractors", activeId],
    enabled: !!activeId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contractors")
        .select("*")
        .eq("organization_id", activeId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Contractor[];
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("contractors").insert({
        organization_id: activeId!,
        name: form.name,
        email: form.email || null,
        phone: form.phone || null,
        specialty: form.specialty || null,
        hourly_rate: form.hourly_rate ? Number(form.hourly_rate) : null,
        created_by: user!.id,
      });
      if (error) throw error;
      await supabase.from("activity_log").insert({
        organization_id: activeId!,
        actor_id: user!.id,
        action: "created",
        entity_type: "contractor",
      });
    },
    onSuccess: () => {
      toast.success("Contractor added");
      setForm({ name: "", email: "", phone: "", specialty: "", hourly_rate: "" });
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["contractors"] });
      qc.invalidateQueries({ queryKey: ["kpi"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contractors").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["contractors"] });
    },
  });

  return (
    <div>
      <PageHeader
        title="Contractors"
        description="External specialists you engage on projects."
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> Add contractor
          </Button>
        }
      />
      {rows.data && rows.data.length > 0 ? (
        <EntityTable
          rows={rows.data}
          columns={[
            {
              key: "name",
              header: "Name",
              render: (r) => <span className="font-medium">{r.name}</span>,
            },
            { key: "specialty", header: "Specialty", render: (r) => r.specialty ?? "—" },
            { key: "email", header: "Email", render: (r) => r.email ?? "—" },
            {
              key: "rate",
              header: "Rate",
              render: (r) => (r.hourly_rate ? `$${r.hourly_rate}/hr` : "—"),
            },
            {
              key: "status",
              header: "Status",
              render: (r) => (
                <Badge variant="secondary" className="capitalize">
                  {r.status}
                </Badge>
              ),
            },
            {
              key: "actions",
              header: "",
              className: "w-10",
              render: (r) => (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Delete ${r.name}?`)) remove.mutate(r.id);
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
          icon={HardHat}
          title="No contractors yet"
          description="Add contractors to assign them to projects and tasks."
          action={
            <Button onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" /> Add contractor
            </Button>
          }
        />
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New contractor</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                autoFocus
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Specialty</Label>
                <Input
                  placeholder="e.g. Design"
                  value={form.specialty}
                  onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Hourly rate</Label>
                <Input
                  type="number"
                  value={form.hourly_rate}
                  onChange={(e) => setForm({ ...form, hourly_rate: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => create.mutate()}
              disabled={!form.name.trim() || create.isPending}
            >
              {create.isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
