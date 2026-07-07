import { createFileRoute } from "@tanstack/react-router";
import { ContractorsPage } from "@/offering provider/pages/contractors";

export const Route = createFileRoute("/_authenticated/contractors")({
  component: ContractorsPage,
});
