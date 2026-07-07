import { createFileRoute } from "@tanstack/react-router";
import { ClientTendersPage } from "@/customer/pages/tenders";

export const Route = createFileRoute("/_authenticated/client/tenders")({
  component: ClientTendersPage,
});
