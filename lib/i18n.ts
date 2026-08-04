import fr from "@/messages/fr.json";
import de from "@/messages/de.json";
import en from "@/messages/en.json";
import type { Locale, TText } from "@/data/content";

export const dictionaries = { fr, de, en };

export function pick<T extends TText | undefined>(text: T, locale: Locale = "fr") {
  if (!text) return "";
  return text[locale] ?? text.fr ?? "";
}

export function normalizeLocale(value: unknown): Locale {
  return value === "de" || value === "en" ? value : "fr";
}
