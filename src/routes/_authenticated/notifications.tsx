import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { Bell, FileSignature, CheckCircle2, MessageSquare, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/notifications")({
  component: Page,
});

function Page() {
  return (
    <div className="space-y-6 pb-12 max-w-[800px] mx-auto">
      <PageHeader 
        title="Notifications" 
        description="Stay updated with your recent activity."
        action={
          <Button variant="outline" className="rounded-xl text-sm">
            Mark all as read
          </Button>
        }
      />
      
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700">Today</h3>
        </div>
        <div className="divide-y divide-slate-100">
          <div className="p-6 flex gap-4 hover:bg-slate-50/50 transition-colors bg-indigo-50/30">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <FileSignature className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-900 font-medium">Acme Corp signed the Consulting Agreement</p>
              <p className="text-sm text-slate-500 mt-1">The contract is now fully executed and saved to documents.</p>
              <p className="text-xs text-slate-400 mt-2">10 minutes ago</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2"></div>
          </div>
          <div className="p-6 flex gap-4 hover:bg-slate-50/50 transition-colors">
            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-900 font-medium">Payment received for Invoice INV-2026-001</p>
              <p className="text-sm text-slate-500 mt-1">$4,500 has been added to your balance.</p>
              <p className="text-xs text-slate-400 mt-2">2 hours ago</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-y border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700">Yesterday</h3>
        </div>
        <div className="divide-y divide-slate-100">
          <div className="p-6 flex gap-4 hover:bg-slate-50/50 transition-colors">
            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <AlertCircle className="h-5 w-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-900 font-medium">Project "Website Redesign" is at risk</p>
              <p className="text-sm text-slate-500 mt-1">2 tasks are overdue. Please review the project timeline.</p>
              <p className="text-xs text-slate-400 mt-2">Yesterday at 3:45 PM</p>
            </div>
          </div>
          <div className="p-6 flex gap-4 hover:bg-slate-50/50 transition-colors">
            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
              <MessageSquare className="h-5 w-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-900 font-medium">Sarah Jenkins commented on a task</p>
              <p className="text-sm text-slate-500 mt-1">"I've updated the figma designs according to the feedback."</p>
              <p className="text-xs text-slate-400 mt-2">Yesterday at 11:20 AM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
