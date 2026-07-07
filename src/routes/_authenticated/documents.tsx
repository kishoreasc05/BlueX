import { createFileRoute } from "@tanstack/react-router";
import { DocumentsPage } from "@/offering provider/pages/documents";

export const Route = createFileRoute("/_authenticated/documents")({
  component: DocumentsPage,
});
