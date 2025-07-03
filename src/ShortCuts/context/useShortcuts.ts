import { useContext } from "react";
import { ShortcutsContext } from "./ShortcutsContextDef";
import type { ShortcutsContextValue } from "./ShortcutsContextDef";

/**
 * Custom hook to consume the shortcuts context
 */
export const useShortcuts = (): ShortcutsContextValue => {
  const context = useContext(ShortcutsContext);
  if (context === undefined) {
    throw new Error("useShortcuts must be used within a ShortcutsProvider");
  }
  return context;
}; 