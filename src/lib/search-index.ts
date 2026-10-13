import { getCollection } from 'astro:content';
import type { Lang } from '@/i18n/ui';
import { localizePath } from '@/i18n/utils';
import { localizeEntries } from '@/lib/i18n-content';

export interface SearchItem {
  id: string;
  kind: string;
  title: string;
  description: string;
  tag: string;
  label: string;
  creator: string;
  status: string;
  date: string;
  url: string;
  body: string;
}

/** 内部路径按语言加前缀；外部链接原样保留。 */
const entryPath = (id: string, kind: string, demoUrl: string | undefined, lang: Lang): string => {
  const slug = id.replace(/\.md$/, '');
  if (kind === 'game') return localizePath(`/games/${slug}/`, lang);
  if (kind === 'article') return localizePath(`/articles/${slug}/`, lang);
  if (kind === 'idea') return localizePath(`/ideas/${slug}/`, lang);
  if (kind === 'project') return localizePath(`/projects/${slug}/`, lang);
  // 工具 / 收藏 / 媒体：暂时指向现有页面，外部链接保持原样。
  if (kind === 'tool') return demoUrl ?? '/tools/';
  return '/library/';
};

export const buildSearchIndex = async (lang: Lang): Promise<SearchItem[]> => {
  const entries = await getCollection('entries');
  const base = entries.filter((entry) => entry.data.kind !== 'idea-version');
  const localized = await localizeEntries(base, lang);
  return localized.map(({ entry, title, description, tag, label, status, translation }) => ({
    id: entry.id,
    kind: entry.data.kind,
    title,
    description,
    tag: tag ?? entry.data.tag ?? '',
    label: label ?? entry.data.label ?? '',
    creator: entry.data.creator ?? '',
    status: status ?? entry.data.status ?? '',
    date: entry.data.date.toISOString().slice(0, 10),
    url: entryPath(entry.id, entry.data.kind, entry.data.demoUrl, lang),
    body: (translation?.body ?? entry.body).slice(0, 500),
  }));
};
