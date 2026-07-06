import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { Zap } from "lucide-react";

export const Route = createFileRoute("/_authenticated/ai-automations")({
  component: Page,
});

function Page() {
  return (
    <div className="space-y-6 pb-12 max-w-[1600px] mx-auto text-slate-800">
      <PageHeader
        title={
          <div className="flex items-center gap-2 text-indigo-700">
            <Zap className="h-6 w-6" /> AI Automations
          </div>
        }
        description="Manage automated actions triggered by AI Copilot."
      />
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center text-slate-500 py-12">
        Automations feature coming soon.
      </div>
    </div>
  );
}
