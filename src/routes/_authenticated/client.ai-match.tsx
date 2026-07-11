import { createFileRoute } from "@tanstack/react-router";
import { AiMatchPage } from "@/customer/pages/ai-match";

export const Route = createFileRoute("/_authenticated/client/ai-match")({
  component: AiMatchPage,
});
