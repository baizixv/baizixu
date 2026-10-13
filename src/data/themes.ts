/**
 * 主题皮肤配置。新增皮肤只需在这里追加一项，并在 CSS 里补一个
 * 同 `id` 的皮肤模块（模块号 ≥ 31，最后导入）。
 * 皮肤只负责视觉，不改变页面结构和布局。
 */
export interface ThemeOption {
  id: string;
  name: string;
  description: string;
}

export const themes: ThemeOption[] = [
  { id: 'brutalist', name: '粗野实验室', description: '硬边框 · 撞色 · 硬投影' },
  { id: 'quiet', name: '静音纸感', description: '单色 · 去边框 · 留白优先' },
  { id: 'terminal', name: '终端极客', description: '黑底 · 荧光绿 · 等宽字体' },
  { id: 'editorial', name: '杂志编辑', description: '黑白极简 · 衬线标题 · 红色点缀' },
];

export const defaultTheme = 'brutalist';
export const themeStorageKey = 'bai-skin';
