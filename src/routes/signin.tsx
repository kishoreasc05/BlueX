import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck,
  Star,
  Calendar,
  MessageSquare,
  ArrowLeft,
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate({ to: "/dashboard" });
  }, [user, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + "/dashboard",
            data: { full_name: fullName, portal_role: role },
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

      <div className="w-full max-w-[1000px] grid md:grid-cols-[400px_1fr] bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xl min-h-[600px]">
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
        <div className="p-8 md:p-12 lg:p-14 flex items-center justify-center bg-white">
          <div className="w-full max-w-sm space-y-6">
            <div>
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
                {mode === "signup" ? "Create your account" : "Login"}
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                {mode === "signup"
                  ? "Enter your details below to get started."
                  : "Enter your credentials to access your account."}
              </p>
            </div>

            {/* Portal Role selector (only for Signup) */}
            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Signing up as a...</Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole("client")}
                    className={`h-9 text-xs rounded-xl font-bold border transition-colors cursor-pointer ${
                      role === "client"
                        ? "bg-blue-50 border-blue-200 text-blue-600"
                        : "bg-white border-slate-200 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("provider")}
                    className={`h-9 text-xs rounded-xl font-bold border transition-colors cursor-pointer ${
                      role === "provider"
                        ? "bg-blue-50 border-blue-200 text-blue-600"
                        : "bg-white border-slate-200 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    Provider
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={submit} className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-bold text-slate-700">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={mode === "signup"}
                    placeholder="Jane Doe"
                    className="h-10 rounded-xl border-slate-200 text-xs focus-visible:ring-blue-600"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-bold text-slate-700">
                  Email or Phone
                </Label>
                <Input
                  id="email"
                  type="email"
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
                  {mode === "signin" && (
                    <a href="#" className="text-[10px] font-bold text-blue-600 hover:text-blue-700">
                      Forgot password?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    minLength={6}
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
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember me checkbox */}
              {mode === "signin" && (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <Label
                    htmlFor="remember"
                    className="text-xs font-semibold text-slate-500 cursor-pointer"
                  >
                    Remember me
                  </Label>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/10 cursor-pointer mt-2"
                disabled={loading}
              >
                {loading ? "Please wait..." : mode === "signup" ? "Sign Up" : "Login"}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="flex-shrink mx-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                or continue with
              </span>
              <div className="flex-grow border-t border-slate-100"></div>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="h-9 border border-slate-200 rounded-xl hover:bg-slate-50 flex items-center justify-center gap-2 text-xs font-semibold text-slate-600 transition-colors cursor-pointer"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </button>
              <button
                type="button"
                className="h-9 border border-slate-200 rounded-xl hover:bg-slate-50 flex items-center justify-center gap-2 text-xs font-semibold text-slate-600 transition-colors cursor-pointer"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.75.8-.02 2.01-.84 3.6-.68 1.66.17 2.92.83 3.6 1.95-3.37 2.02-2.83 6.6.61 8a7 7 0 0 1-2.89 2.95M15.48 4.9c.78-.97.66-2.5.42-3.1 1.76.1 2.85 1.25 2.76 2.68-.1 1.14-.97 2.37-2.21 2.3-1.03.05-1.89-.91-.97-1.88" />
                </svg>
                Apple
              </button>
            </div>

            {/* Bottom Register/Login toggle link */}
            <div className="text-center text-xs text-slate-400 font-semibold">
              {mode === "signup" ? (
                <>
                  Already have an account?{" "}
                  <button
                    className="text-blue-600 hover:text-blue-700 font-bold transition-colors cursor-pointer"
                    onClick={() => setMode("signin")}
                  >
                    Login
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{" "}
                  <button
                    className="text-blue-600 hover:text-blue-700 font-bold transition-colors cursor-pointer"
                    onClick={() => setMode("signup")}
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
