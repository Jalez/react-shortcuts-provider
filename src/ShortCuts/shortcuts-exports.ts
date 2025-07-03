export {
  registerShortcut,
  unregisterShortcut,
  getShortcuts,
  getAllShortcuts,
  getShortcutCategories,
  clearShortcuts,
  hasShortcut,
  executeShortcut,
  useShortcutsRegistry,
  useKeyboardShortcutHandler,
  DEFAULT_SHORTCUT_CATEGORIES,
  parseKeyCombo,
  matchesKeyCombo,
} from "./registry/shortcutsRegistry";

export type {
  ShortcutEntry,
  ShortcutCategory,
  KeyCombination,
} from "./registry/shortcutsRegistry";

export { useShortcuts } from "./context/useShortcuts"; 