import { createFileRoute } from "@tanstack/react-router";
import { ClientMessagesPage } from "@/customer/pages/messages";

export const Route = createFileRoute("/_authenticated/client/messages")({
  component: ClientMessagesPage,
});
