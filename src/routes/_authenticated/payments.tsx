import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { CircleDollarSign, MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/payments")({
  component: Page,
});

function Page() {
  return (
    <div className="space-y-6 pb-12 max-w-[1400px] mx-auto">
      <PageHeader
        title="Payments"
        description="Manage invoices and track transactions."
        action={
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl gap-2">
            <Plus className="h-4 w-4" /> New Invoice
          </Button>
        }
      />
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 bg-slate-50/50 uppercase border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold">Invoice ID</th>
              <th className="px-6 py-4 font-semibold">Client</th>
              <th className="px-6 py-4 font-semibold">Amount</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                id: "INV-2026-001",
                client: "Acme Corp",
                amount: "$4,500",
                status: "Paid",
                date: "Jul 01, 2026",
              },
              {
                id: "INV-2026-002",
                client: "Globex Inc",
                amount: "$1,200",
                status: "Pending",
                date: "Jul 05, 2026",
              },
              {
                id: "INV-2026-003",
                client: "Initech",
                amount: "$8,000",
                status: "Overdue",
                date: "Jun 15, 2026",
              },
            ].map((payment, i) => (
              <tr
                key={i}
                className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <CircleDollarSign className="h-4 w-4" />
                  </div>
                  {payment.id}
                </td>
                <td className="px-6 py-4 text-slate-500">{payment.client}</td>
                <td className="px-6 py-4 font-medium text-slate-700">{payment.amount}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      payment.status === "Paid"
                        ? "bg-emerald-50 text-emerald-700"
                        : payment.status === "Pending"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-red-50 text-red-700"
                    }`}
                  >
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500">{payment.date}</td>
                <td className="px-6 py-4 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-slate-600"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
