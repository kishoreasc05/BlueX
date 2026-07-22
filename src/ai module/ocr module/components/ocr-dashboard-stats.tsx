import React from "react";
import { FileText, CheckCircle2, ShieldCheck, AlertTriangle } from "lucide-react";
import { useOcrStats } from "../hooks/use-ocr-documents";

interface OcrDashboardStatsProps {
  targetUserId?: string;
}

export function OcrDashboardStats({ targetUserId }: OcrDashboardStatsProps) {
  const { total, completed, failed, processing, autoApproved } = useOcrStats(targetUserId);

  const stats = [
    {
      title: "Total Documents",
      value: total,
      icon: FileText,
      color: "text-blue-600 bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "OCR Completed",
      value: completed,
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Auto-Approved Providers",
      value: autoApproved,
      icon: ShieldCheck,
      color: "text-indigo-600 bg-indigo-500/10 border-indigo-500/20",
    },
    {
      title: "Processing / Issues",
      value: processing + failed,
      icon: AlertTriangle,
      color: "text-amber-600 bg-amber-500/10 border-amber-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, idx) => {
        const Icon = s.icon;
        return (
          <div
            key={idx}
            className="bg-card rounded-2xl border border-border p-5 shadow-xs flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {s.title}
              </p>
              <h3 className="text-2xl font-bold text-foreground mt-1">{s.value}</h3>
            </div>
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center border ${s.color}`}
            >
              <Icon className="w-6 h-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
