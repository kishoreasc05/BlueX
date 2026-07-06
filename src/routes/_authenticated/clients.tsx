import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Users, Trash2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/clients")({
  component: ClientsPage,
});

type Client = {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  status: "active" | "inactive" | "archived";
  created_at: string;
};

function ClientsPage() {
  const { activeId } = useActiveOrg();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", notes: "" });

  const clients = useQuery({
    queryKey: ["clients", activeId],
    enabled: !!activeId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("organization_id", activeId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Client[];
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("clients").insert({
        organization_id: activeId!,
        name: form.name,
        company: form.company || null,
        email: form.email || null,
        phone: form.phone || null,
        notes: form.notes || null,
        created_by: user!.id,
      });
      if (error) throw error;
      await supabase.from("activity_log").insert({
        organization_id: activeId!,
        actor_id: user!.id,
        action: "created",
        entity_type: "client",
      });
    },
    onSuccess: () => {
      toast.success("Client added");
      setForm({ name: "", company: "", email: "", phone: "", notes: "" });
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["clients"] });
      qc.invalidateQueries({ queryKey: ["kpi"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("clients").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Client deleted");
      qc.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  return (
    <div>
      <PageHeader
        title="Clients"
        description="Companies and people you do business with."
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> Add client
          </Button>
        }
      />

      {clients.data && clients.data.length > 0 ? (
        <EntityTable
          rows={clients.data}
          columns={[
            { key: "name", header: "Name", render: (r) => <span className="font-medium">{r.name}</span> },
            { key: "company", header: "Company", render: (r) => r.company ?? "—" },
            { key: "email", header: "Email", render: (r) => r.email ?? "—" },
            { key: "phone", header: "Phone", render: (r) => r.phone ?? "—" },
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
          icon={Users}
          title="No clients yet"
          description="Add your first client to start tracking projects and documents against them."
          action={
            <Button onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" /> Add client
            </Button>
          }
        />
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New client</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoFocus />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Company</Label>
                <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Notes</Label>
              <Textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => create.mutate()} disabled={!form.name.trim() || create.isPending}>
              {create.isPending ? "Saving…" : "Save client"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}