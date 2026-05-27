"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Wrench, Menu, X, ChevronDown } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Training", href: "/training" },
  { label: "Jobs", href: "/jobs" },
  { label: "Tools", href: "/tools" },
  { label: "Find Plumber", href: "/find-plumber" },
  { label: "Support", href: "/support" },
];

const LANGUAGES = [
  { code: "hi", label: "HI", name: "हिन्दी" },
  { code: "te", label: "TE", name: "తెలుగు" },
  { code: "ta", label: "TA", name: "தமிழ்" },
  { code: "kn", label: "KN", name: "ಕನ್ನಡ" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [activeLang, setActiveLang] = useState(LANGUAGES[0]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 shrink-0"
              aria-label="Plumber Guru Home"
            >
              <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary-500">
                <Wrench className="w-5 h-5 text-white" strokeWidth={2.5} />
              </span>
              <span className="font-bold text-xl tracking-tight text-[#F97316]">
                Plumber Guru
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-[#F97316] hover:bg-orange-50 transition-colors dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Side Controls */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setLangOpen((v) => !v)}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 rounded-md border border-gray-200 hover:border-orange-300 hover:text-[#F97316] transition-colors dark:text-gray-200 dark:border-gray-700"
                  aria-haspopup="listbox"
                  aria-expanded={langOpen}
                >
                  {activeLang.label}
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
                      className="absolute right-0 mt-1 w-36 rounded-lg border border-gray-100 bg-white py-1 shadow-lg dark:bg-gray-900 dark:border-gray-700"
                    >
                      {LANGUAGES.map((lang) => (
                        <li key={lang.code}>
                          <button
                            role="option"
                            aria-selected={activeLang.code === lang.code}
                            onClick={() => {
                              setActiveLang(lang);
                              setLangOpen(false);
                            }}
                            className={`w-full px-4 py-2 text-left text-sm hover:bg-orange-50 hover:text-[#F97316] transition-colors dark:hover:bg-gray-800 ${
                              activeLang.code === lang.code
                                ? "text-[#F97316] font-medium"
                                : "text-gray-700 dark:text-gray-200"
                            }`}
                          >
                            {lang.label} — {lang.name}
                          </button>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>

              {/* Login */}
              <Link
                href="/auth/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-[#F97316] transition-colors dark:text-gray-200"
              >
                Login
              </Link>

              {/* Register CTA */}
              <Link
                href="/auth/register"
                className="px-4 py-2 text-sm font-semibold text-white rounded-lg bg-[#F97316] hover:bg-[#ea580c] transition-colors shadow-sm"
              >
                Register as Plumber
              </Link>
            </div>

            {/* Mobile Hamburger */}
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

      {/* Mobile Full-Screen Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            className="fixed inset-0 z-40 bg-white dark:bg-gray-900 flex flex-col pt-16 lg:hidden"
          >
            <nav className="flex flex-col px-6 pt-6 gap-1 flex-1">
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

              <div className="mt-4 border-t border-gray-100 dark:border-gray-800 pt-4">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider px-4 mb-2">
                  Language
                </p>
                <div className="flex flex-wrap gap-2 px-4">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setActiveLang(lang)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        activeLang.code === lang.code
                          ? "bg-[#F97316] text-white border-[#F97316]"
                          : "border-gray-200 text-gray-700 hover:border-orange-300 dark:border-gray-700 dark:text-gray-200"
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
            </nav>

            <div className="px-6 pb-8 flex flex-col gap-3">
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
                className="w-full py-3 text-center text-base font-semibold rounded-xl bg-[#F97316] text-white hover:bg-[#ea580c] transition-colors shadow-sm"
              >
                Register as Plumber
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer to offset fixed header */}
      <div className="h-16" aria-hidden="true" />
    </>
  );
}
