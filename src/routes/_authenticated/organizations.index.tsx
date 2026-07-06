import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { Building2, MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, ChangeEvent, MouseEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

export const Route = createFileRoute("/_authenticated/organizations/")({
  component: Page,
});

function Page() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const [selectedOrg, setSelectedOrg] = useState<any>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const { data: organizations, isLoading } = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organizations")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createOrganization = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from("organizations")
        .insert({
          name,
          slug: name.toLowerCase().replace(/[\s_]+/g, "-"),
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      setOpen(false);
      setName("");
    },
  });

  const handleRowClick = (org: any) => {
    setSelectedOrg(org);
    setSheetOpen(true);
  };

  return (
    <div className="space-y-6 pb-12 max-w-[1400px] mx-auto">
      <PageHeader
        title="Organizations"
        description="Manage your workspaces and organizations."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl gap-2">
                <Plus className="h-4 w-4" /> New Organization
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Organization</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Organization Name</label>
                  <Input
                    placeholder="e.g. Acme Corp"
                    value={name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-indigo-600 text-white hover:bg-indigo-700"
                  onClick={() => createOrganization.mutate()}
                  disabled={!name || createOrganization.isPending}
                >
                  {createOrganization.isPending ? "Creating..." : "Create Organization"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 bg-slate-50/50 uppercase border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Plan</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                  Loading organizations...
                </td>
              </tr>
            ) : organizations && organizations.length > 0 ? (
              organizations.map((org: any) => (
                <tr
                  key={org.id}
                  onClick={() => handleRowClick(org)}
                  className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <Building2 className="h-4 w-4" />
                    </div>
                    {org.name}
                  </td>
                  <td className="px-6 py-4 text-slate-500 capitalize">{org.plan || "Free"}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700`}
                    >
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-slate-600"
                      onClick={(e: MouseEvent<HTMLButtonElement>) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Building2 className="h-8 w-8 text-slate-300" />
                    <p>No organizations found.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Organization Details</SheetTitle>
            <SheetDescription>View detailed information about this organization.</SheetDescription>
          </SheetHeader>
          {selectedOrg && (
            <div className="mt-6 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-slate-500">Name</h3>
                <p className="mt-1 text-base font-semibold text-slate-900">{selectedOrg.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500">Plan</h3>
                <p className="mt-1 text-base font-semibold text-slate-900 capitalize">
                  {selectedOrg.plan || "Free"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500">Status</h3>
                <div className="mt-1">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700`}
                  >
                    Active
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500">Created At</h3>
                <p className="mt-1 text-sm text-slate-900">
                  {new Date(selectedOrg.created_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
