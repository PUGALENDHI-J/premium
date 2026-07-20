import { LucideIcon, Crown } from "lucide-react";

type SectionLabelProps = {
  children: string;
  icon?: LucideIcon;
  light?: boolean;
};

export function SectionLabel({ children, icon: Icon = Crown, light = false }: SectionLabelProps) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon className={`h-4 w-4 ${light ? "text-black/60" : "text-white/70"}`} />
      <span
        className={`font-inter text-xs uppercase tracking-[0.3em] sm:text-sm ${
          light ? "text-black/60" : "text-white/70"
        }`}
      >
        {children}
      </span>
    </div>
  );
}
