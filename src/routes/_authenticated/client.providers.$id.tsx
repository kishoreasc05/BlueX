import { createFileRoute } from "@tanstack/react-router";
import { ProviderDetailsPage } from "@/customer/pages/provider-details";

export const Route = createFileRoute("/_authenticated/client/providers/$id")({
  component: ProviderDetailsPage,
});
