import React from "react";
import { OcrProgressState } from "../types/ocr.types";
import { Loader2, CheckCircle2, AlertTriangle, Cpu } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface OcrProgressCardProps {
  progress: OcrProgressState;
  documentName: string;
}

export function OcrProgressCard({ progress, documentName }: OcrProgressCardProps) {
  const { stage, progressPercentage, statusMessage, estimatedTimeRemainingSec, error } = progress;

  const isCompleted = stage === "completed";
  const isFailed = stage === "failed";

  return (
    <div className="w-full bg-card rounded-2xl border border-border p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isCompleted
                ? "bg-emerald-500/10 text-emerald-600"
                : isFailed
                  ? "bg-destructive/10 text-destructive"
                  : "bg-primary/10 text-primary"
            }`}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : isFailed ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <Loader2 className="w-5 h-5 animate-spin" />
            )}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground truncate max-w-md">
              {documentName}
            </h4>
            <p className="text-xs text-muted-foreground">{statusMessage}</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-lg font-bold text-foreground">{progressPercentage}%</span>
          {estimatedTimeRemainingSec !== undefined && estimatedTimeRemainingSec > 0 && (
            <p className="text-xs text-muted-foreground">~{estimatedTimeRemainingSec}s remaining</p>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <Progress
          value={progressPercentage}
          className={`h-2.5 rounded-full ${
            isCompleted
              ? "[&>div]:bg-emerald-500"
              : isFailed
                ? "[&>div]:bg-destructive"
                : "[&>div]:bg-primary"
          }`}
        />
      </div>

      {/* Error state */}
      {isFailed && error && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
          <strong>OCR Error:</strong> {error}
        </div>
      )}

      {/* Stage indicators */}
      {!isCompleted && !isFailed && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
          <Cpu className="w-3.5 h-3.5 animate-pulse text-primary" />
          <span>Tesseract Web Worker executing locally in browser...</span>
        </div>
      )}
    </div>
  );
}
