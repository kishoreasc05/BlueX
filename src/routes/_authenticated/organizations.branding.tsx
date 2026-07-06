import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { PaintBucket } from "lucide-react";

export const Route = createFileRoute("/_authenticated/organizations/branding")({
  component: Page,
});

function Page() {
  return (
    <div className="space-y-6 pb-12 max-w-[1600px] mx-auto text-slate-800">
      <PageHeader
        title={
          <div className="flex items-center gap-2 text-slate-900">
            <PaintBucket className="h-6 w-6" /> Organization Branding
          </div>
        }
        description="Customize the look and feel of your workspace."
      />
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center text-slate-500 py-12">
        Branding settings coming soon.
      </div>
    </div>
  );
}
