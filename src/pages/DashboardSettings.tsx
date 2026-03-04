import { useState, useEffect } from "react";
import { useLanguage, languages } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useTimezone } from "@/contexts/TimezoneContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  User, Globe, Sun, Moon, Clock, Shield, Bell, Palette,
  Crown, CreditCard, LogOut, Trash2, Save, Check, ChevronRight,
  Monitor, Eye, EyeOff, Mail, Lock, Key
} from "lucide-react";

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } } };

const DashboardSettings = () => {
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { timezone, setTimezone, timezones, timezoneLabel } = useTimezone();
  const { isPro, subscriptionEnd, openCheckout, openPortal } = useSubscription();

  // Profile state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");

  // Notification prefs (local storage)
  const [notifHighValue, setNotifHighValue] = useState(() => localStorage.getItem("cs2-notif-hv") !== "false");
  const [notifOddsShift, setNotifOddsShift] = useState(() => localStorage.getItem("cs2-notif-odds") !== "false");
  const [notifMatchStart, setNotifMatchStart] = useState(() => localStorage.getItem("cs2-notif-match") !== "false");
  const [notifResults, setNotifResults] = useState(() => localStorage.getItem("cs2-notif-results") !== "false");

  // Display prefs
  const [oddsFormat, setOddsFormat] = useState(() => localStorage.getItem("cs2-odds-format") || "decimal");
  const [compactMode, setCompactMode] = useState(() => localStorage.getItem("cs2-compact") === "true");
  const [showConfidence, setShowConfidence] = useState(() => localStorage.getItem("cs2-show-conf") !== "false");

  // Bankroll settings
  const [startingBankroll, setStartingBankroll] = useState(() => localStorage.getItem("cs2-bankroll") || "10000");
  const [kellyFraction, setKellyFraction] = useState(() => localStorage.getItem("cs2-kelly") || "0.25");
  const [riskAlertThreshold, setRiskAlertThreshold] = useState(() => localStorage.getItem("cs2-risk-threshold") || "20");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setEmail(user.email || "");
      const { data } = await supabase.from("profiles").select("username").eq("id", user.id).single();
      if (data) setUsername(data.username || "");
    }
  }

  async function saveProfile() {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");
      const { error } = await supabase.from("profiles").update({ username } as any).eq("id", user.id);
      if (error) throw error;
      toast.success("Profile updated");
    } catch (e: any) {
      toast.error(e.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  function saveNotifPrefs() {
    localStorage.setItem("cs2-notif-hv", String(notifHighValue));
    localStorage.setItem("cs2-notif-odds", String(notifOddsShift));
    localStorage.setItem("cs2-notif-match", String(notifMatchStart));
    localStorage.setItem("cs2-notif-results", String(notifResults));
    toast.success("Notification preferences saved");
  }

  function saveDisplayPrefs() {
    localStorage.setItem("cs2-odds-format", oddsFormat);
    localStorage.setItem("cs2-compact", String(compactMode));
    localStorage.setItem("cs2-show-conf", String(showConfidence));
    toast.success("Display preferences saved");
  }

  function saveBankrollSettings() {
    localStorage.setItem("cs2-bankroll", startingBankroll);
    localStorage.setItem("cs2-kelly", kellyFraction);
    localStorage.setItem("cs2-risk-threshold", riskAlertThreshold);
    toast.success("Bankroll settings saved");
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  async function handlePasswordReset() {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      toast.success("Password reset email sent");
    } catch (e: any) {
      toast.error(e.message || "Failed to send reset email");
    }
  }

  const sections = [
    { id: "profile", label: "Profile", icon: User },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "timezone", label: "Time & Region", icon: Clock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "display", label: "Display", icon: Monitor },
    { id: "bankroll", label: "Bankroll", icon: CreditCard },
    { id: "subscription", label: "Subscription", icon: Crown },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <motion.div className="max-w-5xl space-y-6" variants={stagger} initial="hidden" animate="show">
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          {t("settings.title")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{t("settings.subtitle")}</p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Nav */}
        <motion.nav variants={fadeUp} className="lg:w-56 flex-shrink-0">
          <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0" style={{ scrollbarWidth: "none" }}>
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeSection === s.id
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <s.icon className="w-4 h-4" />
                {s.label}
              </button>
            ))}
          </div>
        </motion.nav>

        {/* Content */}
        <motion.div variants={fadeUp} className="flex-1 space-y-5">

          {/* Profile */}
          {activeSection === "profile" && (
            <SettingsCard title="Profile" description="Manage your account information">
              <div className="space-y-4">
                <Field label="Username">
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm border border-border focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-colors"
                    placeholder="Your username"
                  />
                </Field>
                <Field label="Email">
                  <input
                    value={email}
                    disabled
                    className="w-full bg-muted/50 rounded-lg px-3 py-2.5 text-sm border border-border text-muted-foreground cursor-not-allowed"
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">Email cannot be changed</p>
                </Field>
                <button
                  onClick={saveProfile}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-md shadow-primary/20 disabled:opacity-50"
                >
                  {saving ? <Save className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  {saving ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </SettingsCard>
          )}

          {/* Appearance */}
          {activeSection === "appearance" && (
            <SettingsCard title="Appearance" description="Customize the look and feel">
              <div className="space-y-5">
                <Field label="Theme">
                  <div className="flex gap-3">
                    {([
                      { value: "dark" as const, icon: Moon, label: "Dark" },
                      { value: "light" as const, icon: Sun, label: "Light" },
                    ]).map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setTheme(opt.value)}
                        className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-bold transition-all flex-1 ${
                          theme === opt.value
                            ? "bg-primary/10 text-primary border-2 border-primary/30"
                            : "bg-card border-2 border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <opt.icon className="w-4 h-4" />
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Language">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={`px-3 py-2.5 rounded-lg text-xs font-bold transition-all text-left ${
                          language === lang.code
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "bg-card border border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <span className="block">{lang.nativeName}</span>
                        <span className="block text-[10px] opacity-60">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
            </SettingsCard>
          )}

          {/* Timezone */}
          {activeSection === "timezone" && (
            <SettingsCard title="Time & Region" description="Set your timezone for match times">
              <Field label="Timezone">
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm border border-border focus:border-primary outline-none transition-colors"
                >
                  {timezones.map((tz) => (
                    <option key={tz.value} value={tz.value}>{tz.label}</option>
                  ))}
                </select>
                <p className="text-[10px] text-muted-foreground mt-1.5">
                  Currently: <span className="font-bold text-foreground">{timezoneLabel}</span> — all match times will be displayed in this timezone
                </p>
              </Field>
            </SettingsCard>
          )}

          {/* Notifications */}
          {activeSection === "notifications" && (
            <SettingsCard title="Notifications" description="Choose what alerts you want to receive">
              <div className="space-y-3">
                <Toggle label="High-value bet alerts" description="Get notified when AI finds bets with >75% confidence" checked={notifHighValue} onChange={setNotifHighValue} />
                <Toggle label="Odds movement alerts" description="Alert when odds shift significantly before a match" checked={notifOddsShift} onChange={setNotifOddsShift} />
                <Toggle label="Match starting soon" description="Reminder 15 minutes before tracked matches" checked={notifMatchStart} onChange={setNotifMatchStart} />
                <Toggle label="Prediction results" description="Notify when tracked predictions are settled" checked={notifResults} onChange={setNotifResults} />
                <button
                  onClick={saveNotifPrefs}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
                >
                  <Check className="w-4 h-4" /> Save Preferences
                </button>
              </div>
            </SettingsCard>
          )}

          {/* Display */}
          {activeSection === "display" && (
            <SettingsCard title="Display Preferences" description="Customize how data is shown">
              <div className="space-y-4">
                <Field label="Odds Format">
                  <div className="flex gap-2">
                    {[
                      { value: "decimal", label: "Decimal (2.10)" },
                      { value: "american", label: "American (+110)" },
                      { value: "fractional", label: "Fractional (11/10)" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setOddsFormat(opt.value)}
                        className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                          oddsFormat === opt.value
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "bg-card border border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </Field>
                <Toggle label="Compact mode" description="Reduce spacing and card sizes for more data density" checked={compactMode} onChange={setCompactMode} />
                <Toggle label="Show confidence scores" description="Display AI confidence percentages on predictions" checked={showConfidence} onChange={setShowConfidence} />
                <button
                  onClick={saveDisplayPrefs}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
                >
                  <Check className="w-4 h-4" /> Save Display Settings
                </button>
              </div>
            </SettingsCard>
          )}

          {/* Bankroll */}
          {activeSection === "bankroll" && (
            <SettingsCard title="Bankroll Settings" description="Configure your money management parameters">
              <div className="space-y-4">
                <Field label="Starting Bankroll ($)">
                  <input
                    type="number"
                    value={startingBankroll}
                    onChange={(e) => setStartingBankroll(e.target.value)}
                    className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm border border-border focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-colors"
                  />
                </Field>
                <Field label="Kelly Fraction">
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0.05"
                      max="1"
                      step="0.05"
                      value={kellyFraction}
                      onChange={(e) => setKellyFraction(e.target.value)}
                      className="flex-1 accent-primary"
                    />
                    <span className="text-sm font-bold w-12 text-right">{(parseFloat(kellyFraction) * 100).toFixed(0)}%</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {parseFloat(kellyFraction) <= 0.25 ? "Conservative (recommended)" : parseFloat(kellyFraction) <= 0.5 ? "Moderate risk" : "Aggressive — high variance"}
                  </p>
                </Field>
                <Field label="Risk Alert Threshold (% drawdown)">
                  <input
                    type="number"
                    value={riskAlertThreshold}
                    onChange={(e) => setRiskAlertThreshold(e.target.value)}
                    className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm border border-border focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-colors"
                    min="5"
                    max="50"
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">Alert when bankroll drops {riskAlertThreshold}% from peak</p>
                </Field>
                <button
                  onClick={saveBankrollSettings}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
                >
                  <Check className="w-4 h-4" /> Save Bankroll Settings
                </button>
              </div>
            </SettingsCard>
          )}

          {/* Subscription */}
          {activeSection === "subscription" && (
            <SettingsCard title="Subscription" description="Manage your plan and billing">
              <div className="space-y-4">
                <div className="rounded-xl p-5 relative overflow-hidden"
                  style={{
                    background: isPro
                      ? "linear-gradient(135deg, hsl(var(--accent) / 0.1) 0%, hsl(var(--primary) / 0.05) 100%)"
                      : "linear-gradient(135deg, hsl(var(--primary) / 0.08) 0%, transparent 100%)",
                    border: isPro ? "1px solid hsl(var(--accent) / 0.2)" : "1px solid hsl(var(--border))",
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Crown className={`w-6 h-6 ${isPro ? "text-accent" : "text-primary"}`} />
                    <div>
                      <p className="font-black text-lg">{isPro ? "Pro Plan" : "Free Plan"}</p>
                      <p className="text-xs text-muted-foreground">
                        {isPro && subscriptionEnd
                          ? `Renews ${new Date(subscriptionEnd).toLocaleDateString()}`
                          : "Upgrade to unlock all features"}
                      </p>
                    </div>
                  </div>

                  {isPro ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <Feature label="Unlimited predictions" active />
                        <Feature label="Real-time HLTV data" active />
                        <Feature label="Map veto simulator" active />
                        <Feature label="Player form heatmap" active />
                        <Feature label="Bankroll manager" active />
                        <Feature label="Odds comparison" active />
                      </div>
                      <button
                        onClick={openPortal}
                        className="w-full py-2.5 rounded-lg text-sm font-bold text-foreground bg-muted hover:bg-muted/80 transition-colors"
                      >
                        Manage Subscription
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <Feature label="3 predictions/day" active />
                        <Feature label="Basic stats" active />
                        <Feature label="Unlimited predictions" />
                        <Feature label="Real-time data" />
                        <Feature label="Player heatmaps" />
                        <Feature label="Bankroll tools" />
                      </div>
                      <button
                        onClick={openCheckout}
                        className="w-full py-2.5 rounded-lg text-sm font-bold text-primary-foreground bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all shadow-md shadow-primary/20"
                      >
                        Upgrade to Pro — $19.99/mo
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </SettingsCard>
          )}

          {/* Security */}
          {activeSection === "security" && (
            <SettingsCard title="Security" description="Manage your account security">
              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Key className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-bold">Password</p>
                      <p className="text-[10px] text-muted-foreground">Send a password reset link to your email</p>
                    </div>
                  </div>
                  <button
                    onClick={handlePasswordReset}
                    className="px-3 py-2 rounded-lg text-xs font-bold bg-muted hover:bg-muted/80 text-foreground transition-colors"
                  >
                    Reset Password
                  </button>
                </div>

                <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <LogOut className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-bold">Sign Out</p>
                      <p className="text-[10px] text-muted-foreground">Sign out of your account on this device</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 rounded-lg text-xs font-bold bg-muted hover:bg-muted/80 text-foreground transition-colors"
                  >
                    Sign Out
                  </button>
                </div>

                <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Trash2 className="w-4 h-4 text-destructive" />
                    <p className="text-sm font-bold text-destructive">Danger Zone</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground mb-3">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <button className="px-3 py-2 rounded-lg text-xs font-bold bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>
            </SettingsCard>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

/* ── Reusable sub-components ── */

function SettingsCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-card p-5 sm:p-6"
    >
      <div className="mb-5">
        <h2 className="text-lg font-black">{title}</h2>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      {children}
    </motion.div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}

function Toggle({ label, description, checked, onChange }: {
  label: string; description: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-card/50 p-4">
      <div>
        <p className="text-sm font-bold">{label}</p>
        <p className="text-[10px] text-muted-foreground">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full transition-colors relative ${
          checked ? "bg-primary" : "bg-muted"
        }`}
      >
        <motion.div
          className="w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5"
          animate={{ left: checked ? 22 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );
}

function Feature({ label, active }: { label: string; active?: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      {active ? (
        <Check className="w-3 h-3 text-accent" />
      ) : (
        <Lock className="w-3 h-3 text-muted-foreground/50" />
      )}
      <span className={active ? "text-foreground" : "text-muted-foreground/50"}>{label}</span>
    </div>
  );
}

export default DashboardSettings;
