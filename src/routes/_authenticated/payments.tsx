import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { CircleDollarSign, MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/payments")({
  component: Page,
});

function Page() {
  const { user } = useAuth();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["clientBookingsForPayments", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          id,
          status,
          scheduled_at,
          total_price,
          provider:organizations(name)
        `)
        .eq("client_id", user!.id)
        .order("scheduled_at", { ascending: false });

      if (error) throw error;
      return (data || []) as any[];
    },
  });

  const payments = (bookings || []).map((b) => {
    let status = "Pending";
    if (b.status === "completed") {
      status = "Paid";
    } else if (b.status === "cancelled") {
      status = "Cancelled";
    }

    return {
      id: `BKG-${b.id.substring(0, 8).toUpperCase()}`,
      providerName: b.provider?.name || "Service Provider",
      amount: `CHF ${Number(b.total_price).toFixed(0)}`,
      status,
      date: new Date(b.scheduled_at).toLocaleDateString("en-CH", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };
  });

  return (
    <div className="space-y-6 pb-12 max-w-[1400px] mx-auto text-slate-800">
      <PageHeader
        title="Payments"
        description="Track your transaction history and invoices."
      />

      {isLoading ? (
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-12 text-center text-slate-400 font-medium">
          Loading payment history...
        </div>
      ) : payments.length === 0 ? (
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-12 text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-400">
            <CircleDollarSign className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900">No transactions</h3>
            <p className="text-xs text-slate-400">
              When you book services and payments are processed, they will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 bg-slate-50/50 uppercase border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Transaction ID</th>
                <th className="px-6 py-4 font-semibold">Service Provider</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p, i) => (
                <tr
                  key={i}
                  className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                      <CircleDollarSign className="h-4 w-4" />
                    </div>
                    {p.id}
                  </td>
                  <td className="px-6 py-4 text-slate-500">{p.providerName}</td>
                  <td className="px-6 py-4 font-medium text-slate-700">{p.amount}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        p.status === "Paid"
                          ? "bg-emerald-50 text-emerald-700"
                          : p.status === "Pending"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-red-50 text-red-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{p.date}</td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
