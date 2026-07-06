import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/_authenticated/audit-logs")({
  component: Page,
});

function Page() {
  return (
    <div className="space-y-6 pb-12 max-w-[1600px] mx-auto text-slate-800">
      <PageHeader
        title={
          <div className="flex items-center gap-2 text-slate-900">
            <ShieldAlert className="h-6 w-6" /> Audit Logs
          </div>
        }
        description="Detailed security and compliance logs."
      />
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center text-slate-500 py-12">
        Audit logs feature coming soon.
      </div>
    </div>
  );
}
