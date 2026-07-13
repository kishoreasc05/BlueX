import { createFileRoute } from "@tanstack/react-router";
import { ProviderBookingsPage } from "../../offering provider/pages/bookings";

export const Route = createFileRoute("/_authenticated/bookings")({
  component: ProviderBookingsPage,
});
