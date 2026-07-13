import { createFileRoute } from "@tanstack/react-router";
import { CustomerProfilePage } from "../../customer/pages/profile";

export const Route = createFileRoute("/_authenticated/client/profile")({
  component: CustomerProfilePage,
});
