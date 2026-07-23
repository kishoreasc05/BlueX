import { useState } from "react";
import { Sparkles, Check, FileText, CheckCircle2, ArrowRight } from "lucide-react";
import { expandJobDescription } from "../engine/job-expander";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AiJobExpanderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialPrompt?: string;
  onApplyExpandedJob: (expanded: { title: string; notes: string }) => void;
}

export function AiJobExpanderModal({
  open,
  onOpenChange,
  initialPrompt = "Need painter for 3-bedroom house",
  onApplyExpandedJob,
}: AiJobExpanderModalProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const expanded = expandJobDescription(prompt);

  const handleApply = () => {
    const notesText = `${expanded.summary}\n\nScope of Work:\n${expanded.scopeItems.map((s) => `• ${s}`).join("\n")}\n\nEstimated Duration: ~${expanded.estimatedHours} hours\nSuggested Budget: ${expanded.currency} ${expanded.suggestedBudgetMin} - ${expanded.suggestedBudgetMax}`;
    onApplyExpandedJob({ title: expanded.title, notes: notesText });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-6 rounded-3xl border-slate-200">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 fill-indigo-600/10" />
            <span>AI Job Description Expander</span>
          </DialogTitle>
          <p className="text-xs text-slate-500 font-medium">
            Expands brief customer notes into a detailed, structured booking specification.
          </p>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* User Input Prompt */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Short Description / Prompt
            </label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Need someone urgently for painting 3-bed house"
              className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* AI Expanded Preview */}
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-indigo-100/60 pb-2">
              <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-600" /> Generated Title
              </span>
              <span className="text-[10px] font-extrabold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                ~{expanded.estimatedHours} Hours Est.
              </span>
            </div>

            <h4 className="text-sm font-extrabold text-slate-900">{expanded.title}</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">{expanded.summary}</p>

            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Structured Scope of Work:
              </span>
              <div className="space-y-1">
                {expanded.scopeItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-xs text-slate-700 font-medium"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-indigo-100/60 flex justify-between items-center text-xs">
              <span className="font-bold text-slate-500">Estimated Budget Range:</span>
              <span className="font-extrabold text-indigo-700 text-sm">
                {expanded.currency} {expanded.suggestedBudgetMin} – {expanded.suggestedBudgetMax}
              </span>
            </div>
          </div>

          <Button
            onClick={handleApply}
            className="w-full h-11 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold gap-2 cursor-pointer shadow-sm"
          >
            <Check className="w-4 h-4" /> Use Expanded Description for Booking
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
