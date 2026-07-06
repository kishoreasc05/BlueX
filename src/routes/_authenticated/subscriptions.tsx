import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { CreditCard, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/subscriptions")({
  component: Page,
});

function Page() {
  return (
    <div className="space-y-6 pb-12 max-w-[1400px] mx-auto">
      <PageHeader
        title="Subscriptions"
        description="Manage your organization's billing and subscription plan."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-8">
        {[
          {
            name: "Basic",
            price: "$49",
            period: "/mo",
            features: ["Up to 5 users", "Basic reporting", "Community support"],
            current: false,
          },
          {
            name: "Pro",
            price: "$149",
            period: "/mo",
            features: [
              "Up to 20 users",
              "Advanced analytics",
              "Priority support",
              "Custom workflows",
            ],
            current: true,
          },
          {
            name: "Enterprise",
            price: "Custom",
            period: "",
            features: [
              "Unlimited users",
              "Dedicated account manager",
              "Custom integrations",
              "SLA guarantee",
            ],
            current: false,
          },
        ].map((plan, i) => (
          <div
            key={i}
            className={`relative bg-white rounded-2xl border p-8 flex flex-col ${plan.current ? "border-indigo-500 shadow-md ring-1 ring-indigo-500" : "border-slate-200 shadow-sm"}`}
          >
            {plan.current && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Current Plan
              </div>
            )}
            <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
            <div className="mt-4 flex items-baseline text-4xl font-extrabold text-slate-900">
              {plan.price}
              <span className="ml-1 text-xl font-medium text-slate-500">{plan.period}</span>
            </div>
            <ul className="mt-8 space-y-4 flex-1">
              {plan.features.map((feature, j) => (
                <li key={j} className="flex items-center gap-3 text-slate-600">
                  <Check className="h-5 w-5 text-indigo-500 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              className={`mt-8 w-full rounded-xl ${plan.current ? "bg-slate-100 text-slate-900 hover:bg-slate-200" : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}
            >
              {plan.current ? "Manage Plan" : "Upgrade"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
