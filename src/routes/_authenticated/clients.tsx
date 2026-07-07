import { createFileRoute } from "@tanstack/react-router";
import { ClientsPage } from "@/offering provider/pages/clients";

export const Route = createFileRoute("/_authenticated/clients")({
  component: ClientsPage,
});
