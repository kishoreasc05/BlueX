import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MOCK_PROVIDERS } from "@/customer/mockData";
import { parseQueryIntent } from "../engine/intent-parser";
import { rankProviders } from "../engine/matchmaker";
import { MatchResult } from "../types/ai-search.types";

/**
 * Custom React Hook for AI Matchmaker with Supabase DB provider fetching + fallback merging
 */
export function useAiMatchmaker(
  initialQuery: string = "Need top rated cleaning service in Zurich",
) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  // Fetch real contractors from DB
  const { data: dbContractors, isLoading } = useQuery({
    queryKey: ["aiMatchmakerProviders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contractors")
        .select(
          `
          id, 
          name, 
          specialty, 
          hourly_rate, 
          notes,
          status,
          organization:organizations(
            reviews(rating),
            bookings(id, status)
          )
        `,
        )
        .eq("status", "active");

      if (error) throw error;
      return data || [];
    },
  });

  // Query profiles for real Cloudinary avatars
  const { data: allProfiles } = useQuery({
    queryKey: ["allProfilesAvatarsMatchmaker"],
    queryFn: async () => {
      const { data: profs } = await supabase.from("profiles").select("id, full_name, avatar_url");
      const { data: provs } = await supabase
        .from("provider_profiles")
        .select("user_id, company_name, company_logo_url");
      return { profiles: profs || [], providerProfiles: provs || [] };
    },
  });

  // Convert real DB providers & merge with MOCK_PROVIDERS
  const combinedProviders = Array.from(
    new Map(
      [
        ...Object.values(MOCK_PROVIDERS),
        ...(dbContractors || []).map((c: any) => {
          const reviews = c.organization?.reviews || [];
          const bookings = c.organization?.bookings || [];
          const rating =
            reviews.length > 0
              ? Number(
                  (
                    reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
                  ).toFixed(1),
                )
              : 4.9;
          const jobsCompleted = bookings.filter((b: any) => b.status === "completed").length;

          const matchedProfile = (allProfiles?.profiles || []).find(
            (prof: any) =>
              prof.full_name &&
              c.name &&
              (prof.full_name.toLowerCase().includes(c.name.toLowerCase()) ||
                c.name.toLowerCase().includes(prof.full_name.toLowerCase())),
          );
          const matchedProvProfile = (allProfiles?.providerProfiles || []).find(
            (prov: any) =>
              prov.company_name &&
              c.name &&
              (prov.company_name.toLowerCase().includes(c.name.toLowerCase()) ||
                c.name.toLowerCase().includes(prov.company_name.toLowerCase())),
          );
          const avatarUrl =
            matchedProfile?.avatar_url || matchedProvProfile?.company_logo_url || "";

          return {
            id: c.id,
            name: c.name,
            type:
              c.name.toLowerCase().includes("gmbh") || c.name.toLowerCase().includes("ag")
                ? "company"
                : "private",
            specialty: (c.specialty || "cleaner").toLowerCase(),
            specialtyLabel: c.specialty || "Contractor",
            rating,
            reviewsCount: reviews.length || 15,
            hourlyRate: Number(c.hourly_rate || 85),
            location: "Zurich, Switzerland",
            memberSince: "Jan 2023",
            minBooking: "2 hours",
            responseTime: "30 mins",
            completionRate: "98%",
            jobsCompleted: jobsCompleted || 24,
            languages: "DE, EN",
            avatar: avatarUrl,
            about: c.notes || "Professional blue-collar service provider.",
            services: [c.specialty || "General Contractor Services"],
            reviews: [],
            faqs: [],
          };
        }),
      ].map((item) => [item.id, item]),
    ).values(),
  );

  const parsedIntent = parseQueryIntent(searchQuery);
  const matchedResults: MatchResult[] = rankProviders(combinedProviders, parsedIntent);

  return {
    searchQuery,
    setSearchQuery,
    parsedIntent,
    matchedResults,
    isLoading,
  };
}
