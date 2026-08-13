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

function ProfileMenu({
  user,
  avatar,
  onAvatarError,
}: {
  user: { id?: string | null; name?: string | null; email?: string | null };
  avatar: string | null;
  onAvatarError: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeMenu = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);

  const profileHref = user.id ? `/profile/${user.id}` : "/profile/complete";

  const accountLinks = [
    { label: "My profile", href: profileHref, icon: UserRound },
    { label: "Edit profile", href: "/profile/complete", icon: Settings },
    { label: "Swap center", href: "/dashboard", icon: MessageCircleMore },
    { label: "Sessions", href: "/sessions", icon: CalendarDays },
    { label: "Reviews & badges", href: "/reputation", icon: Award },
  ];

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    setOpen(false);
    await signOut({ redirectTo: "/" });
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((open) => !open)}
        aria-expanded={open}
        aria-label="Open account menu"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white p-1 shadow-sm transition hover:border-blue-200 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        {avatar ? (
          <img
            src={avatar}
            alt={user.name || "Profile"}
            className="h-9 w-9 rounded-full object-cover"
            onError={onAvatarError}
          />
        ) : (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-xs font-black text-white">
            {initials(user.name)}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
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
                    onClick={() => setOpen(false)}
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
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex w-full items-center gap-3 border-t border-slate-100 px-3 py-3 text-sm font-bold text-rose-600 transition hover:bg-rose-50"
            >
              <LogOut className="h-4 w-4" />
              {loggingOut ? "Logging out..." : "Log out"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileAvatar, setProfileAvatar] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    if (status !== "authenticated") return;

    fetch("/api/profile")
      .then((response) => response.json())
      .then((result) => setProfileAvatar(result.data?.avatar || null))
      .catch(() => setProfileAvatar(null));
  }, [pathname, status]);

  const user = session?.user;
  const avatar = status === "authenticated" ? profileAvatar || user?.image : null;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-6 lg:h-20 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 rounded-full border border-slate-200/80 bg-slate-50/80 p-1.5 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className={`rounded-full px-4 py-2 text-sm font-bold transition hover:bg-white hover:text-blue-600 hover:shadow-sm ${pathname === item.href ? "bg-white text-blue-600 shadow-sm" : "text-slate-600"}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden min-w-[190px] items-center justify-end gap-3 lg:flex">
          {status === "loading" ? (
            <div className="h-11 w-32 animate-pulse rounded-full bg-slate-100" />
          ) : user ? (
            <ProfileMenu
              user={user}
              avatar={avatar}
              onAvatarError={() => setProfileAvatar(null)}
            />
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

        <div className="flex items-center gap-2 lg:hidden">
          {status === "loading" ? (
            <div className="h-11 w-11 animate-pulse rounded-full bg-slate-100" />
          ) : user ? (
            <ProfileMenu
              user={user}
              avatar={avatar}
              onAvatarError={() => setProfileAvatar(null)}
            />
          ) : (
            <Link
              href="/auth/login"
              aria-label="Log in"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-900 shadow-sm"
            >
              <UserRound className="h-5 w-5" />
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-900 shadow-sm"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            className="mx-4 mb-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl lg:hidden"
          >
            <nav className="flex flex-col">
              {navigation.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={`rounded-2xl px-4 py-3 text-sm font-bold transition hover:bg-blue-50 hover:text-blue-600 ${pathname === item.href ? "bg-blue-50 text-blue-600" : "text-slate-700"}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
