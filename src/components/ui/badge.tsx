import { cn } from "@/lib/utils";
export function Badge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex rounded-sm border border-stone-200 bg-stone-100 px-2 py-1 text-xs font-medium",
        className,
      )}
      {...props}
    />
  );
}
