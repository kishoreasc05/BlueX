import { createFileRoute } from "@tanstack/react-router";
import { JobsPage } from "@/offering provider/pages/jobs";

export const Route = createFileRoute("/_authenticated/jobs")({
  component: JobsPage,
});
