import fr from "@/messages/fr.json";
import type { Locale, TText } from "@/data/content";

export const dictionaries = { fr };

export function pick<T extends TText | undefined>(text: T, locale: Locale = "fr") {
  if (!text) return "";
  return text[locale] ?? text.fr ?? "";
}

export function normalizeLocale(value: unknown): Locale {
  return "fr";
}
