import { createFileRoute } from "@tanstack/react-router";
import { OpsUsersPage } from "@/admin/pages/users";

export const Route = createFileRoute("/_authenticated/ops/users")({
  component: OpsUsersPage,
});
