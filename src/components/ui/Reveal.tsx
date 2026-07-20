import { ReactNode } from "react";
import { useInView } from "../../lib/useInView";

type RevealProps = {
  children: ReactNode;
  delay?: 0 | 1 | 2 | 3 | 4;
  as?: "div" | "span";
  className?: string;
};

const DELAY_CLASS: Record<number, string> = {
  0: "",
  1: "reveal-delay-1",
  2: "reveal-delay-2",
  3: "reveal-delay-3",
  4: "reveal-delay-4",
};

export function Reveal({ children, delay = 0, as = "div", className = "" }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const Tag = as;

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${DELAY_CLASS[delay]} ${inView ? "reveal-in" : ""} ${className}`}
    >
      {children}
    </Tag>
  );
}
