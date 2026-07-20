import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

type ButtonProps = {
  children: ReactNode;
  href: string;
  variant?: "primary" | "outline" | "ghost";
  icon?: boolean;
  className?: string;
  external?: boolean;
};

const VARIANT_CLASSES: Record<string, string> = {
  primary:
    "bg-white text-black hover:bg-white/85",
  outline:
    "border border-white/30 text-white hover:border-white/60 hover:bg-white/10",
  ghost:
    "text-white/80 hover:text-white",
};

export function Button({
  children,
  href,
  variant = "primary",
  icon = true,
  className = "",
  external = false,
}: ButtonProps) {
  const base =
    "group inline-flex items-center gap-2 px-6 py-3.5 text-[11px] font-inter uppercase tracking-widest transition-colors sm:px-7 sm:text-xs";
  const classes = `${base} ${VARIANT_CLASSES[variant]} ${className}`;

  const content = (
    <>
      {children}
      {icon && (
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      )}
    </>
  );

  if (external || href.startsWith("http") || href.startsWith("#")) {
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    );
  }

  return (
    <Link to={href} className={classes}>
      {content}
    </Link>
  );
}
