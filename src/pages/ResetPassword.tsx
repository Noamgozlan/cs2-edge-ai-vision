import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Eye, EyeOff, Loader2, Crosshair } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Supabase auto-handles the recovery token in the URL hash and emits a SIGNED_IN / PASSWORD_RECOVERY event.
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setReady(true);
      }
    });
    // Also check existing session in case event already fired
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: "Password too short", description: "Use at least 6 characters.", variant: "destructive" });
      return;
    }
    if (password !== confirm) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Password updated", description: "You can now sign in with your new password." });
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border px-6 md:px-10 py-4">
        <Link to="/" className="flex items-center gap-3">
          <Crosshair className="w-7 h-7 text-primary" />
          <span className="text-xl font-bold tracking-tight">CS2 Edge AI</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[480px] space-y-6">
          <div className="text-center space-y-2 mb-4">
            <h1 className="text-4xl font-black tracking-tight">Reset Password</h1>
            <p className="text-muted-foreground">
              {ready ? "Choose a new password for your account." : "Validating reset link…"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1">New Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="flex w-full rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 h-14 pl-12 pr-12 text-base outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1">Confirm Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  className="flex w-full rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 h-14 pl-12 pr-4 text-base outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !ready}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading ? "Updating…" : "Update Password"}
            </button>

            <div className="text-center">
              <Link to="/login" className="text-sm text-primary hover:underline">Back to login</Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ResetPassword;
