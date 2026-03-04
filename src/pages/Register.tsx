import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Crosshair } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Register = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(var(--secondary)/0.06)_0%,_transparent_70%)]" />
      <div className="w-full max-w-md p-8 relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Crosshair className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display text-sm font-bold tracking-tight">CS2 EDGE AI</span>
          </Link>
          <h1 className="text-2xl font-bold">{t("auth.createAccount")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("auth.startPredicting")}</p>
        </div>

        <div className="rounded-2xl bg-card border border-border p-6 space-y-4">
          <Button variant="outline" className="w-full">
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            {t("auth.google")}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="neon-line" /></div>
            <div className="relative flex justify-center"><span className="bg-card px-3 text-xs text-muted-foreground">{t("auth.or")}</span></div>
          </div>

          {[
            { id: "username", label: t("auth.username"), type: "text", placeholder: "cs2pro" },
            { id: "email", label: t("auth.email"), type: "email", placeholder: "you@example.com" },
            { id: "password", label: t("auth.password"), type: "password", placeholder: "••••••••" },
            { id: "confirm", label: t("auth.confirmPassword"), type: "password", placeholder: "••••••••" },
          ].map((f) => (
            <div key={f.id} className="space-y-2">
              <Label htmlFor={f.id}>{f.label}</Label>
              <Input id={f.id} type={f.type} placeholder={f.placeholder} value={form[f.id as keyof typeof form]} onChange={(e) => update(f.id, e.target.value)} />
            </div>
          ))}

          <Button className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground" onClick={() => window.location.href = "/dashboard"}>
            {t("auth.createAccount")}
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {t("auth.hasAccount")}{" "}
          <Link to="/login" className="text-primary hover:underline">{t("auth.signIn")}</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
