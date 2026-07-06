import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function slugify(v: string) {
  return (
    v
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") + "-" + Math.random().toString(36).slice(2, 8)
  );
}

export function CreateOrgDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [name, setName] = useState("");
  const { user } = useAuth();
  const qc = useQueryClient();

  const mut = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not signed in");
      const { data: org, error } = await supabase
        .from("organizations")
        .insert({ name, slug: slugify(name), created_by: user.id })
        .select()
        .single();
      if (error) throw error;
      const { error: memErr } = await supabase
        .from("organization_members")
        .insert({ organization_id: org.id, user_id: user.id, role: "owner" });
      if (memErr) throw memErr;
      return org;
    },
    onSuccess: () => {
      toast.success("Workspace created");
      setName("");
      onOpenChange(false);
      qc.invalidateQueries({ queryKey: ["orgs"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create workspace</DialogTitle>
          <DialogDescription>
            Workspaces isolate data — members, clients, projects and documents live inside a workspace.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="ws-name">Name</Label>
          <Input
            id="ws-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Acme Holdings"
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => mut.mutate()} disabled={!name.trim() || mut.isPending}>
            {mut.isPending ? "Creating…" : "Create workspace"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}