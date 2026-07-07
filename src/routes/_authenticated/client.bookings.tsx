import { createFileRoute } from "@tanstack/react-router";
import { ClientBookingsPage } from "@/customer/pages/bookings";

export const Route = createFileRoute("/_authenticated/client/bookings")({
  component: ClientBookingsPage,
});
