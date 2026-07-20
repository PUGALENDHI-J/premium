import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import {
  SITE_NAME,
  SITE_TAGLINE,
  FOOTER_LINKS,
  SOCIAL_LINKS,
  CONTACT_EMAIL,
} from "../../lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto w-full max-w-[1400px] px-6 py-16 sm:px-10 lg:px-16 lg:py-20">
        <div className="flex flex-col gap-14 lg:flex-row lg:justify-between">
          <div className="max-w-sm">
            <Link
              to="/"
              className="font-podium text-2xl font-bold uppercase tracking-wider text-white sm:text-3xl"
            >
              {SITE_NAME}
            </Link>
            <p className="mt-4 font-inter text-sm leading-relaxed text-white/60">
              {SITE_TAGLINE}. We build fierce brand identities that don't just turn heads —
              they lead.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="group mt-6 inline-flex items-center gap-2 font-inter text-sm uppercase tracking-widest text-white/80 transition-colors hover:text-white"
            >
              {CONTACT_EMAIL}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 lg:gap-x-14">
            {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
              <div key={heading}>
                <h3 className="font-inter text-xs uppercase tracking-[0.25em] text-white/40">
                  {heading}
                </h3>
                <ul className="mt-4 space-y-3">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        className="font-inter text-sm text-white/70 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-inter text-xs uppercase tracking-widest text-white/40">
            © {new Date().getFullYear()} {SITE_NAME} STUDIO. ALL RIGHTS RESERVED.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="font-inter text-xs uppercase tracking-widest text-white/50 transition-colors hover:text-white"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
