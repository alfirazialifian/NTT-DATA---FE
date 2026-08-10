import { Languages, Moon, Sun } from "lucide-react";
import { useTranslation } from "../i18n/useTranslation";
import { classNames } from "../lib/classNames";
import { usePreferencesStore } from "../stores/preferencesStore";

export default function PreferenceControls({ floating = false }) {
  const { locale, t, toggleLocale } = useTranslation();
  const theme = usePreferencesStore((state) => state.theme);
  const toggleTheme = usePreferencesStore((state) => state.toggleTheme);
  const nextLanguageLabel =
    locale === "en"
      ? t("preferences.switchToIndonesian")
      : t("preferences.switchToEnglish");
  const nextThemeLabel =
    theme === "light"
      ? t("preferences.switchToDark")
      : t("preferences.switchToLight");

  return (
    <div
      className={classNames(
        "preference-controls",
        floating && "preference-controls--floating",
      )}
    >
      <button
        aria-label={nextLanguageLabel}
        className="preference-button preference-button--language"
        onClick={toggleLocale}
        title={nextLanguageLabel}
        type="button"
      >
        <Languages aria-hidden="true" />
        <span>{locale.toUpperCase()}</span>
      </button>
      <button
        aria-label={nextThemeLabel}
        aria-pressed={theme === "dark"}
        className={classNames(
          "preference-button",
          "preference-button--theme",
          theme === "dark" && "is-active",
        )}
        onClick={toggleTheme}
        title={nextThemeLabel}
        type="button"
      >
        {theme === "light" ? (
          <Moon aria-hidden="true" />
        ) : (
          <Sun aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
