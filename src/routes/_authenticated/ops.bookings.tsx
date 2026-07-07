import { createFileRoute } from "@tanstack/react-router";
import { OpsBookingsPage } from "@/admin/pages/bookings";

export const Route = createFileRoute("/_authenticated/ops/bookings")({
  component: OpsBookingsPage,
});
