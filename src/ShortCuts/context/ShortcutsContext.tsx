/** @format */
import React, { useState, useCallback } from "react";
import { useKeyboardShortcutHandler } from "../registry/shortcutsRegistry";
import { ShortcutsContext } from "./ShortcutsContextDef";
import type { ShortcutsContextValue } from "./ShortcutsContextDef";

interface ShortcutsProviderProps {
  children: React.ReactNode;
  initialShow?: boolean;
}

/**
 * Provider component that manages the shortcuts display state
 * Completely independent from other contexts
 */
export const ShortcutsProvider: React.FC<ShortcutsProviderProps> = ({
  children,
  initialShow = false,
}) => {
  // Initialize keyboard shortcut handler
  useKeyboardShortcutHandler();

  // Local state for shortcuts visibility
  const [showShortcuts, setShowShortcuts] = useState(initialShow);

  // Toggle function
  const toggleShortcuts = useCallback(() => {
    setShowShortcuts((prev) => !prev);
  }, []);

  // Create context value
  const value: ShortcutsContextValue = {
    showShortcuts,
    toggleShortcuts,
    setShowShortcuts,
  };

  return (
    <ShortcutsContext.Provider value={value}>
      {children}
    </ShortcutsContext.Provider>
  );
};