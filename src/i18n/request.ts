import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

// Supported locales
const locales = ["en", "si", "ta"];

export default getRequestConfig(async ({ requestLocale }) => {
  // Get the locale from the request
  let locale = await requestLocale;

  // Validate that the incoming `locale` parameter is valid
  if (!locale || !locales.includes(locale as any)) {
    locale = "en";
  }

  return {
    locale,
    messages: (await import(`./locales/${locale}/common.json`)).default,
  };
});
