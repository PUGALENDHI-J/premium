import { ReactNode } from "react";

export function Card({
  children,
  className = "",
  hover = true,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={`border border-white/10 bg-white/[0.03] p-8 transition-all duration-500 ${
        hover ? "hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.06]" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
