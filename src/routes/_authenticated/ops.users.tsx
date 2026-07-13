import { createFileRoute } from "@tanstack/react-router";
import { OpsUsersPage } from "@/admin/pages/users";
import { z } from "zod";

const opsUsersSearchSchema = z.object({
  role: z.string().optional(),
  tab: z.string().optional(),
});

export const Route = createFileRoute("/_authenticated/ops/users")({
  validateSearch: (search) => opsUsersSearchSchema.parse(search),
  component: OpsUsersPage,
});
