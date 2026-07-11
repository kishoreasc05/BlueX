import { createFileRoute } from "@tanstack/react-router";
import { ClientCalendarPage } from "@/customer/pages/calendar";

export const Route = createFileRoute("/_authenticated/client/calendar")({
  component: ClientCalendarPage,
});
