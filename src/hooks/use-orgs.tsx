import { useEffect, useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";

const ACTIVE_ORG_KEY = "bluex.activeOrgId";

export type OrgMembership = {
  id: string;
  role: "owner" | "admin" | "member";
  organization: {
    id: string;
    name: string;
    slug: string;
    logo_url: string | null;
  };
};

export function useOrganizations() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["orgs", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<OrgMembership[]> => {
      const { data, error } = await supabase
        .from("organization_members")
        .select("id, role, organization:organizations(id, name, slug, logo_url)")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as OrgMembership[];
    },
  });
}

export function useActiveOrg() {
  const { data: orgs } = useOrganizations();
  const [activeId, setActiveIdState] = useState<string | null>(null);
  const qc = useQueryClient();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(ACTIVE_ORG_KEY);
    if (stored && orgs?.some((o) => o.organization.id === stored)) {
      setActiveIdState(stored);
    } else if (orgs && orgs.length > 0) {
      setActiveIdState(orgs[0].organization.id);
      localStorage.setItem(ACTIVE_ORG_KEY, orgs[0].organization.id);
    }
  }, [orgs]);

  const setActiveId = useCallback(
    (id: string) => {
      setActiveIdState(id);
      if (typeof window !== "undefined") localStorage.setItem(ACTIVE_ORG_KEY, id);
      qc.invalidateQueries();
    },
    [qc],
  );

  const active = orgs?.find((o) => o.organization.id === activeId) ?? null;
  return { activeId, active, setActiveId, orgs: orgs ?? [] };
}
