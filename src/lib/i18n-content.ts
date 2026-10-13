import { getEntry, type CollectionEntry } from 'astro:content';
import type { Lang } from '@/i18n/ui';

export type Entry = CollectionEntry<'entries'>;
export type EntryEn = CollectionEntry<'entriesEn'>;

export interface LocalizedEntry {
  entry: Entry;
  title: string;
  description: string;
  /** 可选的英文覆盖，缺省回退中文 frontmatter。 */
  label?: string;
  tag?: string;
  status?: string;
  /** 英文译文条目（存在时用于渲染正文）。 */
  translation?: EntryEn;
}

const slugOf = (id: string) => id.replace(/\.md$/, '');

/**
 * 把中文条目按语言本地化：英文优先取 entriesEn 里同 id 的译文，
 * 没有译文时自动回退中文，保证增量翻译不会出现空白。
 */
export const localizeEntry = async (entry: Entry, lang: Lang): Promise<LocalizedEntry> => {
  if (lang === 'en') {
    const translation = await getEntry('entriesEn', slugOf(entry.id));
    if (translation) {
      return {
        entry,
        title: translation.data.title,
        description: translation.data.description,
        label: translation.data.label,
        tag: translation.data.tag,
        status: translation.data.status,
        translation,
      };
    }
  }
  return { entry, title: entry.data.title, description: entry.data.description };
};

export const localizeEntries = (entries: Entry[], lang: Lang): Promise<LocalizedEntry[]> =>
  Promise.all(entries.map((entry) => localizeEntry(entry, lang)));
