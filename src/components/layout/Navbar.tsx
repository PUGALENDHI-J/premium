import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ArrowUpRight, X } from "lucide-react";
import { NAV_LINKS, SITE_NAME } from "../../lib/constants";

export function Navbar({ variant = "solid" }: { variant?: "solid" | "transparent" }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (variant !== "transparent") return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isTransparent = variant === "transparent" && !scrolled;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 transition-colors duration-500 sm:px-10 lg:px-16 lg:py-7 ${
          isTransparent
            ? "bg-transparent"
            : "border-b border-white/10 bg-black/85 backdrop-blur-md"
        }`}
      >
        <Link
          to="/"
          className="font-podium text-2xl font-bold uppercase tracking-wider text-white sm:text-3xl"
        >
          {SITE_NAME}
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                `font-inter text-sm uppercase tracking-widest transition-colors hover:text-white ${
                  isActive ? "text-white" : "text-white/80"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/contact"
          className="group hidden items-center gap-2 border border-white/30 px-6 py-3 text-xs uppercase tracking-widest text-white transition-colors hover:border-white/60 hover:bg-white/10 md:inline-flex"
        >
          GET IN TOUCH
          <ArrowUpRight className="h-4 w-4" />
        </Link>

        <button
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
          className="flex flex-col space-y-1.5 md:hidden"
        >
          <div className="h-0.5 w-6 bg-white" />
          <div className="h-0.5 w-6 bg-white" />
          <div className="h-0.5 w-4 bg-white" />
        </button>
      </header>

      <div
        className={`fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-sm transition-all duration-500 md:hidden ${
          menuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 sm:px-10">
          <h2 className="font-podium text-2xl font-bold uppercase tracking-wider text-white sm:text-3xl">
            {SITE_NAME}
          </h2>
          <button aria-label="Close menu" onClick={() => setMenuOpen(false)}>
            <X className="h-7 w-7 text-white" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col items-center justify-center gap-6">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-podium text-4xl uppercase text-white transition-all duration-500 sm:text-5xl"
              style={{
                transitionDelay: `${i * 80 + 100}ms`,
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "translateY(0)" : "translateY(20px)",
              }}
            >
              {link.label}
            </Link>
          ))}

          <Link
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className="mt-4 inline-flex items-center gap-2 border border-white/30 px-6 py-3 text-xs uppercase tracking-widest text-white transition-all duration-500 hover:border-white/60 hover:bg-white/10"
            style={{
              transitionDelay: `${NAV_LINKS.length * 80 + 100}ms`,
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? "translateY(0)" : "translateY(20px)",
            }}
          >
            GET IN TOUCH
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </nav>
      </div>
    </>
  );
}
