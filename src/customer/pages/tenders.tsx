import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { toast } from "sonner";
import { Briefcase, Calendar, DollarSign, Plus, Check } from "lucide-react";
import { PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/kpi-card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ClientTendersPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [categoryId, setCategoryId] = useState("");

  // Fetch Service Categories
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("service_categories").select("*");
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch Tenders & Bids
  const { data: tenders, isLoading } = useQuery({
    queryKey: ["clientTenders", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("public_tenders")
        .select(`
          id, 
          title, 
          description, 
          budget, 
          due_date, 
          status,
          category:service_categories(name),
          bids:tender_bids(
            id, 
            amount, 
            proposal, 
            status,
            provider:organizations(name)
          )
        `)
        .eq("client_id", user!.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const createTender = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("public_tenders").insert({
        client_id: user!.id,
        category_id: categoryId,
        title,
        description,
        budget: budget ? Number(budget) : null,
        due_date: dueDate || null,
        status: "open",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Public tender posted successfully!");
      setOpen(false);
      setTitle("");
      setDescription("");
      setBudget("");
      setDueDate("");
      setCategoryId("");
      queryClient.invalidateQueries({ queryKey: ["clientTenders"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const acceptBid = useMutation({
    mutationFn: async ({ bidId, tenderId }: { bidId: string; tenderId: string }) => {
      // 1. Accept the chosen bid
      const updateBid = supabase
        .from("tender_bids")
        .update({ status: "accepted" })
        .eq("id", bidId);

      // 2. Reject other bids
      const rejectOthers = supabase
        .from("tender_bids")
        .update({ status: "rejected" })
        .eq("tender_id", tenderId)
        .neq("id", bidId);

      // 3. Close the tender
      const closeTender = supabase
        .from("public_tenders")
        .update({ status: "closed" })
        .eq("id", tenderId);

      const [res1, res2, res3] = await Promise.all([updateBid, rejectOthers, closeTender]);
      if (res1.error) throw res1.error;
      if (res2.error) throw res2.error;
      if (res3.error) throw res3.error;
    },
    onSuccess: () => {
      toast.success("Bid accepted!");
      queryClient.invalidateQueries({ queryKey: ["clientTenders"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="space-y-6 pb-12 max-w-[1400px] mx-auto text-slate-800">
      <PageHeader
        title="Public Tenders"
        description="Post jobs for bidding and choose the best proposals from service professionals."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl gap-2 cursor-pointer">
                <Plus className="h-4 w-4" /> Post New Tender
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Post a Public Tender</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Job Title</label>
                  <Input
                    placeholder="e.g. Electrical wiring for new kitchen"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Service Category</label>
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select service category..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Job Description</label>
                  <Textarea
                    placeholder="Describe the tasks, requirements, and scope of work..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Budget (CHF)</label>
                    <Input
                      type="number"
                      placeholder="e.g. 500"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Due Date</label>
                    <Input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  onClick={() => createTender.mutate()}
                  disabled={!title || !categoryId || createTender.isPending}
                >
                  {createTender.isPending ? "Posting..." : "Post Tender"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Tenders list */}
      <div className="space-y-6">
        {isLoading ? (
          <p className="text-sm text-slate-500 text-center py-6">Loading tenders...</p>
        ) : !tenders || tenders.length === 0 ? (
          <EmptyState
            title="No public tenders posted"
            description="Post a public job opportunity to receive proposals and estimates from professional service providers."
            icon={Briefcase}
          />
        ) : (
          tenders.map((tender: any) => (
            <div
              key={tender.id}
              className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-6 space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-lg text-slate-900">{tender.title}</h3>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                        tender.status === "open"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : "bg-slate-50 text-slate-600 border-slate-200"
                      }`}
                    >
                      {tender.status}
                    </span>
                  </div>
                  <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wider">
                    {tender.category?.name}
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed mt-2">{tender.description}</p>

                  <div className="flex flex-wrap gap-4 text-xs text-slate-400 mt-2">
                    {tender.budget && (
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <DollarSign className="w-3.5 h-3.5" /> Budget: CHF {Number(tender.budget).toLocaleString()}
                      </span>
                    )}
                    {tender.due_date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> Close Date: {new Date(tender.due_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bids list */}
              <div className="border-t border-slate-100 pt-6">
                <h4 className="font-bold text-sm text-slate-900 mb-4">Received Bids ({tender.bids?.length || 0})</h4>
                {!tender.bids || tender.bids.length === 0 ? (
                  <p className="text-xs text-slate-400">Waiting for bids from service providers...</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tender.bids.map((bid: any) => (
                      <div
                        key={bid.id}
                        className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex justify-between items-start gap-2">
                            <div className="font-semibold text-slate-900 text-sm">
                              {bid.provider?.name || "Service Professional"}
                            </div>
                            <div className="font-bold text-indigo-600 text-sm">
                              CHF {Number(bid.amount).toFixed(2)}
                            </div>
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                            {bid.proposal}
                          </p>
                        </div>

                        {tender.status === "open" && bid.status === "pending" && (
                          <Button
                            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs gap-1 cursor-pointer"
                            onClick={() => acceptBid.mutate({ bidId: bid.id, tenderId: tender.id })}
                            disabled={acceptBid.isPending}
                          >
                            <Check className="w-3.5 h-3.5" /> Accept Bid
                          </Button>
                        )}

                        {bid.status === "accepted" && (
                          <div className="mt-4 text-center text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 p-1.5 rounded-lg">
                            ACCEPTED
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
