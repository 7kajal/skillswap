"use client";

import { useEffect, useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import {
  Award,
  CalendarDays,
  LogOut,
  Menu,
  MessageCircleMore,
  Settings,
  UserRound,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";
import { navigation } from "./constant/static";

function initials(name?: string | null) {
  return (name || "Member")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [profileAvatar, setProfileAvatar] = useState<string | null>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    const closeMenu = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);

  useEffect(() => {
    if (status !== "authenticated") {
      setProfileAvatar(null);
      return;
    }

    fetch("/api/profile")
      .then((response) => response.json())
      .then((result) => setProfileAvatar(result.data?.avatar || null))
      .catch(() => setProfileAvatar(null));
  }, [pathname, status]);

  const user = session?.user;
  const avatar = profileAvatar || user?.image;
  const profileHref = user?.id ? `/profile/${user.id}` : "/profile/complete";

  const accountLinks = [
    { label: "My profile", href: profileHref, icon: UserRound },
    { label: "Edit profile", href: "/profile/complete", icon: Settings },
    { label: "Swap center", href: "/dashboard", icon: MessageCircleMore },
    { label: "Sessions", href: "/sessions", icon: CalendarDays },
    { label: "Reviews & badges", href: "/reputation", icon: Award },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-6 lg:h-20 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 rounded-full border border-slate-200/80 bg-slate-50/80 p-1.5 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-white hover:text-blue-600 hover:shadow-sm"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden min-w-[190px] items-center justify-end gap-3 lg:flex">
          {status === "loading" ? (
            <div className="h-11 w-32 animate-pulse rounded-full bg-slate-100" />
          ) : user ? (
            <div ref={profileMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setProfileMenuOpen((open) => !open)}
                aria-expanded={profileMenuOpen}
                aria-label="Open account menu"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white p-1 shadow-sm transition hover:border-blue-200 hover:shadow-md"
              >
                {avatar ? (
                  <img
                    src={avatar}
                    alt={user.name || "Profile"}
                    className="h-9 w-9 rounded-full object-cover"
                    onError={() => setProfileAvatar(null)}
                  />
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-xs font-black text-white">
                    {initials(user.name)}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {profileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    className="absolute right-0 mt-3 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_24px_70px_rgba(15,23,42,0.16)]"
                  >
                    <div className="border-b border-slate-100 px-3 py-3">
                      <p className="truncate text-sm font-black text-slate-900">
                        {user.name || "SkillSwap member"}
                      </p>
                      <p className="mt-0.5 truncate text-xs font-medium text-slate-400">
                        {user.email}
                      </p>
                    </div>

                    <div className="py-2">
                      {accountLinks.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setProfileMenuOpen(false)}
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Icon className="h-4 w-4" />
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex w-full items-center gap-3 border-t border-slate-100 px-3 py-3 text-sm font-bold text-rose-600 transition hover:bg-rose-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Log out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="rounded-full px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
              >
                Log in
              </Link>
              <Link
                href="/auth/register"
                className="rounded-full bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Join now
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-label="Toggle menu"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-900 shadow-sm lg:hidden"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            className="mx-4 mb-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl lg:hidden"
          >
            {user && (
              <div className="mb-3 flex items-center gap-3 border-b border-slate-100 px-2 pb-4">
                {avatar ? (
                  <img src={avatar} alt={user.name || "Profile"} className="h-10 w-10 rounded-full object-cover" onError={() => setProfileAvatar(null)} />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-xs font-black text-white">
                    {initials(user.name)}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-slate-900">{user.name}</p>
                  <p className="truncate text-xs text-slate-400">{user.email}</p>
                </div>
              </div>
            )}

            <nav className="flex flex-col">
              {navigation.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
                >
                  {item.label}
                </Link>
              ))}
              {user &&
                accountLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
            </nav>

            <div className="mt-3 border-t border-slate-100 pt-4">
              {status === "loading" ? (
                <div className="h-12 animate-pulse rounded-full bg-slate-100" />
              ) : user ? (
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-rose-200 px-4 py-3 text-sm font-bold text-rose-600"
                >
                  <LogOut className="h-4 w-4" /> Log out
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-full border border-slate-200 px-4 py-3 text-center text-sm font-bold text-slate-800"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-full bg-blue-600 px-4 py-3 text-center text-sm font-bold text-white"
                  >
                    Join now
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
