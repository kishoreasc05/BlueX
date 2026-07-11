import { createFileRoute } from "@tanstack/react-router";
import { ClientFavoritesPage } from "@/customer/pages/favorites";

export const Route = createFileRoute("/_authenticated/client/favorites")({
  component: ClientFavoritesPage,
});
