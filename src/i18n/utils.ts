import { defaultLang, ui, type Lang, type TranslationKey } from './ui';

/** 从当前 URL 推断语言（默认 zh，英文走 /en 前缀）。 */
export const getLangFromUrl = (url: URL): Lang => {
  const segment = url.pathname.split('/').filter(Boolean)[0];
  return segment === 'en' ? 'en' : defaultLang;
};

export const isLang = (value: string | undefined): value is Lang => value === 'zh' || value === 'en';

/** 给给定路径加上语言前缀（默认语言不带前缀）。 */
export const localizePath = (path: string, lang: Lang): string => {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (lang === defaultLang) return clean;
  return clean === '/' ? `/${lang}/` : `/${lang}${clean}`;
};

/** 在 zh / en 之间切换当前页面路径。 */
export const switchLangPath = (pathname: string, lang: Lang): string => {
  const stripped = pathname.replace(/^\/en(?=\/|$)/, '') || '/';
  return localizePath(stripped, lang);
};

/** 返回 t(key, params)，缺失的 key 回退到默认语言。 */
export const useTranslations =
  (lang: Lang) =>
  (key: TranslationKey, params?: Record<string, string | number>): string => {
    const dict = (ui[lang] ?? ui[defaultLang]) as Record<string, string>;
    let value = dict[key] ?? (ui[defaultLang][key] as string) ?? key;
    if (params) {
      for (const [name, replacement] of Object.entries(params)) {
        value = value.replaceAll(`{${name}}`, String(replacement));
      }
    }
    return value;
  };
