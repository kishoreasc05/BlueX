import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-lg border px-2.5 py-0.5 text-[10px] uppercase font-mono tracking-wider font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-accent-indigo/25 bg-accent-indigo/10 text-accent-indigo hover:bg-accent-indigo/15 shadow-sm",
        secondary: "border-border/60 bg-muted/40 text-muted-foreground hover:bg-muted/60",
        destructive:
          "border-destructive/25 bg-destructive/10 text-destructive hover:bg-destructive/15 shadow-sm",
        outline: "border-border/60 text-foreground/80 hover:bg-muted/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
