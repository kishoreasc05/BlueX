import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  ShieldAlert,
  User,
  ShieldCheck,
  Mail,
  Shield,
  Eye,
  Check,
  X,
  FileText,
  Briefcase,
  Landmark,
} from "lucide-react";
import { PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/kpi-card";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getRouteApi, useNavigate } from "@tanstack/react-router";

const routeApi = getRouteApi("/_authenticated/ops/users");

export function OpsUsersPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { role: searchRole, tab: searchTab } = routeApi.useSearch();

  const [activeTab, setActiveTab] = useState<"users" | "pending_freelancers" | "pending_companies">(
    searchTab === "pending_freelancers" || searchTab === "pending_companies" ? searchTab : "users",
  );

  useEffect(() => {
    if (searchTab === "pending_freelancers" || searchTab === "pending_companies") {
      setActiveTab(searchTab);
    } else {
      setActiveTab("users");
    }
  }, [searchTab]);

  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [docDialogOpen, setDocDialogOpen] = useState(false);

  // 1. Query all profiles (Users)
  const { data: users, isLoading: usersLoading } = useQuery({
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
          role,
          created_at,
          provider_profiles(provider_type)
        `,
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Filter users by role from search params
  const filteredUsers = (users || []).filter((u: any) => {
    if (!searchRole) return true;
    if (searchRole === "provider") {
      const isCompany = u.provider_profiles?.[0]?.provider_type === "company";
      return u.role === "provider" && !isCompany;
    }
    if (searchRole === "company") {
      const isCompany = u.provider_profiles?.[0]?.provider_type === "company";
      return u.role === "provider" && isCompany;
    }
    if (searchRole === "client") {
      return !u.role || u.role === "client";
    }
    return true;
  });

  // 2. Query pending provider profiles (both freelancers and companies)
  const {
    data: pendingProviders = [],
    isLoading: pendingLoading,
    refetch: refetchPending,
  } = useQuery({
    queryKey: ["pendingProvidersList"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("provider_profiles")
        .select(
          `
          user_id,
          skills,
          experience_years,
          hourly_rate,
          id_document_url,
          selfie_url,
          address_proof_url,
          verification_status,
          is_verified,
          provider_type,
          company_name,
          vat_number,
          business_registration_url,
          liability_insurance_url,
          business_registration_number,
          legal_representative,
          website,
          country,
          vat_certificate_url,
          company_logo_url,
          business_license_url,
          profile:profiles(id, full_name, email, created_at)
        `,
        )
        .eq("verification_status", "pending_approval");

      if (error) throw error;
      return data || [];
    },
  });

  // Filter pending lists locally
  const pendingFreelancers = pendingProviders.filter(
    (p) => (p.provider_type || "individual") === "individual",
  );
  const pendingCompanies = pendingProviders.filter((p) => p.provider_type === "company");

  // 3. Approve Mutation
  const approveMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from("provider_profiles")
        .update({ verification_status: "approved", is_verified: true })
        .eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Provider approved and verified!");
      queryClient.invalidateQueries({ queryKey: ["pendingProvidersList"] });
      queryClient.invalidateQueries({ queryKey: ["opsUsers"] });
      queryClient.invalidateQueries({ queryKey: ["opsDashboardData"] });
      refetchPending();
      setDocDialogOpen(false);
    },
    onError: (err) => {
      toast.error((err as Error).message);
    },
  });

  // 4. Reject Mutation
  const rejectMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from("provider_profiles")
        .update({ verification_status: "rejected", is_verified: false })
        .eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.error("Provider verification rejected.");
      queryClient.invalidateQueries({ queryKey: ["pendingProvidersList"] });
      queryClient.invalidateQueries({ queryKey: ["opsUsers"] });
      queryClient.invalidateQueries({ queryKey: ["opsDashboardData"] });
      refetchPending();
      setDocDialogOpen(false);
    },
    onError: (err) => {
      toast.error((err as Error).message);
    },
  });

  return (
    <div className="space-y-6 pb-12 max-w-[1400px] mx-auto text-slate-800">
      <PageHeader
        title="User Moderation & Access Control"
        description="Verify compliance, approve accounts, and manage platform roles for BlueX.ch users."
      />

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-5 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === "users"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          All Profiles
        </button>

        <button
          onClick={() => setActiveTab("pending_freelancers")}
          className={`px-5 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
            activeTab === "pending_freelancers"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Pending Freelancers
          {pendingFreelancers.length > 0 && (
            <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-1.5 py-0.5 rounded-full">
              {pendingFreelancers.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("pending_companies")}
          className={`px-5 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
            activeTab === "pending_companies"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Pending Companies
          {pendingCompanies.length > 0 && (
            <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-1.5 py-0.5 rounded-full">
              {pendingCompanies.length}
            </span>
          )}
        </button>
      </div>

      {searchRole && (
        <div className="bg-blue-50 border border-blue-100 text-blue-800 px-4 py-2.5 rounded-xl flex items-center justify-between text-xs font-semibold mx-1">
          <div className="flex items-center gap-1.5">
            <span>
              Filtering profiles by:{" "}
              <span className="capitalize font-black">
                {searchRole === "client" ? "customer" : searchRole}s
              </span>
            </span>
          </div>
          <button
            onClick={() => navigate({ to: "/ops/users" })}
            className="text-blue-600 hover:text-blue-800 underline cursor-pointer font-bold"
          >
            Clear Filter
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
        {activeTab === "users" ? (
          usersLoading ? (
            <p className="text-sm text-slate-500 text-center py-12">Loading user profiles...</p>
          ) : !filteredUsers || filteredUsers.length === 0 ? (
            <EmptyState
              title={searchRole ? "No matching profiles" : "No users registered"}
              description={
                searchRole
                  ? `There are currently no profiles matching the "${searchRole}" role.`
                  : "There are currently no registered users on the platform."
              }
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
                    Role
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider text-right">
                    Moderation
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u: any) => (
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
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          u.role === "operations"
                            ? "bg-purple-50 text-purple-700 border-purple-100"
                            : u.role === "provider"
                              ? "bg-blue-50 text-blue-700 border-blue-100"
                              : "bg-slate-50 text-slate-700 border-slate-100"
                        }`}
                      >
                        {u.role || "client"}
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
          )
        ) : activeTab === "pending_freelancers" ? (
          pendingLoading ? (
            <p className="text-sm text-slate-500 text-center py-12">
              Loading pending freelancers...
            </p>
          ) : pendingFreelancers.length === 0 ? (
            <div className="py-20 text-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-800">No pending freelancers</p>
              <p className="text-xs text-slate-400 font-semibold">
                All freelance provider credentials are audited.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                    Freelancer
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                    Skills
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                    Hourly Rate
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider text-right">
                    Audit
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingFreelancers.map((p: any) => (
                  <tr key={p.user_id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700">
                        {p.profile?.full_name ? p.profile.full_name[0].toUpperCase() : "P"}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">
                          {p.profile?.full_name || "Independent"}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">{p.profile?.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(p.skills || []).map((s: string) => (
                          <span
                            key={s}
                            className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-900">
                      CHF {Number(p.hourly_rate).toFixed(0)}/hr
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold uppercase tracking-wider border border-amber-100 animate-pulse">
                        Pending review
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        onClick={() => {
                          setSelectedProvider(p);
                          setDocDialogOpen(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs gap-1 cursor-pointer font-bold px-4 h-9"
                      >
                        <Eye className="w-3.5 h-3.5" /> Audit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        ) : pendingLoading ? (
          <p className="text-sm text-slate-500 text-center py-12">Loading pending companies...</p>
        ) : pendingCompanies.length === 0 ? (
          <div className="py-20 text-center space-y-2">
            <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-400">
              <Landmark className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-800">No pending companies</p>
            <p className="text-xs text-slate-400 font-semibold">
              All corporate registration applications are processed.
            </p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                  Company Name
                </th>
                <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                  VAT Number
                </th>
                <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                  Representative
                </th>
                <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider text-right">
                  Documents
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pendingCompanies.map((p: any) => (
                <tr key={p.user_id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {p.company_name || "Registered Enterprise"}
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-slate-600">
                    {p.vat_number || "CHE-XXX.XXX.XXX MWST"}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    <div className="font-semibold text-slate-850">{p.profile?.full_name}</div>
                    <div className="text-[10px] text-slate-400">{p.profile?.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider border border-blue-100 animate-pulse">
                      Awaiting VAT check
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      onClick={() => {
                        setSelectedProvider(p);
                        setDocDialogOpen(true);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs gap-1 cursor-pointer font-bold px-4 h-9"
                    >
                      <Eye className="w-3.5 h-3.5" /> Audit Company
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Document Inspection Dialog ── */}
      <Dialog open={docDialogOpen} onOpenChange={setDocDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-6 rounded-2xl">
          <DialogHeader className="pb-4 border-b border-slate-100">
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-slate-950">
              🛡️ Audit Provider Credentials
            </DialogTitle>
          </DialogHeader>

          {selectedProvider && (
            <div className="flex-1 min-h-0 overflow-y-auto py-5">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl text-xs">
                {selectedProvider.provider_type === "company" ? (
                  <>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Company Name
                      </span>
                      <p className="font-bold text-slate-900">{selectedProvider.company_name}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Legal Representative
                      </span>
                      <p className="font-bold text-slate-900">
                        {selectedProvider.legal_representative}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        VAT Number
                      </span>
                      <p className="font-bold text-slate-900">{selectedProvider.vat_number}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Registration Number
                      </span>
                      <p className="font-bold text-slate-900">
                        {selectedProvider.business_registration_number}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Website
                      </span>
                      <p className="font-bold text-slate-900">
                        {selectedProvider.website || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Country
                      </span>
                      <p className="font-bold text-slate-900">{selectedProvider.country}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Provider Name
                      </span>
                      <p className="font-bold text-slate-900">
                        {selectedProvider.profile?.full_name}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Experience
                      </span>
                      <p className="font-bold text-slate-900">
                        {selectedProvider.experience_years} years
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Document Previews */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b pb-1">
                  Uploaded verification documents
                </h4>

                {selectedProvider.provider_type === "company" ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Business Registration */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500">
                        Business Registration Certificate
                      </span>
                      <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 h-32 flex items-center justify-center">
                        {selectedProvider.business_registration_url ? (
                          <a
                            href={selectedProvider.business_registration_url}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full h-full block"
                          >
                            <img
                              src={selectedProvider.business_registration_url}
                              alt="Business Registration"
                              className="w-full h-full object-cover hover:scale-102 transition-transform"
                            />
                          </a>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-semibold">
                            Not uploaded
                          </span>
                        )}
                      </div>
                    </div>

                    {/* VAT Certificate */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500">VAT Certificate</span>
                      <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 h-32 flex items-center justify-center">
                        {selectedProvider.vat_certificate_url ? (
                          <a
                            href={selectedProvider.vat_certificate_url}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full h-full block"
                          >
                            <img
                              src={selectedProvider.vat_certificate_url}
                              alt="VAT Certificate"
                              className="w-full h-full object-cover hover:scale-102 transition-transform"
                            />
                          </a>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-semibold">
                            Not uploaded
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Liability Insurance */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500">
                        Liability Insurance Proof
                      </span>
                      <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 h-32 flex items-center justify-center">
                        {selectedProvider.liability_insurance_url ? (
                          <a
                            href={selectedProvider.liability_insurance_url}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full h-full block"
                          >
                            <img
                              src={selectedProvider.liability_insurance_url}
                              alt="Liability Insurance"
                              className="w-full h-full object-cover hover:scale-102 transition-transform"
                            />
                          </a>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-semibold">
                            Not uploaded
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Identity of Representative */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500">
                        Representative ID
                      </span>
                      <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 h-32 flex items-center justify-center">
                        {selectedProvider.id_document_url ? (
                          <a
                            href={selectedProvider.id_document_url}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full h-full block"
                          >
                            <img
                              src={selectedProvider.id_document_url}
                              alt="Representative ID"
                              className="w-full h-full object-cover hover:scale-102 transition-transform"
                            />
                          </a>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-semibold">
                            Not uploaded
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Company Logo */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500">Company Logo</span>
                      <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 h-32 flex items-center justify-center">
                        {selectedProvider.company_logo_url ? (
                          <a
                            href={selectedProvider.company_logo_url}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full h-full block"
                          >
                            <img
                              src={selectedProvider.company_logo_url}
                              alt="Company Logo"
                              className="w-full h-full object-cover hover:scale-102 transition-transform"
                            />
                          </a>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-semibold">
                            Not uploaded
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Business License */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500">
                        Business License (Optional)
                      </span>
                      <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 h-32 flex items-center justify-center">
                        {selectedProvider.business_license_url ? (
                          <a
                            href={selectedProvider.business_license_url}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full h-full block"
                          >
                            <img
                              src={selectedProvider.business_license_url}
                              alt="Business License"
                              className="w-full h-full object-cover hover:scale-102 transition-transform"
                            />
                          </a>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-semibold">
                            Not uploaded
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* ID */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500">Government ID</span>
                      <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 h-40 flex items-center justify-center">
                        {selectedProvider.id_document_url ? (
                          <a
                            href={selectedProvider.id_document_url}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full h-full block"
                          >
                            <img
                              src={selectedProvider.id_document_url}
                              alt="ID Document"
                              className="w-full h-full object-cover hover:scale-105 transition-transform"
                            />
                          </a>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-semibold">
                            Not uploaded
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Selfie */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500">
                        Verification Selfie
                      </span>
                      <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 h-40 flex items-center justify-center">
                        {selectedProvider.selfie_url ? (
                          <a
                            href={selectedProvider.selfie_url}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full h-full block"
                          >
                            <img
                              src={selectedProvider.selfie_url}
                              alt="Selfie"
                              className="w-full h-full object-cover hover:scale-105 transition-transform"
                            />
                          </a>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-semibold">
                            Not uploaded
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500">Proof of Address</span>
                      <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 h-40 flex items-center justify-center">
                        {selectedProvider.address_proof_url ? (
                          <a
                            href={selectedProvider.address_proof_url}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full h-full block"
                          >
                            <img
                              src={selectedProvider.address_proof_url}
                              alt="Address Proof"
                              className="w-full h-full object-cover hover:scale-105 transition-transform"
                            />
                          </a>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-semibold">
                            Not uploaded
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedProvider && (
            <div className="border-t border-slate-100 pt-4 flex justify-between gap-3 bg-white">
              <Button
                variant="outline"
                onClick={() => rejectMutation.mutate(selectedProvider.user_id)}
                disabled={rejectMutation.isPending || approveMutation.isPending}
                className="h-10 px-5 rounded-xl border-red-200 hover:bg-red-50 hover:text-red-700 text-xs font-bold text-red-650 flex items-center gap-1 cursor-pointer"
              >
                <X className="w-4 h-4" /> Reject Application
              </Button>
              <Button
                onClick={() => approveMutation.mutate(selectedProvider.user_id)}
                disabled={rejectMutation.isPending || approveMutation.isPending}
                className="h-10 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-4 h-4" /> Approve & Verify Account
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
