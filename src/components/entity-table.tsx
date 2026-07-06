import { type ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "motion/react";

export type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
};

export function EntityTable<T extends { id: string }>({
  rows,
  columns,
  onRowClick,
}: {
  rows: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/40 bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border/40">
            {columns.map((c) => (
              <TableHead key={c.key} className={c.className}>
                <span className="mono-label text-[9px] font-mono tracking-widest text-muted-foreground/80">{c.header}</span>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r, index) => (
            <TableRow
              key={r.id}
              onClick={onRowClick ? () => onRowClick(r) : undefined}
              className={`border-b border-border/30 hover:bg-muted/10 last:border-0 transition-colors duration-200 ${onRowClick ? "cursor-pointer" : ""}`}
            >
              {columns.map((c) => (
                <TableCell key={c.key} className={`${c.className} py-4`}>
                  <motion.div
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: Math.min(index * 0.03, 0.25),
                      ease: "easeOut"
                    }}
                  >
                    {c.render(r)}
                  </motion.div>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}