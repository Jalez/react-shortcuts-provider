import { createContext } from "react";

export interface ShortcutsContextValue {
  showShortcuts: boolean;
  toggleShortcuts: () => void;
  setShowShortcuts: (show: boolean) => void;
}

export const ShortcutsContext = createContext<ShortcutsContextValue | undefined>(
  undefined
); 