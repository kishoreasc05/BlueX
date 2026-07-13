import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams, useNavigate, Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Star,
  Clock,
  CheckCircle2,
  Languages,
  Briefcase,
  ShieldCheck,
  ChevronLeft,
  Calendar,
  MessageSquare,
  ThumbsUp,
  Building,
  User,
  Scale,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOCK_PROVIDERS, MockProvider } from "@/customer/mockData";

export function ProviderDetailsPage() {
  const { id } = useParams({ from: "/_authenticated/client/providers/$id" } as any);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("about");
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiryText, setInquiryText] = useState("");

  const sendInquiry = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("You must be logged in to message a provider.");
      if (!inquiryText.trim()) throw new Error("Please enter a message.");

      // Create a placeholder booking to establish the message thread
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);

      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .insert({
          client_id: user.id,
          provider_id: dbContractor.organization_id,
          scheduled_at: tomorrow.toISOString(),
          duration_hours: 2,
          total_price: Number(dbContractor.hourly_rate || 90) * 2,
          notes: `Initial Inquiry: ${inquiryText}`,
          status: "pending",
        })
        .select("id")
        .single();

      if (bookingError) throw bookingError;

      const { error: msgError } = await supabase.from("messages").insert({
        sender_id: user.id,
        receiver_id: dbContractor.id,
        booking_id: booking.id,
        content: inquiryText.trim(),
      });

      if (msgError) throw msgError;
    },
    onSuccess: () => {
      toast.success("Inquiry sent! Redirecting to chat...");
      setInquiryOpen(false);
      setInquiryText("");
      navigate({ to: "/client/messages" });
    },
    onError: (e: any) => {
      toast.error(e.message || "Failed to send message.");
    },
  });

  // Fetch from Supabase if not a mock ID
  const isMock = id in MOCK_PROVIDERS;
  const { data: dbContractor, isLoading } = useQuery({
    queryKey: ["contractorDetails", id],
    enabled: !isMock && !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contractors")
        .select(
          `
          *,
          organization:organizations(
            id,
            reviews(rating, comment, created_at, client:profiles(full_name)),
            bookings(id, status)
          )
        `,
        )
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as any;
    },
  });

  const provider: MockProvider | null = isMock
    ? MOCK_PROVIDERS[id]
    : dbContractor
      ? {
          id: dbContractor.id,
          name: dbContractor.name,
          type:
            dbContractor.name.toLowerCase().includes("gmbh") ||
            dbContractor.name.toLowerCase().includes("ag") ||
            dbContractor.name.toLowerCase().includes("company")
              ? ("company" as const)
              : ("private" as const),
          rating:
            dbContractor.organization?.reviews && dbContractor.organization.reviews.length > 0
              ? Number(
                  (
                    dbContractor.organization.reviews.reduce(
                      (sum: number, r: any) => sum + r.rating,
                      0,
                    ) / dbContractor.organization.reviews.length
                  ).toFixed(1),
                )
              : null,
          reviewsCount: dbContractor.organization?.reviews?.length || 0,
          specialty: (dbContractor.specialty || "").toLowerCase(),
          specialtyLabel: dbContractor.specialty || "General Contractor",
          location: "Zurich, Switzerland",
          memberSince: new Date(dbContractor.created_at).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          }),
          responseTime: null, // Don't show dummy mockup response time!
          completionRate:
            dbContractor.organization?.bookings && dbContractor.organization.bookings.length > 0
              ? `${Math.round(
                  (dbContractor.organization.bookings.filter((b: any) => b.status === "completed")
                    .length /
                    dbContractor.organization.bookings.length) *
                    100,
                )}%`
              : null,
          jobsCompleted:
            dbContractor.organization?.bookings?.filter((b: any) => b.status === "completed")
              .length || 0,
          languages: "DE, EN",
          hourlyRate: Number(dbContractor.hourly_rate || 90),
          minBooking: "2 hours",
          avatar: `https://i.pravatar.cc/400?u=${dbContractor.name.replace(/\s+/g, "").toLowerCase()}`,
          about:
            dbContractor.notes ||
            "Experienced professional dedicated to quality craftsmanship and customer satisfaction in Switzerland.",
          services: [dbContractor.specialty || "General Service"],
          reviews: (dbContractor.organization?.reviews || []).map((r: any, idx: number) => ({
            id: idx + 1,
            author: r.client?.full_name || "Client",
            rating: r.rating,
            date: new Date(r.created_at).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            }),
            text: r.comment || "No comment left.",
          })),
          faqs: [
            {
              q: "What are your payment terms?",
              a: "All billing goes securely through BlueX using Stripe Connect. Payments are released upon task completion.",
            },
          ],
          vatNumber: undefined,
          uidNumber: undefined,
          registrationOffice: undefined,
          insuranceCoverage: undefined,
          ahvStatus: undefined,
          uvgStatus: undefined,
          complianceChecked: undefined,
        }
      : null;

  if (isLoading) {
    return <div className="py-20 text-center text-slate-500 font-medium">Loading details...</div>;
  }

  if (!provider) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Provider not found</h2>
        <Button
          onClick={() => navigate({ to: "/client/search" })}
          className="bg-blue-600 text-white rounded-xl"
        >
          Back to Search
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 max-w-[1400px] mx-auto text-slate-800">
      {/* ── BACK BUTTON ── */}
      <div>
        <button
          onClick={() => window.history.back()}
          className="text-xs font-semibold text-slate-400 hover:text-slate-600 flex items-center gap-1 cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to results
        </button>
      </div>

      {/* ── GRID LAYOUT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* LEFT COLUMN: Main Info */}
        <div className="space-y-6">
          {/* Header section with photo */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row gap-6">
            <div className="h-36 w-36 md:h-44 md:w-44 rounded-2xl overflow-hidden bg-slate-100 shrink-0 mx-auto md:mx-0">
              <img
                src={provider.avatar}
                alt={provider.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex-1 space-y-3 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
                  <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                    {provider.name}
                  </h1>
                  <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-none text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                    Top Match
                  </Badge>
                  {provider.type === "company" ? (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100/50 uppercase tracking-wider">
                      <Building className="h-2.5 w-2.5" /> Company
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100/50 uppercase tracking-wider">
                      <User className="h-2.5 w-2.5" /> Private
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm font-semibold text-slate-500">{provider.specialty}</p>

              <div className="flex items-center justify-center md:justify-start gap-1.5">
                {provider.rating ? (
                  <>
                    <div className="flex items-center gap-0.5 text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-bold text-slate-800">{provider.rating}</span>
                    </div>
                    <span className="text-sm text-slate-400">
                      ({provider.reviewsCount} reviews)
                    </span>
                  </>
                ) : (
                  <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 border border-slate-200 rounded-md">
                    New Provider
                  </span>
                )}
                <span className="text-slate-300">|</span>
                <span className="text-xs text-slate-400 font-semibold">{provider.location}</span>
                <span className="text-slate-300">|</span>
                <span className="text-xs text-slate-400">Member since {provider.memberSince}</span>
              </div>

              {/* KPI Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-slate-100">
                {provider.responseTime && (
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Response time</div>
                    <div className="text-sm font-bold text-slate-800 flex items-center gap-1 mt-0.5 justify-center md:justify-start">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      {provider.responseTime}
                    </div>
                  </div>
                )}
                {provider.completionRate && (
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Completion rate</div>
                    <div className="text-sm font-bold text-slate-800 flex items-center gap-1 mt-0.5 justify-center md:justify-start">
                      <CheckCircle2 className="h-3.5 w-3.5 text-slate-400" />
                      {provider.completionRate}
                    </div>
                  </div>
                )}
                {provider.jobsCompleted !== undefined && provider.jobsCompleted > 0 && (
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Jobs completed</div>
                    <div className="text-sm font-bold text-slate-800 flex items-center gap-1 mt-0.5 justify-center md:justify-start">
                      <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                      {provider.jobsCompleted}
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-xs text-slate-400 font-medium">Languages</div>
                  <div className="text-sm font-bold text-slate-800 flex items-center gap-1 mt-0.5 justify-center md:justify-start">
                    <Languages className="h-3.5 w-3.5 text-slate-400" />
                    {provider.languages || "DE, EN"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Tabs */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="w-full bg-slate-50 border-b border-slate-200 rounded-none justify-start px-6 h-12 gap-6">
                <TabsTrigger
                  value="about"
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none h-full px-0 font-bold text-xs text-slate-500 data-[state=active]:text-slate-900 border-b-2 border-transparent"
                >
                  About
                </TabsTrigger>
                <TabsTrigger
                  value="services"
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none h-full px-0 font-bold text-xs text-slate-500 data-[state=active]:text-slate-900 border-b-2 border-transparent"
                >
                  Services
                </TabsTrigger>
                <TabsTrigger
                  value="compliance"
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none h-full px-0 font-bold text-xs text-slate-500 data-[state=active]:text-slate-900 border-b-2 border-transparent"
                >
                  Compliance & Trust
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none h-full px-0 font-bold text-xs text-slate-500 data-[state=active]:text-slate-900 border-b-2 border-transparent"
                >
                  Reviews ({provider.reviewsCount})
                </TabsTrigger>
                <TabsTrigger
                  value="faqs"
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none h-full px-0 font-bold text-xs text-slate-500 data-[state=active]:text-slate-900 border-b-2 border-transparent"
                >
                  FAQs
                </TabsTrigger>
              </TabsList>

              <div className="p-6">
                <TabsContent value="about" className="space-y-5 mt-0 outline-none">
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">About {provider.name}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{provider.about}</p>
                  </div>

                  {/* Trust Highlights */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                    <div className="flex gap-2">
                      <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">Background Checked</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Vetted Swiss professional
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          Satisfaction Guaranteed
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Committed to highest quality
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <ThumbsUp className="h-5 w-5 text-violet-600 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          Eco-Friendly Products
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Safe for homes and pets
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Swiss Compliance Tab details */}
                <TabsContent value="compliance" className="space-y-5 mt-0 outline-none">
                  {provider.type === "company" ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                        <Building className="h-5 w-5 text-blue-600" />
                        <h3 className="font-bold text-slate-900">Swiss Company Registration</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            VAT Number
                          </span>
                          <p className="text-xs font-semibold text-slate-700">
                            {provider.vatNumber || "CHE-482.931.045 MWST"}
                          </p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            UID Number
                          </span>
                          <p className="text-xs font-semibold text-slate-700">
                            {provider.uidNumber || "CHE-482.931.045"}
                          </p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            Commercial Registry Office
                          </span>
                          <p className="text-xs font-semibold text-slate-700">
                            {provider.registrationOffice || "Zurich Cantonal Registry"}
                          </p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            Public Liability Insurance
                          </span>
                          <p className="text-xs font-semibold text-slate-750 text-emerald-600 font-medium">
                            {provider.insuranceCoverage || "CHF 5,000,000 Insured"}
                          </p>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-normal">
                        As a registered company, this provider handles payroll, social
                        contributions, and liability insurance for their workforce directly. BlueX
                        coordinates bookings, secure escrow payments, and provides PDF invoices for
                        all jobs.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                        <Scale className="h-5 w-5 text-emerald-600" />
                        <h3 className="font-bold text-slate-900">
                          BlueX Legal Employment Automation
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            AHV/IV/EO/ALV Social Contributions
                          </span>
                          <p className="text-xs font-semibold text-slate-750 flex items-center gap-1.5 text-emerald-600">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Automated
                            Processing
                          </p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            Accident Insurance (UVG)
                          </span>
                          <p className="text-xs font-semibold text-slate-750 flex items-center gap-1.5 text-emerald-600">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Vetted & Active
                            via BlueX
                          </p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            Statutory Withholding Taxes
                          </span>
                          <p className="text-xs font-semibold text-slate-700">
                            Calculated & Transmitted
                          </p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            Compliance Guarantee
                          </span>
                          <p className="text-xs font-semibold text-slate-700 text-blue-600">
                            100% Swiss Legal Compliance
                          </p>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-normal font-normal">
                        **Compliant Employment**: When booking private household help in
                        Switzerland, you are legally an employer. BlueX automatically registers this
                        provider, processes statutory pension contributions (AHV), withholds taxes,
                        and provides accident insurance (UVG) so you remain fully legally compliant
                        without manual paperwork.
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="services" className="space-y-4 mt-0 outline-none">
                  <h3 className="font-bold text-slate-900 mb-2">Offered Services</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {provider.services.map((svc: string) => (
                      <div
                        key={svc}
                        className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-100 bg-slate-50/50"
                      >
                        <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                        <span className="text-xs font-semibold text-slate-700">{svc}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="space-y-4 mt-0 outline-none">
                  <h3 className="font-bold text-slate-900 mb-2">Customer Feedback</h3>
                  <div className="space-y-4 divide-y divide-slate-100">
                    {provider.reviews.map((rev: any) => (
                      <div key={rev.id} className="pt-4 first:pt-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800">{rev.author}</span>
                          <span className="text-[10px] text-slate-400">{rev.date}</span>
                        </div>
                        <div className="flex gap-0.5 text-amber-500 my-1">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-current" />
                          ))}
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed mt-1.5">{rev.text}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="faqs" className="space-y-4 mt-0 outline-none">
                  <h3 className="font-bold text-slate-900 mb-2">Frequently Asked Questions</h3>
                  <div className="space-y-4">
                    {provider.faqs.map((faq: any, i: number) => (
                      <div key={i} className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-800">Q: {faq.q}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">A: {faq.a}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>

        {/* RIGHT COLUMN: Booking Card */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900">
                  CHF {provider.hourlyRate}
                </span>
                <span className="text-xs text-slate-400 font-semibold uppercase">/ hour</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium mt-1">
                Minimum booking: {provider.minBooking}
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => navigate({ to: `/client/book/${id}` as any })}
                className="w-full h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/10 cursor-pointer"
              >
                Book Now
              </Button>
              <Button
                variant="outline"
                onClick={() => setInquiryOpen(true)}
                className="w-full h-10 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs cursor-pointer"
              >
                <MessageSquare className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                Message
              </Button>
            </div>

            <div className="text-[10px] text-slate-400 leading-relaxed text-center">
              All bookings are protected under the BlueX Satisfaction Guarantee and secure escrow
              payments.
            </div>
          </div>
        </div>
      </div>

      <Dialog open={inquiryOpen} onOpenChange={setInquiryOpen}>
        <DialogContent className="max-w-md p-6 rounded-2xl border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-base font-black text-slate-900">
              Message {provider.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400 font-semibold mt-0.5">
              Send an inquiry to initiate a chat with the provider.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-3">
            <div className="space-y-1.5">
              <label htmlFor="inquiryText" className="text-xs font-bold text-slate-700">
                Your Message
              </label>
              <Textarea
                id="inquiryText"
                placeholder="Hi! I have some questions about your service..."
                value={inquiryText}
                onChange={(e) => setInquiryText(e.target.value)}
                rows={4}
                className="rounded-xl border-slate-200 text-xs"
              />
            </div>
            <div className="flex justify-end gap-2.5 pt-2">
              <Button
                variant="outline"
                onClick={() => setInquiryOpen(false)}
                className="h-9 px-4 rounded-xl border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={() => sendInquiry.mutate()}
                disabled={sendInquiry.isPending || !inquiryText.trim()}
                className="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer"
              >
                {sendInquiry.isPending ? "Sending..." : "Send Message"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
