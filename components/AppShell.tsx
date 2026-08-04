"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, Brain, ChartNoAxesColumnIncreasing, Home, Languages, Moon, Shield, Sun, User, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { dictionaries, normalizeLocale } from "@/lib/i18n";
import type { Locale } from "@/data/content";

const navItems = [
  ["/", "home", Home],
  ["/dashboard", "dashboard", ChartNoAxesColumnIncreasing],
  ["/learn", "learn", BookOpen],
  ["/practice", "practice", Brain],
  ["/play", "play", Zap],
  ["/profile", "profile", User],
  ["/admin", "admin", Shield]
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>("fr");
  const [dark, setDark] = useState(false);
  const dict = dictionaries[locale];

  useEffect(() => {
    setLocale(normalizeLocale(localStorage.getItem("locale")));
    setDark(localStorage.getItem("theme") === "dark");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const active = useMemo(() => pathname || "/", [pathname]);

  function changeLocale(value: Locale) {
    setLocale(value);
    localStorage.setItem("locale", value);
    router.refresh();
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-black/10 bg-paper/90 backdrop-blur dark:border-white/10 dark:bg-night/90">
        <nav className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          <Link href="/" className="flex min-w-fit items-center gap-2 font-semibold" aria-label="ChessMentor">
            <span className="grid h-9 w-9 place-items-center rounded bg-ink text-paper dark:bg-paper dark:text-ink">CM</span>
            <span>ChessMentor</span>
          </Link>
          <div className="hidden flex-1 items-center justify-center gap-1 lg:flex">
            {navItems.map(([href, key, Icon]) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 rounded px-3 py-2 text-sm transition ${
                  active === href ? "bg-mint text-ink dark:bg-sage dark:text-white" : "hover:bg-black/5 dark:hover:bg-white/10"
                }`}
              >
                <Icon size={16} aria-hidden />
                {dict.nav[key]}
              </Link>
            ))}
          </div>
          <label className="ml-auto flex items-center gap-2 rounded border border-black/10 px-2 py-1 text-sm dark:border-white/10">
            <Languages size={16} aria-hidden />
            <span className="sr-only">Langue</span>
            <select value={locale} onChange={(event) => changeLocale(event.target.value as Locale)} className="bg-transparent">
              <option value="fr">FR</option>
              <option value="de">DE</option>
              <option value="en">EN</option>
            </select>
          </label>
          <button onClick={() => setDark((value) => !value)} className="grid h-9 w-9 place-items-center rounded border border-black/10 dark:border-white/10" aria-label="Changer de theme">
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </nav>
        <div className="flex gap-1 overflow-x-auto px-4 pb-3 lg:hidden">
          {navItems.map(([href, key, Icon]) => (
            <Link key={href} href={href} className="flex min-w-fit items-center gap-2 rounded px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10">
              <Icon size={15} aria-hidden />
              {dict.nav[key]}
            </Link>
          ))}
        </div>
      </header>
      {children}
    </div>
  );
}
