import { createFileRoute } from "@tanstack/react-router";
import { WorkflowsPage } from "@/offering provider/pages/workflows";

export const Route = createFileRoute("/_authenticated/workflows")({
  component: WorkflowsPage,
});
