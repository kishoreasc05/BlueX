import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FadeIn } from "@/components/motion";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

const searchSchema = z.object({
  mode: z.enum(["signin", "signup"]).optional(),
});

export const Route = createFileRoute("/signin")({
  validateSearch: (s) => searchSchema.parse(s),
  component: AuthPage,
});

function AuthPage() {
  const { mode: initial } = Route.useSearch();
  const [mode, setMode] = useState<"signin" | "signup">(initial ?? "signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
            data: { full_name: fullName },
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
    <div className="min-h-screen w-full bg-zinc-950 bg-grid-dark flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[100px]" />

      <Link
        to="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to website
      </Link>

      <div className="w-full max-w-5xl grid md:grid-cols-5 gap-8 bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        {/* Left Side: Brand & Value Prop */}
        <div className="hidden md:flex flex-col justify-between col-span-2 p-10 lg:p-12 border-r border-white/5 bg-zinc-900/30">
          <div>
            <div className="flex items-center gap-2 text-white font-semibold text-xl tracking-tight mb-16">
              ✦ BlueX
            </div>

            <FadeIn delay={0.1} direction="up">
              <h1 className="text-3xl font-display font-medium text-white leading-tight mb-4">
                The complete Business Operating System
              </h1>
              <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                Unify your projects, workflows, contracts, and payments into one intelligent, secure
                workspace.
              </p>
            </FadeIn>

            <FadeIn delay={0.2} direction="up" className="space-y-4">
              {[
                "Multi-tenant Organization Management",
                "AI-Powered Document Summaries",
                "Role-Based Access Control",
                "Client & Contractor Portals",
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  {feature}
                </div>
              ))}
            </FadeIn>
          </div>

          <div className="text-xs text-zinc-500">© 2026 BlueX. All rights reserved.</div>
        </div>

        {/* Right Side: Form */}
        <div className="col-span-3 p-10 lg:p-16 flex flex-col justify-center relative">
          <div className="max-w-md w-full mx-auto">
            <FadeIn direction="none" duration={0.4}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-6">
                {mode === "signup" ? "Get Started" : "Welcome Back"}
              </div>
              <h2 className="text-3xl font-semibold tracking-tight text-white mb-2">
                {mode === "signup" ? "Create your account" : "Sign in to BlueX"}
              </h2>
              <p className="text-zinc-400 text-sm mb-8">
                {mode === "signup"
                  ? "Enter your details below to create your workspace."
                  : "Enter your email and password to access your workspace."}
              </p>
            </FadeIn>

            <form onSubmit={submit} className="space-y-5">
              <AnimatePresence mode="popLayout">
                {mode === "signup" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2 overflow-hidden"
                  >
                    <Label htmlFor="name" className="text-sm font-medium text-zinc-300">
                      Full name
                    </Label>
                    <Input
                      id="name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required={mode === "signup"}
                      placeholder="Jane Doe"
                      className="bg-zinc-950/50 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-zinc-300">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@company.com"
                  className="bg-zinc-950/50 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-zinc-300">
                    Password
                  </Label>
                  {mode === "signin" && (
                    <a
                      href="#"
                      className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Forgot password?
                    </a>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="bg-zinc-950/50 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500"
                />
              </div>

              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Button
                  type="submit"
                  className="w-full mt-4 bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                  disabled={loading}
                >
                  {loading ? "Please wait..." : mode === "signup" ? "Create Account" : "Sign In"}
                </Button>
              </motion.div>
            </form>

            <div className="mt-8 text-center text-sm text-zinc-400">
              {mode === "signup" ? (
                <>
                  Already have an account?{" "}
                  <button
                    className="text-white hover:text-indigo-400 font-medium transition-colors"
                    onClick={() => setMode("signin")}
                  >
                    Sign in here
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{" "}
                  <button
                    className="text-white hover:text-indigo-400 font-medium transition-colors"
                    onClick={() => setMode("signup")}
                  >
                    Create one now
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
