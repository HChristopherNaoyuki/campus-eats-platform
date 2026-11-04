import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { useI18n } from "@/i18n";

/** Light / dark toggle shared by the public header and the dashboard header. */
export default function ThemeToggle({ className = "" }: { className?: string })
{
  const { theme, toggle } = useTheme();
  const { t } = useI18n();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={`shrink-0 ${className}`}
      aria-label={theme === "dark" ? t("mkt.polish.lightMode") : t("mkt.polish.darkMode")}
      title={theme === "dark" ? t("mkt.polish.lightMode") : t("mkt.polish.darkMode")}
      onClick={toggle}
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
