import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { getAuthRedirectUrl } from "@/lib/auth";

const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
    else navigate("/dashboard");
  };

  const handleGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: getAuthRedirectUrl(),
        queryParams: {
          access_type: "offline",
          prompt: "select_account",
        },
      },
    });
    if (error) toast({ title: "Google sign in failed", description: String(error), variant: "destructive" });
  };

  const handleForgotPassword = async () => {
    const targetEmail = email.trim() || window.prompt("Enter your email to reset your password:")?.trim() || "";
    if (!targetEmail) {
      toast({ title: "Email required", description: "Please enter your email address first.", variant: "destructive" });
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(targetEmail, {
      redirectTo: getAuthRedirectUrl("/reset-password"),
    });
    if (error) toast({ title: "Reset failed", description: error.message, variant: "destructive" });
    else toast({ title: "Check your email", description: `Reset link sent to ${targetEmail}.` });
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left panel – branding */}
      <div className="hidden lg:flex lg:flex-col lg:w-[420px] xl:w-[480px] bg-card border-r border-border p-12 flex-shrink-0">
        <Link to="/" className="flex items-center gap-2.5 mb-auto">
          <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center text-white text-sm font-bold">G</div>
          <span className="text-base font-semibold">Gozlan Bets</span>
        </Link>

        <div className="mb-auto">
          <blockquote className="text-2xl font-medium tracking-tight text-foreground leading-snug mb-6">
            "The edge isn't in luck.<br />It's in information."
          </blockquote>
          <div className="space-y-4">
            {[
              { label: "Match Win Rate", value: "73.2%", desc: "across analyzed matches" },
              { label: "Data Sources", value: "Live HLTV", desc: "real-time feed" },
              { label: "Markets Covered", value: "12+", desc: "per match" },
            ].map(s => (
              <div key={s.label} className="flex items-start gap-4">
                <div className="w-px h-8 bg-border flex-shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold font-mono-data">{s.value}</span>
                    <span className="text-xs text-muted-foreground">{s.desc}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground/50">© 2025 Gozlan Bets. All rights reserved.</p>
      </div>

      {/* Right panel – form */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-border lg:hidden">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-white text-xs font-bold">G</div>
            <span className="text-sm font-semibold">Gozlan Bets</span>
          </Link>
          <Link to="/register" className="text-sm font-medium text-primary">Create account</Link>
        </header>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[400px] space-y-5"
          >
            {/* Header */}
            <div className="space-y-1.5 mb-7">
              <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
              <p className="text-sm text-muted-foreground">Sign in to your account to continue.</p>
            </div>

            {/* Google */}
            <button
              onClick={handleGoogle}
              className="flex w-full items-center justify-center gap-2.5 rounded-md h-10 bg-card border border-border text-sm font-medium text-foreground transition-all hover:bg-muted pressable focus-ring"
            >
              <GoogleIcon />
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">or</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium" htmlFor="email">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="flex w-full rounded-md bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 h-10 pl-9 pr-3 text-sm transition-all outline-none placeholder:text-muted-foreground/60"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium" htmlFor="password">Password</label>
                  <button type="button" onClick={handleForgotPassword} className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="flex w-full rounded-md bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 h-10 pl-9 pr-9 text-sm transition-all outline-none placeholder:text-muted-foreground/60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2.5 rounded-md transition-all pressable flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm focus-ring"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                {loading ? "Signing in…" : "Sign in"}
              </button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary font-medium hover:text-primary/80 transition-colors">Create one</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
