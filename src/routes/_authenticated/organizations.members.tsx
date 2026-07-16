import { createFileRoute } from "@tanstack/react-router";
import { EmployeesPage } from "@/company provider/pages/employees";

export const Route = createFileRoute("/_authenticated/organizations/members")({
  component: Page,
});

function Page() {
  return <EmployeesPage />;
}
