"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, LogOut, LayoutDashboard, Shield } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { LOCALES, type Locale, getLocaleLabel } from "@/lib/locale";

const NAV_LINKS = [
  { label: "Training", href: "/training" },
  { label: "Jobs", href: "/jobs" },
  { label: "Tools", href: "/tools" },
  { label: "Find Plumber", href: "/find-plumber" },
  { label: "Support", href: "/support" },
];

const MORE_LINKS = [
  { label: "Community", href: "/community" },
  { label: "Health & Safety", href: "/health-safety" },
  { label: "Brands", href: "/brands" },
  { label: "About", href: "/about" },
  { label: "Dashboard", href: "/dashboard" },
];

const LANGUAGES = LOCALES.filter((code) => code !== "en").map((code) => ({
  code,
  label: code.toUpperCase(),
  name: getLocaleLabel(code as Locale),
}));

function localeHref(code: string): string {
  return code === "en" ? "/" : `/${code}`;
}

function activeLocaleFromPath(pathname: string): string {
  const segment = pathname.split("/")[1];
  if (segment && LOCALES.includes(segment as Locale) && segment !== "en") {
    return segment;
  }
  return "en";
}

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const activeLangCode = activeLocaleFromPath(pathname);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const langButtonLabel =
    activeLangCode === "en" ? "EN" : activeLangCode.toUpperCase();

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white shadow-md dark:bg-gray-900"
            : "bg-white dark:bg-gray-900"
        }`}
      >
        <div className="container-pg">
          <div className="flex h-16 items-center justify-between gap-4">
            <Logo
              priority
              imageClassName="h-14 max-w-none sm:h-[3.75rem] lg:h-16"
            />

            <nav
              className="hidden lg:flex items-center gap-0.5"
              aria-label="Main navigation"
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-2.5 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-[#F97316] hover:bg-orange-50 transition-colors dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  {link.label}
                </Link>
              ))}

              <div className="relative">
                <button
                  onClick={() => setMoreOpen((v) => !v)}
                  className="flex items-center gap-0.5 px-2.5 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-[#F97316] hover:bg-orange-50 transition-colors dark:text-gray-200 dark:hover:bg-gray-800"
                  aria-haspopup="menu"
                  aria-expanded={moreOpen}
                >
                  More
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <AnimatePresence>
                  {moreOpen && (
                    <motion.ul
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 mt-1 w-48 rounded-lg border border-gray-100 bg-white py-1 shadow-lg dark:bg-gray-900 dark:border-gray-700 z-50"
                      onMouseLeave={() => setMoreOpen(false)}
                    >
                      {MORE_LINKS.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            onClick={() => setMoreOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#F97316] dark:text-gray-200 dark:hover:bg-gray-800"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setLangOpen((v) => !v)}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 rounded-md border border-gray-200 hover:border-orange-300 hover:text-[#F97316] transition-colors dark:text-gray-200 dark:border-gray-700"
                  aria-haspopup="listbox"
                  aria-expanded={langOpen}
                >
                  {langButtonLabel}
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <AnimatePresence>
                  {langOpen && (
                    <motion.ul
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      role="listbox"
                      className="absolute right-0 mt-1 w-40 rounded-lg border border-gray-100 bg-white py-1 shadow-lg dark:bg-gray-900 dark:border-gray-700"
                    >
                      <li>
                        <Link
                          href="/"
                          onClick={() => setLangOpen(false)}
                          className={`block w-full px-4 py-2 text-left text-sm hover:bg-orange-50 hover:text-[#F97316] dark:hover:bg-gray-800 ${
                            activeLangCode === "en"
                              ? "text-[#F97316] font-medium"
                              : "text-gray-700 dark:text-gray-200"
                          }`}
                        >
                          EN — English
                        </Link>
                      </li>
                      {LANGUAGES.map((lang) => (
                        <li key={lang.code}>
                          <Link
                            href={localeHref(lang.code)}
                            onClick={() => setLangOpen(false)}
                            className={`block w-full px-4 py-2 text-left text-sm hover:bg-orange-50 hover:text-[#F97316] dark:hover:bg-gray-800 ${
                              activeLangCode === lang.code
                                ? "text-[#F97316] font-medium"
                                : "text-gray-700 dark:text-gray-200"
                            }`}
                          >
                            {lang.label} — {lang.name}
                          </Link>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>

              <Link
                href="/training"
                className="px-4 py-2 text-sm font-semibold text-white rounded-lg bg-[#F97316] hover:bg-[#ea580c] transition-colors shadow-sm"
              >
                Explore
              </Link>

              <div className="relative">
                <button
                  onClick={() => setAccountOpen((v) => !v)}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 rounded-md border border-gray-200 hover:border-orange-300 hover:text-[#F97316] transition-colors dark:text-gray-200 dark:border-gray-700"
                  aria-haspopup="menu"
                  aria-expanded={accountOpen}
                >
                  Account
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <AnimatePresence>
                  {accountOpen && (
                    <motion.ul
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-1 w-48 rounded-lg border border-gray-100 bg-white py-1 shadow-lg dark:bg-gray-900 dark:border-gray-700 z-50"
                      onMouseLeave={() => setAccountOpen(false)}
                    >
                      {status === "authenticated" ? (
                        <>
                          <li className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                              {session?.user?.name || "My Profile"}
                            </p>
                            {session?.user?.phone ? (
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {session.user.phone}
                              </p>
                            ) : null}
                          </li>
                          <li>
                            <Link
                              href="/dashboard"
                              onClick={() => setAccountOpen(false)}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#F97316] dark:text-gray-200 dark:hover:bg-gray-800"
                            >
                              <LayoutDashboard className="w-4 h-4" />
                              Dashboard
                            </Link>
                          </li>
                          {session?.user?.role === "admin" ? (
                            <li>
                              <Link
                                href="/admin"
                                onClick={() => setAccountOpen(false)}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#F97316] dark:text-gray-200 dark:hover:bg-gray-800"
                              >
                                <Shield className="w-4 h-4" />
                                Admin
                              </Link>
                            </li>
                          ) : null}
                          <li>
                            <button
                              type="button"
                              onClick={() => {
                                setAccountOpen(false);
                                signOut({ callbackUrl: "/" });
                              }}
                              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                            >
                              <LogOut className="w-4 h-4" />
                              Logout
                            </button>
                          </li>
                        </>
                      ) : (
                        <>
                          <li>
                            <Link
                              href="/auth/login"
                              onClick={() => setAccountOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#F97316] dark:text-gray-200 dark:hover:bg-gray-800"
                            >
                              Login
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/auth/register"
                              onClick={() => setAccountOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#F97316] dark:text-gray-200 dark:hover:bg-gray-800"
                            >
                              Register
                            </Link>
                          </li>
                        </>
                      )}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <button
              className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-orange-50 hover:text-[#F97316] transition-colors dark:text-gray-200 dark:hover:bg-gray-800"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            className="fixed inset-0 z-40 bg-white dark:bg-gray-900 flex flex-col pt-16 lg:hidden overflow-y-auto"
          >
            <nav className="flex flex-col px-6 pt-6 gap-1 flex-1">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-lg font-medium text-gray-800 rounded-xl hover:bg-orange-50 hover:text-[#F97316] transition-colors dark:text-gray-100 dark:hover:bg-gray-800"
              >
                Home
              </Link>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-lg font-medium text-gray-800 rounded-xl hover:bg-orange-50 hover:text-[#F97316] transition-colors dark:text-gray-100 dark:hover:bg-gray-800"
                >
                  {link.label}
                </Link>
              ))}
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider px-4 mt-4 mb-1">
                More
              </p>
              {MORE_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-lg font-medium text-gray-800 rounded-xl hover:bg-orange-50 hover:text-[#F97316] transition-colors dark:text-gray-100 dark:hover:bg-gray-800"
                >
                  {link.label}
                </Link>
              ))}

              <div className="mt-4 border-t border-gray-100 dark:border-gray-800 pt-4">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider px-4 mb-2">
                  Language
                </p>
                <div className="flex flex-wrap gap-2 px-4">
                  <Link
                    href="/"
                    onClick={() => setMobileOpen(false)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      activeLangCode === "en"
                        ? "bg-[#F97316] text-white border-[#F97316]"
                        : "border-gray-200 text-gray-700 dark:border-gray-700 dark:text-gray-200"
                    }`}
                  >
                    EN
                  </Link>
                  {LANGUAGES.map((lang) => (
                    <Link
                      key={lang.code}
                      href={localeHref(lang.code)}
                      onClick={() => setMobileOpen(false)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        activeLangCode === lang.code
                          ? "bg-[#F97316] text-white border-[#F97316]"
                          : "border-gray-200 text-gray-700 dark:border-gray-700 dark:text-gray-200"
                      }`}
                    >
                      {lang.label}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>

            <div className="px-6 pb-8 flex flex-col gap-3">
              <Link
                href="/training"
                onClick={() => setMobileOpen(false)}
                className="w-full py-3 text-center text-base font-semibold rounded-xl bg-[#F97316] text-white hover:bg-[#ea580c] transition-colors shadow-sm"
              >
                Explore
              </Link>
              {status === "authenticated" ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="w-full py-3 text-center text-base font-medium rounded-xl border border-gray-200 text-gray-700 hover:border-orange-300 hover:text-[#F97316] transition-colors dark:border-gray-700 dark:text-gray-200"
                  >
                    Dashboard
                  </Link>
                  {session?.user?.role === "admin" ? (
                    <Link
                      href="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="w-full py-3 text-center text-base font-medium rounded-xl border border-gray-200 text-gray-700 hover:border-orange-300 hover:text-[#F97316] transition-colors dark:border-gray-700 dark:text-gray-200"
                    >
                      Admin
                    </Link>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="w-full py-3 text-center text-base font-medium rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileOpen(false)}
                    className="w-full py-3 text-center text-base font-medium rounded-xl border border-gray-200 text-gray-700 hover:border-orange-300 hover:text-[#F97316] transition-colors dark:border-gray-700 dark:text-gray-200"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setMobileOpen(false)}
                    className="w-full py-3 text-center text-base font-medium rounded-xl border border-gray-200 text-gray-700 hover:border-orange-300 hover:text-[#F97316] transition-colors dark:border-gray-700 dark:text-gray-200"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-16" aria-hidden="true" />
    </>
  );
}
