import { useLanguage } from "@/contexts/LanguageContext";

const DashboardSettings = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">{t("settings.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("settings.subtitle")}</p>
      </div>
      <div className="rounded-xl bg-card border border-border p-6">
        <p className="text-muted-foreground text-sm">{t("settings.comingSoon")}</p>
      </div>
    </div>
  );
};

export default DashboardSettings;
