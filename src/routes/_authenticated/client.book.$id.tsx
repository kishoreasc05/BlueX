import { createFileRoute } from "@tanstack/react-router";
import { BookingRequestPage } from "@/customer/pages/booking-request";

export const Route = createFileRoute("/_authenticated/client/book/$id")({
  component: BookingRequestPage,
});
