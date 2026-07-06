import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { Activity } from "lucide-react";

export const Route = createFileRoute("/_authenticated/activity-logs")({
  component: Page,
});

function Page() {
  return (
    <div className="space-y-6 pb-12 max-w-[1600px] mx-auto text-slate-800">
      <PageHeader
        title={
          <div className="flex items-center gap-2 text-slate-900">
            <Activity className="h-6 w-6" /> Activity Logs
          </div>
        }
        description="Monitor all system events and user actions."
      />
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center text-slate-500 py-12">
        Activity logs feature coming soon.
      </div>
    </div>
  );
}
