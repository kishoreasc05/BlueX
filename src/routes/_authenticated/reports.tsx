import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { BarChart3, Download, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/_authenticated/reports")({
  component: Page,
});

const revenueData = [
  { name: "Jan", total: 0 },
  { name: "Feb", total: 0 },
  { name: "Mar", total: 0 },
  { name: "Apr", total: 0 },
  { name: "May", total: 0 },
  { name: "Jun", total: 0 },
  { name: "Jul", total: 0 },
];

function Page() {
  return (
    <div className="space-y-6 pb-12 max-w-[1400px] mx-auto">
      <PageHeader 
        title="Reports" 
        description="View and analyze your business metrics."
        action={
          <Button variant="outline" className="rounded-xl gap-2">
            <Download className="h-4 w-4" /> Export Report
          </Button>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-sm font-medium text-slate-500 mb-2">Total Revenue</div>
          <div className="text-3xl font-bold text-slate-900">$0</div>
          <div className="mt-2 text-sm text-slate-500 font-medium">
             No data available
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-sm font-medium text-slate-500 mb-2">Active Projects</div>
          <div className="text-3xl font-bold text-slate-900">0</div>
          <div className="mt-2 text-sm text-slate-500 font-medium">
             No data available
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-sm font-medium text-slate-500 mb-2">Avg. Resolution Time</div>
          <div className="text-3xl font-bold text-slate-900">0 days</div>
          <div className="mt-2 text-sm text-slate-500 font-medium">
            No data available
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-indigo-500" /> Revenue Growth
          </h2>
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#cbd5e1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#cbd5e1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="total" stroke="#cbd5e1" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
