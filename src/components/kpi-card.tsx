import { type LucideIcon } from "lucide-react";
import { AnimatedCounter } from "@/components/motion";
import { motion } from "motion/react";

export function KpiCard({
  label,
  value,
  icon: Icon,
  hint,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
}) {
  const numericValue = typeof value === "number" ? value : parseInt(String(value), 10);
  const isNumeric = !isNaN(numericValue);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden border border-border/40 bg-card p-6 transition-all duration-300 hover:border-accent-blue/30 hover:shadow-lg shadow-sm"
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-accent-blue/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 flex items-start justify-between">
        <div className="mono-label text-muted-foreground/80 font-mono text-[9px] tracking-widest">
          {label}
        </div>
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted/40 text-muted-foreground/80 group-hover:bg-accent-blue/10 group-hover:text-accent-blue transition-colors">
          <Icon className="h-4 w-4" strokeWidth={1.5} />
        </div>
      </div>

      <div className="relative z-10 mt-6 text-4.5xl font-bold tracking-tight leading-none text-foreground">
        {isNumeric ? <AnimatedCounter value={numericValue} /> : value}
      </div>

      {hint ? (
        <div className="relative z-10 mono-label mt-4 text-[9px] text-muted-foreground/75 font-mono">
          {hint}
        </div>
      ) : null}
    </motion.div>
  );
}

export function EmptyState({
  title,
  description,
  action,
  icon: Icon,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: LucideIcon;
}) {
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-border/60 bg-muted/10 rounded-2xl px-6 py-20 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-accent-blue/5 to-transparent opacity-20" />

      {Icon ? (
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted border border-border/30 text-muted-foreground/60 shadow-sm">
          <Icon className="h-6 w-6" strokeWidth={1.25} />
        </div>
      ) : null}

      <div className="mono-label text-foreground text-xs font-semibold tracking-wider font-mono">
        {title}
      </div>
      {description ? (
        <div className="mt-3.5 max-w-sm text-xs leading-[1.65] text-muted-foreground/80">
          {description}
        </div>
      ) : null}
      {action ? <div className="mt-6 relative z-10">{action}</div> : null}
    </div>
  );
}
