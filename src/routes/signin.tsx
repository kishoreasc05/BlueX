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
          full_name: fullName,
          portal_role: role,
          phone,
          address,
          city,
        };

        if (role === "client") {
          metadata.postal_code = postalCode;
          metadata.preferred_language = preferredLanguage;
        } else {
          metadata.hourly_rate = hourlyRate;
          metadata.bio = bio;
          metadata.languages = languages;
          metadata.skills = skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
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
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
      {/* Back to website button */}
      <Link
        to="/"
        className="absolute top-6 left-6 z-50 flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors text-xs font-bold"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to website
      </Link>

      <div className="w-full max-w-[1100px] grid md:grid-cols-[400px_1fr] bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xl min-h-[620px]">
        {/* Left Side: Deep Blue Brand Panel */}
        <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white p-8 md:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle circle shapes */}
          <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-blue-600/25 blur-xl" />
          <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-blue-500/25 blur-xl" />

          <div className="relative z-10 space-y-12">
            {/* Logo */}
            <div className="flex items-center gap-2 text-white font-black text-xl tracking-tight">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-blue-700 text-sm font-black">
                X
              </span>
              BlueX
            </div>

            {/* Title / Description */}
            <div className="space-y-4">
              <h1 className="text-2xl md:text-3xl font-black leading-tight tracking-tight">
                {mode === "signin" ? "Welcome back!" : "Join the platform"}
              </h1>
              <p className="text-blue-100 text-xs md:text-sm leading-relaxed font-medium">
                {mode === "signin"
                  ? "Login to your account and continue booking the best services."
                  : "Register now to start hiring verified professionals and managing your tasks."}
              </p>
            </div>

            {/* Checklist */}
            <div className="space-y-3.5 pt-2">
              {[
                { label: "Secure & private", desc: "Your data is fully encrypted" },
                { label: "Trusted by thousands", desc: "Top rated Swiss service" },
                { label: "Easy booking", desc: "Schedule in seconds" },
                { label: "24/7 Support", desc: "We're here to help anytime" },
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-300 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-white leading-normal">{item.label}</div>
                    <div className="text-[10px] text-blue-200 mt-0.5">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 text-[10px] text-blue-300 font-medium pt-8">
            © 2026 BlueX. All rights reserved.
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 md:p-12 lg:p-14 flex items-center justify-center bg-white overflow-y-auto max-h-[700px]">
          <div className="w-full max-w-md space-y-6">
            <div>
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                {mode === "signup"
                  ? `Create your ${role === "client" ? "Customer" : "Provider"} account`
                  : "Login"}
                {mode === "signup" && (
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100/50">
                    Step {signupStep} of 2
                  </span>
                )}
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                {mode === "signup"
                  ? "Enter your details below to get started."
                  : "Enter your credentials to access your account."}
              </p>
            </div>

            {/* Portal Role selector (only for Signup Step 1) */}
            {mode === "signup" && signupStep === 1 && (
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Signing up as a...</Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole("client")}
                    className={`h-9 text-xs rounded-xl font-bold border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                      role === "client"
                        ? "bg-blue-50 border-blue-200 text-blue-600 shadow-sm"
                        : "bg-white border-slate-200 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("provider")}
                    className={`h-9 text-xs rounded-xl font-bold border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                      role === "provider"
                        ? "bg-blue-50 border-blue-200 text-blue-600 shadow-sm"
                        : "bg-white border-slate-200 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <Building className="w-3.5 h-3.5" />
                    Individual Provider
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={submit} className="space-y-4">
              {/* ── MODE: SIGN IN ── */}
              {mode === "signin" && (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-bold text-slate-700">
                      Email or Phone
                    </Label>
                    <Input
                      id="email"
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="enter your email or phone"
                      className="h-10 rounded-xl border-slate-200 text-xs focus-visible:ring-blue-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-baseline">
                      <Label htmlFor="password" className="text-xs font-bold text-slate-700">
                        Password
                      </Label>
                      <a
                        href="#"
                        className="text-[10px] font-bold text-blue-600 hover:text-blue-700 transition-colors"
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
                        className="h-10 rounded-xl border-slate-200 text-xs focus-visible:ring-blue-600 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      id="remember"
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <Label
                      htmlFor="remember"
                      className="text-xs font-semibold text-slate-500 cursor-pointer select-none"
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
                    <Label htmlFor="name" className="text-xs font-bold text-slate-700">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      placeholder="Jane Doe"
                      className="h-10 rounded-xl border-slate-200 text-xs focus-visible:ring-blue-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-bold text-slate-700">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="jane@example.com"
                      className="h-10 rounded-xl border-slate-200 text-xs focus-visible:ring-blue-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs font-bold text-slate-700">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="+41 79 123 45 67"
                      className="h-10 rounded-xl border-slate-200 text-xs focus-visible:ring-blue-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-xs font-bold text-slate-700">
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
                        className="h-10 rounded-xl border-slate-200 text-xs focus-visible:ring-blue-600 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* ── MODE: SIGN UP (STEP 2 - CUSTOMER) ── */}
              {mode === "signup" && signupStep === 2 && role === "client" && (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="address" className="text-xs font-bold text-slate-700">
                      Street Address
                    </Label>
                    <Input
                      id="address"
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      placeholder="Bahnhofstrasse 1"
                      className="h-10 rounded-xl border-slate-200 text-xs focus-visible:ring-blue-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="city" className="text-xs font-bold text-slate-700">
                        City
                      </Label>
                      <Input
                        id="city"
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        placeholder="Zurich"
                        className="h-10 rounded-xl border-slate-200 text-xs focus-visible:ring-blue-600"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="postal" className="text-xs font-bold text-slate-700">
                        Postal Code
                      </Label>
                      <Input
                        id="postal"
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        required
                        placeholder="8001"
                        className="h-10 rounded-xl border-slate-200 text-xs focus-visible:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="lang" className="text-xs font-bold text-slate-700">
                      Preferred Language
                    </Label>
                    <select
                      id="lang"
                      value={preferredLanguage}
                      onChange={(e) => setPreferredLanguage(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-600"
                    >
                      <option value="en">English</option>
                      <option value="de">Deutsch (German)</option>
                      <option value="fr">Français (French)</option>
                      <option value="it">Italiano (Italian)</option>
                    </select>
                  </div>
                </>
              )}

              {/* ── MODE: SIGN UP (STEP 2 - PROVIDER) ── */}
              {mode === "signup" && signupStep === 2 && role === "provider" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="city" className="text-xs font-bold text-slate-700">
                        City (Operations Base)
                      </Label>
                      <Input
                        id="city"
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        placeholder="Zurich"
                        className="h-10 rounded-xl border-slate-200 text-xs focus-visible:ring-blue-600"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="rate" className="text-xs font-bold text-slate-700">
                        Hourly Rate (CHF/hr)
                      </Label>
                      <Input
                        id="rate"
                        type="number"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(e.target.value)}
                        required
                        placeholder="90"
                        className="h-10 rounded-xl border-slate-200 text-xs focus-visible:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="languages" className="text-xs font-bold text-slate-700">
                      Spoken Languages (comma separated)
                    </Label>
                    <Input
                      id="languages"
                      type="text"
                      value={languages}
                      onChange={(e) => setLanguages(e.target.value)}
                      required
                      placeholder="DE, EN, FR"
                      className="h-10 rounded-xl border-slate-200 text-xs focus-visible:ring-blue-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="skills" className="text-xs font-bold text-slate-700">
                      Skills/Specialties (comma separated)
                    </Label>
                    <Input
                      id="skills"
                      type="text"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      required
                      placeholder="Cleaning, Ironing, Plumbing, Painting"
                      className="h-10 rounded-xl border-slate-200 text-xs focus-visible:ring-blue-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="bio" className="text-xs font-bold text-slate-700">
                      Professional Bio / Description
                    </Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      required
                      placeholder="Tell customers about your experience and qualifications..."
                      className="min-h-[70px] rounded-xl border-slate-200 text-xs focus-visible:ring-blue-600"
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
                    className="flex-1 h-10 border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Back
                  </Button>
                )}
                <Button
                  type="submit"
                  className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/10 cursor-pointer flex items-center justify-center gap-1.5"
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
            <div className="text-center text-xs text-slate-400 font-semibold pt-2">
              {mode === "signup" ? (
                <>
                  Already have an account?{" "}
                  <button
                    className="text-blue-600 hover:text-blue-700 font-bold transition-colors cursor-pointer"
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
                    className="text-blue-600 hover:text-blue-700 font-bold transition-colors cursor-pointer"
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
    </div>
  );
}
