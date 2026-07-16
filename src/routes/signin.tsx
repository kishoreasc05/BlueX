import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck,
  Star,
  Calendar,
  MessageSquare,
  ArrowLeft,
  User,
  Building,
  UserCheck,
  ArrowRight,
} from "lucide-react";

const searchSchema = z.object({
  mode: z.enum(["signin", "signup"]).optional(),
  role: z.enum(["client", "provider"]).optional(),
});

export const Route = createFileRoute("/signin")({
  validateSearch: (s) => searchSchema.parse(s),
  component: AuthPage,
});

function AuthPage() {
  const { mode: initial, role: initialRole } = Route.useSearch();
  const [mode, setMode] = useState<"signin" | "signup">(initial ?? "signin");
  const [role, setRole] = useState<"client" | "provider">(initialRole ?? "client");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Basic Account States (Shared)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  // Signup Step management
  const [signupStep, setSignupStep] = useState<1 | 2>(1);

  // Role-Specific Profile States (Customer / Step 2)
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("en");

  // Role-Specific Profile States (Provider / Step 2)
  const [hourlyRate, setHourlyRate] = useState("90");
  const [bio, setBio] = useState("");
  const [languages, setLanguages] = useState("DE, EN");
  const [skills, setSkills] = useState("");

  // Company Specific States
  const [providerType, setProviderType] = useState<"individual" | "company">("individual");
  const [companyName, setCompanyName] = useState("");
  const [businessRegistrationNumber, setBusinessRegistrationNumber] = useState("");
  const [vatNumber, setVatNumber] = useState("");
  const [legalRepresentative, setLegalRepresentative] = useState("");
  const [website, setWebsite] = useState("");
  const [country, setCountry] = useState("Switzerland");

  useEffect(() => {
    if (user) navigate({ to: "/dashboard" });
  }, [user, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (mode === "signup" && signupStep === 1) {
      setSignupStep(2);
      return;
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        const metadata: Record<string, any> = {
          full_name: role === "provider" && providerType === "company" ? companyName : fullName,
          portal_role: role,
          phone,
          address,
          city,
        };

        if (role === "client") {
          metadata.postal_code = postalCode;
          metadata.preferred_language = preferredLanguage;
        } else {
          metadata.provider_type = providerType;
          if (providerType === "company") {
            metadata.company_name = companyName;
            metadata.vat_number = vatNumber;
            metadata.business_registration_number = businessRegistrationNumber;
            metadata.legal_representative = legalRepresentative;
            metadata.website = website;
            metadata.country = country;
          } else {
            metadata.hourly_rate = hourlyRate;
            metadata.bio = bio;
            metadata.languages = languages;
            metadata.skills = skills
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);
          }
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + "/dashboard",
            data: metadata,
          },
        });
        if (error) throw error;
        toast.success("Account created. Welcome to BlueX.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#020617] flex flex-col items-center justify-center p-4 md:p-6 relative overflow-y-auto font-sans text-white">
      {/* Glowing background gradient highlights */}
      <div className="absolute top-[10%] left-[20%] w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] right-[20%] w-[400px] h-[400px] bg-sky-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Back to website button */}
      <Link
        to="/"
        className="absolute top-6 left-6 z-50 flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors text-xs font-bold"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to website
      </Link>

      <div className="w-full max-w-[450px] relative z-10 my-8">
        {/* Logo and Brand Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <Link
            to="/"
            className="flex items-center gap-2 text-white font-extrabold text-2xl tracking-tight mb-1 group"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-white text-base font-black shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
              X
            </span>
            BlueX<span className="text-[#38bdf8] font-bold">.ch</span>
          </Link>
        </div>

        {/* Compact Center Form Card */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-lg md:text-xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
              {mode === "signup"
                ? `Create your ${role === "client" ? "Customer" : providerType === "company" ? "Company" : "Provider"} account`
                : "Login"}
              {mode === "signup" && (
                <span className="text-[9px] font-black text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20 uppercase tracking-wide">
                  Step {signupStep} of 2
                </span>
              )}
            </h2>
            <p className="text-zinc-405 text-zinc-405/80 text-zinc-400 text-xs font-medium">
              {mode === "signup"
                ? "Enter your details below to get started."
                : "Enter your credentials to access your account."}
            </p>
          </div>

          {/* Portal Role selector (only for Signup Step 1) */}
          {mode === "signup" && signupStep === 1 && (
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-zinc-300">Signing up as a...</Label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setRole("client");
                    setProviderType("individual");
                  }}
                  className={`h-9 text-[10px] rounded-xl font-bold border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    role === "client"
                      ? "bg-blue-600/20 border-blue-500 text-sky-400 shadow-lg shadow-blue-500/10"
                      : "bg-slate-900/40 border-slate-800 hover:bg-slate-850 text-zinc-450 text-zinc-400"
                  }`}
                >
                  <User className="w-3.5 h-3.5 shrink-0" />
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRole("provider");
                    setProviderType("individual");
                  }}
                  className={`h-9 text-[10px] rounded-xl font-bold border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    role === "provider" && providerType === "individual"
                      ? "bg-blue-600/20 border-blue-500 text-sky-400 shadow-lg shadow-blue-500/10"
                      : "bg-slate-900/40 border-slate-800 hover:bg-slate-850 text-zinc-450 text-zinc-400"
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5 shrink-0" />
                  Individual
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRole("provider");
                    setProviderType("company");
                  }}
                  className={`h-9 text-[10px] rounded-xl font-bold border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    role === "provider" && providerType === "company"
                      ? "bg-blue-600/20 border-blue-500 text-sky-400 shadow-lg shadow-blue-500/10"
                      : "bg-slate-900/40 border-slate-800 hover:bg-slate-850 text-zinc-450 text-zinc-400"
                  }`}
                >
                  <Building className="w-3.5 h-3.5 shrink-0" />
                  Company
                </button>
              </div>
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            {/* ── MODE: SIGN IN ── */}
            {mode === "signin" && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-bold text-zinc-300">
                    Email or Phone
                  </Label>
                  <Input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="enter your email or phone"
                    className="h-10 rounded-xl border-slate-800 bg-slate-900/50 text-white placeholder-slate-500 focus-visible:ring-sky-500 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <Label htmlFor="password" className="text-xs font-bold text-zinc-300">
                      Password
                    </Label>
                    <a
                      href="#"
                      className="text-[10px] font-bold text-sky-400 hover:text-sky-350 transition-colors"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter your password"
                      className="h-10 rounded-xl border-slate-800 bg-slate-900/50 text-white placeholder-slate-500 focus-visible:ring-sky-500 text-xs pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-800 bg-slate-900 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <Label
                    htmlFor="remember"
                    className="text-xs font-semibold text-zinc-400 cursor-pointer select-none"
                  >
                    Remember me
                  </Label>
                </div>
              </>
            )}

            {/* ── MODE: SIGN UP (STEP 1) ── */}
            {mode === "signup" && signupStep === 1 && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-bold text-zinc-300">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Jane Doe"
                    className="h-10 rounded-xl border-slate-800 bg-slate-900/50 text-white placeholder-slate-500 focus-visible:ring-sky-500 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-bold text-zinc-300">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="jane@example.com"
                    className="h-10 rounded-xl border-slate-800 bg-slate-900/50 text-white placeholder-slate-500 focus-visible:ring-sky-500 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-bold text-zinc-300">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="+41 79 123 45 67"
                    className="h-10 rounded-xl border-slate-800 bg-slate-900/50 text-white placeholder-slate-500 focus-visible:ring-sky-500 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-xs font-bold text-zinc-300">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Choose a secure password (min. 6 chars)"
                      className="h-10 rounded-xl border-slate-800 bg-slate-900/50 text-white placeholder-slate-500 focus-visible:ring-sky-500 text-xs pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* ── MODE: SIGN UP (STEP 2 - CUSTOMER) ── */}
            {mode === "signup" && signupStep === 2 && role === "client" && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="address" className="text-xs font-bold text-zinc-300">
                    Street Address
                  </Label>
                  <Input
                    id="address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    placeholder="Bahnhofstrasse 1"
                    className="h-10 rounded-xl border-slate-800 bg-slate-900/50 text-white placeholder-slate-500 focus-visible:ring-sky-500 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="city" className="text-xs font-bold text-zinc-300">
                      City
                    </Label>
                    <Input
                      id="city"
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      placeholder="Zurich"
                      className="h-10 rounded-xl border-slate-800 bg-slate-900/50 text-white placeholder-slate-500 focus-visible:ring-sky-500 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="postal" className="text-xs font-bold text-zinc-300">
                      Postal Code
                    </Label>
                    <Input
                      id="postal"
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      required
                      placeholder="8001"
                      className="h-10 rounded-xl border-slate-800 bg-slate-900/50 text-white placeholder-slate-500 focus-visible:ring-sky-500 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="lang" className="text-xs font-bold text-zinc-300">
                    Preferred Language
                  </Label>
                  <select
                    id="lang"
                    value={preferredLanguage}
                    onChange={(e) => setPreferredLanguage(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-800 bg-slate-900 text-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="en" className="bg-slate-950 text-white">
                      English
                    </option>
                    <option value="de" className="bg-slate-950 text-white">
                      Deutsch (German)
                    </option>
                    <option value="fr" className="bg-slate-950 text-white">
                      Français (French)
                    </option>
                    <option value="it" className="bg-slate-950 text-white">
                      Italiano (Italian)
                    </option>
                  </select>
                </div>
              </>
            )}

            {/* ── MODE: SIGN UP (STEP 2 - PROVIDER INDIVIDUAL) ── */}
            {mode === "signup" &&
              signupStep === 2 &&
              role === "provider" &&
              providerType === "individual" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="city" className="text-xs font-bold text-zinc-300">
                        City (Operations Base)
                      </Label>
                      <Input
                        id="city"
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        placeholder="Zurich"
                        className="h-10 rounded-xl border-slate-800 bg-slate-900/50 text-white placeholder-slate-500 focus-visible:ring-sky-500 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="rate" className="text-xs font-bold text-zinc-300">
                        Hourly Rate (CHF/hr)
                      </Label>
                      <Input
                        id="rate"
                        type="number"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(e.target.value)}
                        required
                        placeholder="90"
                        className="h-10 rounded-xl border-slate-800 bg-slate-900/50 text-white placeholder-slate-500 focus-visible:ring-sky-500 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="languages" className="text-xs font-bold text-zinc-300">
                      Spoken Languages (comma separated)
                    </Label>
                    <Input
                      id="languages"
                      type="text"
                      value={languages}
                      onChange={(e) => setLanguages(e.target.value)}
                      required
                      placeholder="DE, EN, FR"
                      className="h-10 rounded-xl border-slate-800 bg-slate-900/50 text-white placeholder-slate-500 focus-visible:ring-sky-500 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="skills" className="text-xs font-bold text-zinc-300">
                      Skills/Specialties (comma separated)
                    </Label>
                    <Input
                      id="skills"
                      type="text"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      required
                      placeholder="Cleaning, Ironing, Plumbing, Painting"
                      className="h-10 rounded-xl border-slate-800 bg-slate-900/50 text-white placeholder-slate-500 focus-visible:ring-sky-500 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="bio" className="text-xs font-bold text-zinc-300">
                      Professional Bio / Description
                    </Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      required
                      placeholder="Tell customers about your experience and qualifications..."
                      className="min-h-[70px] rounded-xl border-slate-800 bg-slate-900/50 text-white placeholder-slate-500 text-xs"
                    />
                  </div>
                </>
              )}

            {/* ── MODE: SIGN UP (STEP 2 - PROVIDER COMPANY) ── */}
            {mode === "signup" &&
              signupStep === 2 &&
              role === "provider" &&
              providerType === "company" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="companyName" className="text-xs font-bold text-zinc-300">
                        Company Name
                      </Label>
                      <Input
                        id="companyName"
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                        placeholder="Swiss Cleaners AG"
                        className="h-10 rounded-xl border-slate-800 bg-slate-900/50 text-white placeholder-slate-500 focus-visible:ring-sky-500 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="legalRep" className="text-xs font-bold text-zinc-300">
                        Legal Representative
                      </Label>
                      <Input
                        id="legalRep"
                        type="text"
                        value={legalRepresentative}
                        onChange={(e) => setLegalRepresentative(e.target.value)}
                        required
                        placeholder="Marc Meier"
                        className="h-10 rounded-xl border-slate-800 bg-slate-900/50 text-white placeholder-slate-500 focus-visible:ring-sky-500 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="regNumber" className="text-xs font-bold text-zinc-300">
                        Registration Number
                      </Label>
                      <Input
                        id="regNumber"
                        type="text"
                        value={businessRegistrationNumber}
                        onChange={(e) => setBusinessRegistrationNumber(e.target.value)}
                        required
                        placeholder="CHE-123.456.789 MWST"
                        className="h-10 rounded-xl border-slate-800 bg-slate-900/50 text-white placeholder-slate-500 focus-visible:ring-sky-500 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="vatNumber" className="text-xs font-bold text-zinc-300">
                        VAT Number
                      </Label>
                      <Input
                        id="vatNumber"
                        type="text"
                        value={vatNumber}
                        onChange={(e) => setVatNumber(e.target.value)}
                        required
                        placeholder="CHE-123.456.789 VAT"
                        className="h-10 rounded-xl border-slate-800 bg-slate-900/50 text-white placeholder-slate-500 focus-visible:ring-sky-500 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="companyAddress" className="text-xs font-bold text-zinc-300">
                      Company Address
                    </Label>
                    <Input
                      id="companyAddress"
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      placeholder="Bahnhofstrasse 100"
                      className="h-10 rounded-xl border-slate-800 bg-slate-900/50 text-white placeholder-slate-500 focus-visible:ring-sky-500 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="companyCity" className="text-xs font-bold text-zinc-300">
                        City
                      </Label>
                      <Input
                        id="companyCity"
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        placeholder="Zurich"
                        className="h-10 rounded-xl border-slate-800 bg-slate-900/50 text-white placeholder-slate-500 focus-visible:ring-sky-500 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="companyPostal" className="text-xs font-bold text-zinc-300">
                        Postal Code
                      </Label>
                      <Input
                        id="companyPostal"
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        required
                        placeholder="8001"
                        className="h-10 rounded-xl border-slate-800 bg-slate-900/50 text-white placeholder-slate-500 focus-visible:ring-sky-500 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="companyCountry" className="text-xs font-bold text-zinc-300">
                        Country
                      </Label>
                      <Input
                        id="companyCountry"
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                        placeholder="Switzerland"
                        className="h-10 rounded-xl border-slate-800 bg-slate-900/50 text-white placeholder-slate-500 focus-visible:ring-sky-500 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="website" className="text-xs font-bold text-zinc-300">
                      Website (Optional)
                    </Label>
                    <Input
                      id="website"
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://example.com"
                      className="h-10 rounded-xl border-slate-800 bg-slate-900/50 text-white placeholder-slate-500 focus-visible:ring-sky-500 text-xs"
                    />
                  </div>
                </>
              )}

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              {mode === "signup" && signupStep === 2 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSignupStep(1)}
                  className="flex-1 h-10 border-slate-800 bg-slate-900 rounded-xl text-xs font-bold text-zinc-300 hover:bg-slate-850 hover:text-white"
                >
                  Back
                </Button>
              )}
              <Button
                type="submit"
                className="flex-1 h-10 bg-gradient-to-r from-blue-600 to-[#0284c7] hover:from-blue-700 hover:to-[#0369a1] text-white hover:shadow-blue-500/20 transition-all rounded-xl text-xs font-black shadow-md shadow-blue-600/10 cursor-pointer flex items-center justify-center gap-1.5"
                disabled={loading}
              >
                {loading ? (
                  "Please wait..."
                ) : mode === "signup" ? (
                  signupStep === 1 ? (
                    <>
                      Continue
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    "Sign Up"
                  )
                ) : (
                  "Login"
                )}
              </Button>
            </div>
          </form>

          {/* Bottom Register/Login toggle link */}
          <div className="text-center text-xs text-zinc-400 font-semibold pt-2">
            {mode === "signup" ? (
              <>
                Already have an account?{" "}
                <button
                  className="text-sky-400 hover:text-sky-350 font-bold transition-colors cursor-pointer bg-transparent border-0 p-0"
                  onClick={() => {
                    setMode("signin");
                    setSignupStep(1);
                  }}
                >
                  Login
                </button>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <button
                  className="text-sky-400 hover:text-sky-350 font-bold transition-colors cursor-pointer bg-transparent border-0 p-0"
                  onClick={() => {
                    setMode("signup");
                    setSignupStep(1);
                  }}
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
