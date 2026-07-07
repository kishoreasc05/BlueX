import { createFileRoute } from "@tanstack/react-router";
import { ContractsPage } from "@/offering provider/pages/contracts";

export const Route = createFileRoute("/_authenticated/contracts")({
  component: ContractsPage,
});
