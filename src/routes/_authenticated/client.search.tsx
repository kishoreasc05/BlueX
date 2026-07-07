import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { SearchPage } from "@/customer/pages/search";

const searchSchema = z.object({
  q: z.string().optional(),
});

export const Route = createFileRoute("/_authenticated/client/search")({
  validateSearch: (search) => searchSchema.parse(search),
  component: SearchPage,
});
