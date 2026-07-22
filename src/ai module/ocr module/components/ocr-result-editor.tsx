import React, { useState } from "react";
import { Copy, Download, Save, Check, Award, Clock, Languages, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface OcrResultEditorProps {
  initialText: string;
  confidence: number;
  processingTimeMs: number;
  language: string;
  autoApproved?: boolean;
  onSave?: (text: string) => Promise<void> | void;
  disabled?: boolean;
}

export function OcrResultEditor({
  initialText,
  confidence,
  processingTimeMs,
  language,
  autoApproved,
  onSave,
  disabled,
}: OcrResultEditorProps) {
  const [text, setText] = useState(initialText);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Extracted text copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy text");
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `ocr_extracted_text_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("TXT file downloaded");
  };

  const handleSave = async () => {
    if (!onSave) return;
    setSaving(true);
    try {
      await onSave(text);
    } finally {
      setSaving(false);
    }
  };

  // Confidence score badge color helper
  const getConfidenceBadge = (score: number) => {
    if (score >= 80) {
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    } else if (score >= 50) {
      return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    } else {
      return "bg-rose-500/10 text-rose-600 border-rose-500/20";
    }
  };

  return (
    <div className="w-full bg-card rounded-2xl border border-border p-6 shadow-sm space-y-4">
      {/* Header bar with Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Confidence Badge */}
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getConfidenceBadge(
              confidence,
            )}`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Confidence: {confidence}%</span>
          </div>

          {/* Auto-Approved Status */}
          {autoApproved && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Provider Profile Auto-Approved</span>
            </div>
          )}

          {/* Processing Time */}
          <div className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-md">
            <Clock className="w-3 h-3" />
            <span>{processingTimeMs} ms</span>
          </div>

          {/* Language */}
          <div className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-md uppercase">
            <Languages className="w-3 h-3" />
            <span>{language}</span>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy} className="h-8 text-xs">
            {copied ? (
              <Check className="w-3.5 h-3.5 mr-1 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5 mr-1" />
            )}
            {copied ? "Copied" : "Copy"}
          </Button>

          <Button variant="outline" size="sm" onClick={handleDownload} className="h-8 text-xs">
            <Download className="w-3.5 h-3.5 mr-1" />
            Download TXT
          </Button>

          {onSave && (
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saving || disabled}
              className="h-8 text-xs shadow-xs"
            >
              <Save className="w-3.5 h-3.5 mr-1" />
              {saving ? "Saving..." : "Save OCR Result"}
            </Button>
          )}
        </div>
      </div>

      {/* Text Editor */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Extracted Text Content (Editable)
          </label>
          <span className="text-xs text-muted-foreground">{text.length} characters</span>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={disabled}
          rows={12}
          placeholder="No text extracted..."
          className="w-full p-4 rounded-xl border border-border bg-background text-foreground font-mono text-sm leading-relaxed focus:ring-2 focus:ring-primary/20 focus:border-primary outline-hidden resize-y shadow-inner"
        />
      </div>
    </div>
  );
}
