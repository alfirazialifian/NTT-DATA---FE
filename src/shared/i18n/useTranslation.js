import { useCallback } from "react";
import { usePreferencesStore } from "../stores/preferencesStore";
import { translate } from "./translations";

export function useTranslation() {
  const locale = usePreferencesStore((state) => state.locale);
  const setLocale = usePreferencesStore((state) => state.setLocale);
  const toggleLocale = usePreferencesStore((state) => state.toggleLocale);

  const t = useCallback(
    (key, variables) => translate(locale, key, variables),
    [locale],
  );

  const localizeError = useCallback(
    (message) => {
      if (!message) return translate(locale, "errors.requestGeneric");
      if (locale === "en") return message;
      if (message.toLowerCase().includes("unable to connect")) {
        return translate(locale, "errors.connection");
      }
      return translate(locale, "errors.requestGeneric");
    },
    [locale],
  );

  return { locale, localizeError, setLocale, t, toggleLocale };
}
