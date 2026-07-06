import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/_authenticated/organizations/permissions")({
  component: Page,
});

function Page() {
  return (
    <div className="space-y-6 pb-12 max-w-[1600px] mx-auto text-slate-800">
      <PageHeader 
        title={
          <div className="flex items-center gap-2 text-slate-900">
             <ShieldCheck className="h-6 w-6" /> Organization Permissions
          </div>
        }
        description="Configure access controls and default permissions."
      />
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center text-slate-500 py-12">
         Permissions configuration coming soon.
      </div>
    </div>
  );
}
