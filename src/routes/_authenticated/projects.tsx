import { createFileRoute } from "@tanstack/react-router";
import { ProjectsPage } from "@/offering provider/pages/projects";

export const Route = createFileRoute("/_authenticated/projects")({
  component: ProjectsPage,
});
