import { createFileRoute } from "@tanstack/react-router";
import { TasksPage } from "@/offering provider/pages/tasks";

export const Route = createFileRoute("/_authenticated/tasks")({
  component: TasksPage,
});
