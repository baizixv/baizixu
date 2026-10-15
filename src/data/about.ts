import type { Lang } from '@/i18n/ui';
import pkg from '../../package.json';

/**
 * 当前版本号只有一个来源：package.json 的 `version`。
 * 发布时改 package.json，并把同版本的一条写进下面的 releases（构建会校验一致性）。
 */
export const currentVersion = `v${pkg.version}`;

const zh = {
  name: '白子诩',
  role: '独立开发者、设计与互联网观察者',
  intro: '我喜欢把模糊的好奇心，慢慢做成可以访问的东西。写文章、做工具、收集链接，也在周末做一些不一定有用但很好玩的实验。',
  location: '远程工作',
  availability: '目前接受有趣的小型合作',
  email: 'bai.zixu@foxmail.com',
  github: 'https://github.com/baizixv',
  stats: [
    { label: '开始记录', value: '2021' },
    { label: '公开项目', value: '12' },
    { label: '当前版本', value: currentVersion }
  ],
  progress: [
    { name: '个人网站 2.0', detail: '内容系统与视觉重构', status: '进行中', percent: 68, color: 'blue' }
  ],
  releases: [
    { version: 'v1.0.0', date: '2026.10.15', title: '多语言与主题体系', description: '中英双语路由与 29 篇内容译文；主题皮肤系统与四套皮肤；双语 README。' },
    { version: 'v0.5.0', date: '2026.09.23', title: '内容与新项目', description: '新增 ShowMeClothes AI 试穿项目；更新联系方式与站点信息。' },
    { version: 'v0.4.0', date: '2026.08.11', title: '更名实验场', description: '站点更名为“白子诩 · 实验场”；新增 2142万分之一 概率模拟。' },
    { version: 'v0.3.0', date: '2026.08.10', title: 'PWA 与概率游戏', description: '可安装到桌面；站内搜索；财富代价模拟器；首页视觉统一。' },
    { version: 'v0.2.0', date: '2026.08.09', title: '内容与图书馆', description: '想法库、图书馆与媒体收藏、人类基准测试、本地工具与小游戏。' },
    { version: 'v0.1.0', date: '2026.08.08', title: '迁移到 Astro', description: 'Markdown 内容集合、独立详情页与类型检查。' }
  ]
};

const en: typeof zh = {
  name: 'Baizixu',
  role: 'Indie developer, design & internet observer',
  intro: 'I like turning vague curiosity slowly into things you can visit: writing, building tools, collecting links, and running weekend experiments that are not always useful but always fun.',
  location: 'Remote',
  availability: 'Open to interesting small collaborations',
  email: 'bai.zixu@foxmail.com',
  github: 'https://github.com/baizixv',
  stats: [
    { label: 'Started', value: '2021' },
    { label: 'Public projects', value: '12' },
    { label: 'Version', value: currentVersion }
  ],
  progress: [
    { name: 'Personal site 2.0', detail: 'Content system & visual rebuild', status: 'In progress', percent: 68, color: 'blue' }
  ],
  releases: [
    { version: 'v1.0.0', date: '2026.10.15', title: 'Bilingual and theming', description: 'Chinese/English routes with 29 translated entries; a theme skin system with four skins; bilingual README.' },
    { version: 'v0.5.0', date: '2026.09.23', title: 'Content and a new project', description: 'Added the ShowMeClothes AI try-on project; refreshed contact and site info.' },
    { version: 'v0.4.0', date: '2026.08.11', title: 'Renamed to Experiment Lab', description: 'Renamed the site to “Baizixu · Experiment Lab”; added the 1-in-21,425,712 lottery simulation.' },
    { version: 'v0.3.0', date: '2026.08.10', title: 'PWA and probability games', description: 'Installable PWA, site search, the wealth cost simulator and a unified homepage look.' },
    { version: 'v0.2.0', date: '2026.08.09', title: 'Content and library', description: 'Idea shelf, library and media collection, human benchmark, local tools and small games.' },
    { version: 'v0.1.0', date: '2026.08.08', title: 'Migrated to Astro', description: 'Markdown content collections, standalone detail pages and type checking.' }
  ]
};

export const aboutByLang: Record<Lang, typeof zh> = { zh, en };
export const getAbout = (lang: Lang) => aboutByLang[lang] ?? zh;
/** 兼容旧引用，默认中文。 */
export const about = zh;
