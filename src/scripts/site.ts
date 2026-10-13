import { readStorage, writeStorage } from "../lib/storage";
import { defaultTheme, themeStorageKey, themes } from "../data/themes";
import { setupSearch } from "./search";

let cleanup: (() => void) | undefined;

const setupSite = () => {
  cleanup?.();

  const body = document.body;
  const isEn = document.documentElement.lang === "en";
  const labels = {
    darkMode: isEn ? "Switch to dark mode" : "切换深色模式",
    lightMode: isEn ? "Switch to light mode" : "切换浅色模式",
    skinStyle: isEn ? "Switch theme style" : "切换主题风格",
    copied: isEn ? "Copied" : "已复制",
  };
  const themeToggle = document.querySelector<HTMLButtonElement>("#theme-toggle");
  const savedTheme = readStorage<"dark" | "light">("bai-theme", "light");
  document.documentElement.dataset.theme = savedTheme;
  body.classList.toggle("dark", savedTheme === "dark");
  // 游戏独立页强制深色舞台（变量覆盖，不影响主题切换）。
  body.classList.toggle("lottery-game", Boolean(document.querySelector(".lottery-page")));

  const onThemeToggle = () => {
    body.classList.toggle("dark");
    document.documentElement.dataset.theme = body.classList.contains("dark") ? "dark" : "light";
    writeStorage("bai-theme", body.classList.contains("dark") ? "dark" : "light");
    syncThemeLabel();
  };
  const syncThemeLabel = () => {
    themeToggle?.setAttribute(
      "aria-label",
      body.classList.contains("dark") ? labels.lightMode : labels.darkMode,
    );
  };
  syncThemeLabel();
  themeToggle?.addEventListener("click", onThemeToggle);

  // 主题皮肤切换（配置见 src/data/themes.ts）。
  const skinMenu = document.querySelector<HTMLDivElement>("#skin-menu");
  const skinButton = document.querySelector<HTMLButtonElement>("#skin-button");
  const skinPanel = document.querySelector<HTMLDivElement>("#skin-panel");
  const skinOptions = [...document.querySelectorAll<HTMLButtonElement>("[data-skin-option]")];
  const setSkinPanelOpen = (open: boolean) => {
    skinPanel?.toggleAttribute("hidden", !open);
    skinButton?.setAttribute("aria-expanded", String(open));
  };
  const applySkin = (id: string, persist = true) => {
    const known = themes.some((theme) => theme.id === id) ? id : defaultTheme;
    const option = themes.find((theme) => theme.id === known);
    document.documentElement.dataset.skin = known;
    if (persist) writeStorage(themeStorageKey, known);
    // 切皮肤只改外观，不动用户的明暗偏好（terminal 本身是深色皮肤，由 CSS 表现）。
    skinOptions.forEach((item) => item.classList.toggle("active", item.dataset.skinOption === known));
    skinButton?.setAttribute("aria-label", `${labels.skinStyle}（${option?.name ?? known}）`);
  };
  applySkin(readStorage<string>(themeStorageKey, defaultTheme), false);
  const onSkinToggle = () => setSkinPanelOpen(skinPanel?.hasAttribute("hidden") ?? false);
  const onSkinSelect = (event: MouseEvent) => {
    const target = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-skin-option]");
    if (!target?.dataset.skinOption) return;
    applySkin(target.dataset.skinOption);
    setSkinPanelOpen(false);
  };
  const onSkinOutside = (event: MouseEvent) => {
    if (skinMenu && !skinMenu.contains(event.target as Node)) setSkinPanelOpen(false);
  };
  skinButton?.addEventListener("click", onSkinToggle);
  skinPanel?.addEventListener("click", onSkinSelect);
  document.addEventListener("click", onSkinOutside);

  // 语言切换菜单（地球图标 + 下拉）
  const langMenu = document.querySelector<HTMLDivElement>("#lang-menu");
  const langButton = document.querySelector<HTMLButtonElement>("#lang-button");
  const langPanel = document.querySelector<HTMLDivElement>("#lang-panel");
  const setLangPanelOpen = (open: boolean) => {
    langPanel?.toggleAttribute("hidden", !open);
    langButton?.setAttribute("aria-expanded", String(open));
  };
  const onLangToggle = () => setLangPanelOpen(langPanel?.hasAttribute("hidden") ?? false);
  const onLangOutside = (event: MouseEvent) => {
    if (langMenu && !langMenu.contains(event.target as Node)) setLangPanelOpen(false);
  };
  langButton?.addEventListener("click", onLangToggle);
  document.addEventListener("click", onLangOutside);

  const cleanupSearch = setupSearch();

  // 桌面端：点“联系我”/邮箱按钮弹出联系方式弹窗；移动端保持 mailto。
  const contactModal = document.querySelector<HTMLDivElement>("#contact-modal");
  const closeButton = document.querySelector<HTMLButtonElement>("#contact-close");
  const isDesktop = () => window.matchMedia("(min-width: 901px)").matches;
  const openContactModal = () => {
    contactModal?.removeAttribute("hidden");
    body.classList.add("modal-open");
  };
  const closeContactModal = () => {
    contactModal?.setAttribute("hidden", "");
    body.classList.remove("modal-open");
  };
  const onMailtoClick = (event: MouseEvent) => {
    if (!isDesktop()) return;
    const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="mailto:"]');
    if (!anchor) return;
    if (anchor.closest("#contact-modal")) return;
    event.preventDefault();
    openContactModal();
  };
  const onModalClick = (event: MouseEvent) => {
    if (event.target === contactModal) closeContactModal();
  };
  const onCopyClick = async (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const button = target.closest<HTMLButtonElement>(".contact-copy");
    const valueEl = button ? null : target.closest<HTMLElement>(".contact-value[data-copy]");
    if (!button && !valueEl) return;
    const value = (button ?? valueEl)?.dataset.copy ?? "";
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    if (button) {
      const original = button.textContent ?? "";
      button.textContent = labels.copied;
      button.classList.add("copied");
      window.setTimeout(() => {
        button.textContent = original;
        button.classList.remove("copied");
      }, 1600);
    } else if (valueEl) {
      const original = valueEl.textContent ?? "";
      valueEl.textContent = labels.copied;
      window.setTimeout(() => {
        valueEl.textContent = original;
      }, 1600);
    }
  };
  const onModalKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Escape") return;
    closeContactModal();
    setSkinPanelOpen(false);
    setLangPanelOpen(false);
  };
  contactModal?.addEventListener("click", onModalClick);
  contactModal?.addEventListener("click", onCopyClick);
  closeButton?.addEventListener("click", closeContactModal);
  document.addEventListener("click", onMailtoClick);
  document.addEventListener("keydown", onModalKeyDown);

  const navLinks = [...document.querySelectorAll<HTMLAnchorElement>(".main-nav a")];
  const sections = [...document.querySelectorAll<HTMLElement>("main section[id]")];
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `/#${visible.target.id}`));
    },
    { rootMargin: "-25% 0px -65% 0px", threshold: [0, 0.25, 0.6] },
  );
  sections.forEach((section) => observer.observe(section));

  document.querySelectorAll<HTMLAnchorElement>('a[href^="http"]').forEach((link) => {
    try {
      if (new URL(link.href).origin !== window.location.origin) {
        link.target = "_blank";
        link.rel = "noreferrer";
      }
    } catch {
      // Ignore malformed URLs and leave them as regular links.
    }
  });

  cleanup = () => {
    themeToggle?.removeEventListener("click", onThemeToggle);
    skinButton?.removeEventListener("click", onSkinToggle);
    skinPanel?.removeEventListener("click", onSkinSelect);
    document.removeEventListener("click", onSkinOutside);
    langButton?.removeEventListener("click", onLangToggle);
    document.removeEventListener("click", onLangOutside);
    cleanupSearch();
    contactModal?.removeEventListener("click", onModalClick);
    contactModal?.removeEventListener("click", onCopyClick);
    closeButton?.removeEventListener("click", closeContactModal);
    document.removeEventListener("click", onMailtoClick);
    document.removeEventListener("keydown", onModalKeyDown);
    body.classList.remove("modal-open");
    observer.disconnect();
  };
};

document.addEventListener("astro:page-load", setupSite);
setupSite();

export {};
