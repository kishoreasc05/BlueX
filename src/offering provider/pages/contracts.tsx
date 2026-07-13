import { PageHeader } from "@/components/app-shell";
import { Hammer, Plus, Search, Trash2, Edit2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useActiveOrg } from "@/hooks/use-orgs";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function ContractsPage() {
  const { activeId } = useActiveOrg();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);

  // Form States
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [priceType, setPriceType] = useState("hourly");
  const [categoryId, setCategoryId] = useState("");

  // 1. Fetch Service Categories
  const { data: categories = [] } = useQuery({
    queryKey: ["serviceCategories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_categories")
        .select("*")
        .order("name", { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });

  // 2. Fetch Provider's Custom Services
  const { data: services = [], isLoading } = useQuery({
    queryKey: ["providerServicesList", activeId],
    enabled: !!activeId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("provider_services")
        .select(
          `
          *,
          category:service_categories(id, name, slug)
        `,
        )
        .eq("provider_id", activeId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  // Reset form helper
  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setPriceType("hourly");
    setCategoryId("");
    setEditingService(null);
  };

  // 3. Create Service Mutation
  const createServiceMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from("provider_services")
        .insert({
          provider_id: activeId!,
          category_id: categoryId,
          name,
          description,
          price: parseFloat(price),
          price_type: priceType,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Service added successfully!");
      queryClient.invalidateQueries({ queryKey: ["providerServicesList", activeId] });
      setOpen(false);
      resetForm();
    },
    onError: (err) => {
      toast.error((err as Error).message);
    },
  });

  // 4. Update Service Mutation
  const updateServiceMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from("provider_services")
        .update({
          category_id: categoryId,
          name,
          description,
          price: parseFloat(price),
          price_type: priceType,
        })
        .eq("id", editingService.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Service updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["providerServicesList", activeId] });
      setOpen(false);
      resetForm();
    },
    onError: (err) => {
      toast.error((err as Error).message);
    },
  });

  // 5. Delete Service Mutation
  const deleteServiceMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("provider_services").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.error("Service deleted.");
      queryClient.invalidateQueries({ queryKey: ["providerServicesList", activeId] });
    },
    onError: (err) => {
      toast.error((err as Error).message);
    },
  });

  const handleEditClick = (service: any) => {
    setEditingService(service);
    setName(service.name);
    setDescription(service.description || "");
    setPrice(service.price.toString());
    setPriceType(service.price_type);
    setCategoryId(service.category_id);
    setOpen(true);
  };

  const handleSave = () => {
    if (!name || !price || !categoryId) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (editingService) {
      updateServiceMutation.mutate();
    } else {
      createServiceMutation.mutate();
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-[1400px] mx-auto text-slate-800">
      <PageHeader
        title="My Services & Pricing"
        description="Offer customized or default blue-collar services to customers. Verified listings appear instantly in Search."
        action={
          <Button
            onClick={() => {
              resetForm();
              setOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-750 text-white rounded-xl gap-2 font-bold cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Add Service
          </Button>
        }
      />

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 flex items-center gap-4 bg-slate-50/20">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search offered services..."
              className="pl-9 bg-white border-slate-200 rounded-xl"
            />
          </div>
        </div>

        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 bg-slate-50/50 uppercase border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-bold">Service Info</th>
              <th className="px-6 py-4 font-bold">Category</th>
              <th className="px-6 py-4 font-bold">Pricing Type</th>
              <th className="px-6 py-4 font-bold">Price</th>
              <th className="px-6 py-4 text-right font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-400 font-semibold">
                  Loading service listings...
                </td>
              </tr>
            ) : services && services.length > 0 ? (
              services.map((service: any) => (
                <tr key={service.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                        <Hammer className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{service.name}</div>
                        <div className="text-xs text-slate-400 font-semibold max-w-md truncate">
                          {service.description || "No description provided."}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                      {service.category?.name || "General"}
                    </span>
                  </td>
                  <td className="px-6 py-4 capitalize text-xs text-slate-600 font-bold">
                    {service.price_type} Rate
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    CHF {Number(service.price).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(service)}
                        className="h-8 w-8 text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteServiceMutation.mutate(service.id)}
                        disabled={deleteServiceMutation.isPending}
                        className="h-8 w-8 text-slate-400 hover:text-red-650 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-semibold">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Hammer className="h-8 w-8 text-slate-300" />
                    <p>No services defined yet.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Add / Edit Service Dialog ── */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-950">
              {editingService ? "✏️ Edit Service Offering" : "➕ Add New Service Offering"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-500">Service Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="rounded-xl border-slate-200 h-10">
                  <SelectValue placeholder="Choose category..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat: any) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-500">Service Title</Label>
              <Input
                placeholder="e.g. Deep Home Carpet Cleaning"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl border-slate-200 h-10 focus-visible:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-500">Description</Label>
              <Input
                placeholder="Describe what is included in this service..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="rounded-xl border-slate-200 h-10 focus-visible:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-500">Price (CHF)</Label>
                <Input
                  type="number"
                  placeholder="e.g. 95.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="rounded-xl border-slate-200 h-10 focus-visible:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-500">Pricing Basis</Label>
                <Select value={priceType} onValueChange={setPriceType}>
                  <SelectTrigger className="rounded-xl border-slate-200 h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly Rate</SelectItem>
                    <SelectItem value="fixed">Fixed Flat Price</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-slate-100 flex gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="rounded-xl border-slate-200 text-xs font-bold"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={createServiceMutation.isPending || updateServiceMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold px-6 cursor-pointer"
            >
              {createServiceMutation.isPending || updateServiceMutation.isPending
                ? "Saving..."
                : "Save Service"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
