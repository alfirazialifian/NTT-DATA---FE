import { useLayoutEffect } from "react";
import { usePreferencesStore } from "../stores/preferencesStore";

export default function ThemeSync() {
  const locale = usePreferencesStore((state) => state.locale);
  const theme = usePreferencesStore((state) => state.theme);

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.lang = locale;
    root.style.colorScheme = theme;

    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#0f171d" : "#f7f8fa");
  }, [locale, theme]);

  return null;
}
