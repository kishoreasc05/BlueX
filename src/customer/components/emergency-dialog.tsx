import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  Zap,
  MapPin,
  Phone,
  MessageSquare,
  Clock,
  ShieldCheck,
  BadgeCheck,
  Building,
  User,
  Star,
} from "lucide-react";
import { MOCK_PROVIDERS } from "@/customer/mockData";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

function initials(name?: string | null) {
  if (!name) return "?";
  return name
    .split(/\s+/)
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface EmergencyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MATCHING_STATUSES = [
  "Connecting to BlueX emergency dispatch system...",
  "Broadcasting request to active pros within 5km...",
  "Verifying credentials, licensing, and liability insurance...",
  "Emergency pro found! Confirming availability and ETA...",
];

export function EmergencyDialog({ open, onOpenChange }: EmergencyDialogProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState<"form" | "matching" | "success">("form");

  // Form fields
  const [category, setCategory] = useState<"plumbing" | "electrical" | "heating" | "locksmith">(
    "plumbing",
  );
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("Zurich, Switzerland");

  // Matching status state
  const [statusIndex, setStatusIndex] = useState(0);
  const [matchedPro, setMatchedPro] = useState<any>(null);

  // Reset modal states when closed
  useEffect(() => {
    if (!open) {
      // Delay reset so animation finishes
      const timer = setTimeout(() => {
        setStep("form");
        setDescription("");
        setCategory("plumbing");
        setStatusIndex(0);
        setMatchedPro(null);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Handle cycle of matching status texts
  useEffect(() => {
    if (step === "matching") {
      const interval = setInterval(() => {
        setStatusIndex((prev) => {
          if (prev < MATCHING_STATUSES.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 1000);

      // Match found after 4.5 seconds
      const finishTimer = setTimeout(() => {
        // Resolve matching pro based on category
        let proKey = "hans-mueller";
        if (category === "plumbing" || category === "heating") {
          proKey = "zuri-plumbing";
        } else if (category === "electrical") {
          proKey = "swiss-electricians";
        }

        setMatchedPro(MOCK_PROVIDERS[proKey]);
        setStep("success");
      }, 4500);

      return () => {
        clearInterval(interval);
        clearTimeout(finishTimer);
      };
    }
  }, [step, category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.error("Please describe your emergency so pros know what tools to bring.");
      return;
    }
    setStep("matching");
  };

  const handleCall = () => {
    toast.success(`Calling ${matchedPro?.name}... Call simulator active.`);
  };

  const handleChat = () => {
    onOpenChange(false);
    navigate({ to: "/client/messages" });
    toast.success(`Chatting with ${matchedPro?.name}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] overflow-hidden rounded-2xl bg-white border border-slate-200 p-0 gap-0">
        {/* ── STEP 1: FORM INPUT ── */}
        {step === "form" && (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <DialogHeader className="space-y-1">
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5 animate-pulse" />
                <DialogTitle className="text-xl font-bold tracking-tight">
                  Request Emergency Pro
                </DialogTitle>
              </div>
              <DialogDescription className="text-slate-500 text-xs">
                Need immediate help? We'll dispatch a certified, insured Swiss professional.
                Response in minutes.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Category selector */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500">
                  Select Emergency Specialty
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "plumbing", label: "🚰 Plumbing" },
                    { id: "electrical", label: "⚡ Electrical" },
                    { id: "heating", label: "🔥 Heating" },
                    { id: "locksmith", label: "🔑 Locksmith" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id as any)}
                      className={cn(
                        "py-2.5 px-3 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer",
                        category === cat.id
                          ? "bg-red-50 border-red-200 text-red-600 shadow-sm"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100",
                      )}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label htmlFor="desc" className="text-xs font-bold text-slate-500">
                  Describe the Emergency
                </Label>
                <Textarea
                  id="desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Toilet is overflowing, water won't shut off, or kitchen has no power..."
                  className="min-h-[90px] rounded-xl border-slate-200 focus-visible:ring-red-500 placeholder:text-slate-400 text-xs"
                />
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <Label htmlFor="location" className="text-xs font-bold text-slate-500">
                  Service Location
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-9 rounded-xl border-slate-200 focus-visible:ring-red-500 text-xs h-9.5"
                  />
                </div>
              </div>

              {/* Pricing callout */}
              <div className="bg-red-50/50 border border-red-100 rounded-xl p-3.5 flex items-start gap-3">
                <Zap className="h-4.5 w-4.5 text-red-500 shrink-0 mt-0.5" />
                <div className="text-[11px] text-red-900 leading-relaxed">
                  <span className="font-bold">Transparent Callout Rates:</span> CHF 120 emergency
                  flat fee includes dispatch, insurance coverage, and the first hour of
                  troubleshooting diagnostics.
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="rounded-xl text-xs font-semibold hover:bg-slate-100 text-slate-600"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/20 cursor-pointer h-10 px-5"
              >
                Find Emergency Pro
              </Button>
            </div>
          </form>
        )}

        {/* ── STEP 2: RADAR SEARCH ANIMATION ── */}
        {step === "matching" && (
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-6 min-h-[380px] bg-slate-900 text-white relative">
            {/* Pulsing Radar rings */}
            <div className="relative h-32 w-32 flex items-center justify-center mb-4">
              <span className="absolute inset-0 rounded-full border border-red-500/20 animate-[ping_2.5s_infinite]" />
              <span className="absolute inset-4 rounded-full border border-red-500/40 animate-[ping_2s_infinite]" />
              <span className="absolute inset-8 rounded-full border border-red-500/60 animate-[ping_1.5s_infinite]" />

              <div className="h-16 w-16 rounded-full bg-red-600 flex items-center justify-center relative shadow-lg shadow-red-600/50">
                <AlertTriangle className="h-7 w-7 text-white animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold tracking-tight">Searching Zurich</h3>
              <p className="text-xs text-red-400 font-bold uppercase tracking-wider animate-pulse">
                Live Matching In Progress...
              </p>
            </div>

            {/* Cycling status labels */}
            <p className="text-xs text-slate-400 font-medium max-w-sm h-8 flex items-center justify-center transition-all duration-300">
              {MATCHING_STATUSES[statusIndex]}
            </p>
          </div>
        )}

        {/* ── STEP 3: SUCCESS MATCHED ── */}
        {step === "success" && matchedPro && (
          <div className="p-6 space-y-5">
            <DialogHeader className="space-y-1.5 text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-1">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <DialogTitle className="text-xl font-bold tracking-tight text-slate-900">
                Emergency Pro Matched!
              </DialogTitle>
              <DialogDescription className="text-slate-500 text-xs">
                A verified Swiss emergency contractor is dispatched and on the way.
              </DialogDescription>
            </DialogHeader>

            {/* Matched Pro details card */}
            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-3 text-center sm:text-left">
                {/* Initial Avatar */}
                <div className="h-14 w-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-black shadow-md select-none shrink-0">
                  {initials(matchedPro.name)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5 justify-center sm:justify-start">
                    {matchedPro.name}
                    {matchedPro.type === "company" ? (
                      <span className="inline-flex items-center gap-0.5 text-[8px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 uppercase tracking-wider">
                        <Building className="h-2 w-2" /> Co.
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 text-[8px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 uppercase tracking-wider">
                        <User className="h-2 w-2" /> Private
                      </span>
                    )}
                  </h4>
                  <div className="flex items-center justify-center sm:justify-start gap-1 mt-0.5 text-xs text-slate-500">
                    <span className="flex items-center text-amber-500">
                      <Star className="h-3 w-3 fill-current" />
                      <span className="font-bold ml-0.5">{matchedPro.rating}</span>
                    </span>
                    <span>•</span>
                    <span>{matchedPro.specialtyLabel || matchedPro.specialty}</span>
                  </div>
                </div>
              </div>

              {/* Estimate bubble */}
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-2 text-center shrink-0">
                <div className="text-red-600 font-black text-lg leading-tight flex items-center gap-1 justify-center">
                  <Clock className="h-4 w-4" /> 18 min
                </div>
                <div className="text-[9px] text-red-500 font-bold uppercase tracking-wider">
                  Estimated Arrival
                </div>
              </div>
            </div>

            {/* Verification items */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 flex items-center gap-2">
                <BadgeCheck className="h-4.5 w-4.5 text-blue-600 shrink-0" />
                <div>
                  <div className="text-[10px] font-bold text-slate-700">Swiss Certified</div>
                  <div className="text-[9px] text-slate-400">UID check passed</div>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 flex items-center gap-2">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-[10px] font-bold text-slate-700">Fully Insured</div>
                  <div className="text-[9px] text-slate-400">CHF 5M coverage</div>
                </div>
              </div>
            </div>

            {/* Dynamic callout note */}
            <p className="text-[10px] text-slate-400 text-center leading-relaxed italic">
              Booking ID generated automatically. Hans will call you upon arrival at {location}.
            </p>

            {/* Actions */}
            <div className="pt-2 grid grid-cols-2 gap-3">
              <Button
                onClick={handleCall}
                variant="outline"
                className="border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold cursor-pointer h-10 flex items-center gap-1.5"
              >
                <Phone className="h-4 w-4 text-slate-500" />
                Call Contractor
              </Button>
              <Button
                onClick={handleChat}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 cursor-pointer h-10 flex items-center gap-1.5"
              >
                <MessageSquare className="h-4 w-4 text-white/90" />
                Open Live Chat
              </Button>
            </div>

            <div className="text-center pt-1 border-t border-slate-100">
              <button
                onClick={() => onOpenChange(false)}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
