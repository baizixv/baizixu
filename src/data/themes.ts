/**
 * 主题皮肤配置。新增皮肤只需在这里追加一项，并在 CSS 里补一个
 * 同 `id` 的皮肤模块（模块号 ≥ 31，最后导入）。
 * 皮肤只负责视觉，不改变页面结构和布局。
 */
export interface ThemeOption {
  id: string;
  name: string;
  description: string;
  /** 选择该皮肤时是否自动切到深色（深色为基础的皮肤填 true）。 */
  preferDark?: boolean;
}

export const themes: ThemeOption[] = [
  { id: 'brutalist', name: '粗野实验室', description: '硬边框 · 撞色 · 硬投影' },
  { id: 'terminal', name: '终端极客', description: '黑底 · 荧光绿 · 等宽字体', preferDark: true },
  { id: 'editorial', name: '杂志编辑', description: '黑白极简 · 衬线标题 · 红色点缀' },
];

export const defaultTheme = themes[0].id;
export const themeStorageKey = 'bai-skin';
