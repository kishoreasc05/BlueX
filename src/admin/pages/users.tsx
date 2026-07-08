import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ShieldAlert, User, ShieldCheck, Mail, Shield } from "lucide-react";
import { PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/kpi-card";

export function OpsUsersPage() {
  const { data: users, isLoading } = useQuery({
    queryKey: ["opsUsers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          `
          id, 
          full_name, 
          email, 
          avatar_url,
          created_at
        `,
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  return (
    <div className="space-y-6 pb-12 max-w-[1400px] mx-auto text-slate-800">
      <PageHeader
        title="User Moderation & Access Control"
        description="Verify compliance, approve accounts, and manage platform roles for BlueX.ch users."
      />

      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
        {isLoading ? (
          <p className="text-sm text-slate-500 text-center py-12">Loading user profiles...</p>
        ) : !users || users.length === 0 ? (
          <EmptyState
            title="No users registered"
            description="There are currently no registered users on the platform."
            icon={User}
          />
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                  Role Status
                </th>
                <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider text-right">
                  Moderation
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u: any) => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700">
                      {u.full_name ? u.full_name[0].toUpperCase() : "U"}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">
                        {u.full_name || "Anonymous User"}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">{u.id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {u.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {new Date(u.created_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified User
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl text-xs gap-1 border-slate-200 hover:bg-slate-50 hover:text-slate-800 cursor-pointer"
                    >
                      <Shield className="w-3.5 h-3.5 text-slate-400" /> Manage Roles
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
