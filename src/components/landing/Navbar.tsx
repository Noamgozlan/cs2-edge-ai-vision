import { Link } from "react-router-dom";
import { useLanguage, languages } from "@/contexts/LanguageContext";
import { Globe, Menu, X, Zap } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import gozlanLogo from "@/assets/gozlan-logo.png";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const links = [
  { href: "#features", label: "Features" },
  { href: "#workflow", label: "How It Works" },
  { href: "#predictions", label: "Preview" },
  { href: "#pricing", label: "Pricing" },
];

const Navbar = () => {
  const { language, setLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header className="fixed top-0 z-50 w-full px-4 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          animate={{
            background: scrolled
              ? "rgba(5,5,5,0.88)"
              : "rgba(5,5,5,0.55)",
            borderColor: scrolled
              ? "rgba(255,255,255,0.1)"
              : "rgba(255,255,255,0.06)",
          }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl border px-4 py-3 sm:px-5"
          style={{ backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}
        >
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded-xl">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#6b8cff] to-[#4d7cff]">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="font-landing-display text-sm font-semibold text-white tracking-tight">Gozlan BETS</p>
                <p className="text-[10px] font-medium text-white/40">CS2 trading intelligence</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-white/50 transition-colors duration-200 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden items-center gap-2 lg:flex">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-xl border border-white/10 bg-white/4 text-white/60 hover:bg-white/8 hover:text-white"
                    aria-label="Change language"
                  >
                    <Globe className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="max-h-64 overflow-y-auto scrollbar-thin bg-[#0a0a0a] border-white/10">
                  {languages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={language === lang.code ? "text-[#6b8cff] font-medium" : "text-white/60"}
                    >
                      {lang.nativeName}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link
                to="/login"
                className="rounded-xl px-4 py-2 text-sm font-medium text-white/55 transition-colors hover:text-white"
              >
                Sign in
              </Link>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/register"
                  className="relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#6b8cff] to-[#4d7cff] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(77,124,255,0.35)] transition-shadow hover:shadow-[0_0_32px_rgba(77,124,255,0.5)]"
                >
                  Get Started
                </Link>
              </motion.div>
            </div>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setIsMenuOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/4 text-white lg:hidden"
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile drawer */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-4 space-y-4 border-t border-white/8 pt-4 lg:hidden">
                  <nav className="grid gap-1" aria-label="Mobile navigation">
                    {links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="rounded-xl px-3 py-3 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
                      >
                        {link.label}
                      </a>
                    ))}
                  </nav>
                  <div className="flex items-center gap-2">
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-center text-sm font-semibold text-white/60"
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex-1 rounded-xl bg-gradient-to-r from-[#6b8cff] to-[#4d7cff] px-4 py-3 text-center text-sm font-semibold text-white shadow-[0_0_20px_rgba(77,124,255,0.35)]"
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </header>
  );
};

export default Navbar;
