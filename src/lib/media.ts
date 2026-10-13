import type { Lang } from '@/i18n/ui';

export type MediaType = 'book' | 'screen' | 'music' | 'game';
export type MediaTone = 'blue' | 'yellow' | 'pink' | 'green';

/** 中文书名号只用于中文；英文直接显示标题。 */
export const formatMediaTitle = (title: string, mediaType?: MediaType, lang: Lang = 'zh'): string =>
  mediaType === 'book' && lang === 'zh' ? `《${title}》` : title;

export const getMediaTone = (tone?: MediaTone): MediaTone => tone ?? 'blue';

export const formatWordCount = (count?: number, lang: Lang = 'zh'): string | undefined => {
  if (!count) return undefined;
  if (lang === 'en') {
    return count >= 10_000 ? `~${Math.round(count / 1_000)}k words` : `${count.toLocaleString('en-US')} words`;
  }
  if (count >= 10_000) return `约 ${Math.round(count / 10_000)} 万字`;
  return `${count.toLocaleString('zh-CN')} 字`;
};
