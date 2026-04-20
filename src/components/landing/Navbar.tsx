import { Link } from "react-router-dom";
import { useLanguage, languages } from "@/contexts/LanguageContext";
import { Globe, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
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
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header className="fixed top-0 z-50 w-full px-4 pt-3 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <nav
          className="rounded-xl border border-white/[0.06] px-4 py-2.5 sm:px-5 transition-colors duration-300"
          style={{
            background: scrolled ? "rgba(5,5,5,0.85)" : "rgba(5,5,5,0.5)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
          aria-label="Main navigation"
        >
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 focus-ring rounded-lg" aria-label="CS2Edge home">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[hsl(221,83%,58%)] text-white text-xs font-bold">
                C
              </div>
              <span className="font-landing-display text-sm text-white">CS2Edge</span>
            </Link>

            {/* Desktop links */}
            <div className="hidden items-center gap-6 lg:flex">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-[13px] font-medium text-white/[0.45] transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden items-center gap-2 lg:flex">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg border border-white/[0.06] bg-transparent text-white/[0.45] hover:bg-white/[0.04] hover:text-white"
                    aria-label="Change language"
                  >
                    <Globe className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="max-h-64 overflow-y-auto scrollbar-thin">
                  {languages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={language === lang.code ? "text-primary font-medium" : ""}
                    >
                      {lang.nativeName}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link
                to="/login"
                className="rounded-lg px-3.5 py-2 text-[13px] font-medium text-white/[0.55] transition-colors hover:text-white"
              >
                Sign in
              </Link>

              <Link
                to="/register"
                className="landing-primary-button rounded-lg px-4 py-2 text-[13px] font-semibold"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              type="button"
              onClick={() => setIsMenuOpen((v) => !v)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] text-white lg:hidden"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>

          {/* Mobile drawer */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden lg:hidden"
              >
                <div className="mt-3 space-y-3 border-t border-white/[0.06] pt-3">
                  {links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block rounded-lg px-3 py-2.5 text-[13px] font-medium text-white/[0.55] hover:bg-white/[0.04] hover:text-white"
                    >
                      {link.label}
                    </a>
                  ))}
                  <div className="flex gap-2 pt-1">
                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex-1 rounded-lg border border-white/[0.08] py-2.5 text-center text-[13px] font-medium text-white/[0.55]">
                      Sign in
                    </Link>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)} className="landing-primary-button flex-1 rounded-lg py-2.5 text-center text-[13px] font-semibold">
                      Get Started
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
