import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium tracking-wide",
  {
    variants: {
      variant: {
        default: "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
        danger: "border-rose-400/20 bg-rose-400/10 text-rose-300",
        warning: "border-amber-400/20 bg-amber-400/10 text-amber-300",
        success: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export function Badge({
  className,
  variant,
  ...props
}: HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

