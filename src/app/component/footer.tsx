import { Globe2 } from "lucide-react";
import { footerLinks } from "./constant/static";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <Logo />

            <p className="mt-5 max-w-sm text-sm font-medium leading-7 text-slate-500">
              A trusted community where skills, knowledge and human connection
              create a new kind of value.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {footerLinks.map((column) => (
              <div key={column.title}>
                <h3 className="text-xs font-black uppercase tracking-[0.15em] text-slate-900">
                  {column.title}
                </h3>

                <ul className="mt-5 space-y-3">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm font-semibold text-slate-500 transition hover:text-blue-600"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-slate-200 pt-6 text-xs font-semibold text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 SkillSwap. Built for shared growth.</p>

          <p className="flex items-center gap-1.5">
            Made for curious people everywhere
            <Globe2 className="h-3.5 w-3.5" />
          </p>
        </div>
      </div>
    </footer>
  );
}
