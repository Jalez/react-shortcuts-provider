import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  parseKeyCombo,
  matchesKeyCombo,
  DEFAULT_SHORTCUT_CATEGORIES,
} from '../shortcutsRegistry'

describe('Shortcuts Registry', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('parseKeyCombo', () => {
    it('should parse simple key combinations', () => {
      expect(parseKeyCombo('A')).toEqual({ key: 'a' })
      expect(parseKeyCombo('Ctrl+A')).toEqual({ key: 'a', ctrlKey: true })
      expect(parseKeyCombo('Shift+B')).toEqual({ key: 'b', shiftKey: true })
      expect(parseKeyCombo('Alt+C')).toEqual({ key: 'c', altKey: true })
      expect(parseKeyCombo('Cmd+D')).toEqual({ key: 'd', metaKey: true })
    })

    it('should parse complex key combinations', () => {
      expect(parseKeyCombo('Ctrl+Shift+Alt+A')).toEqual({
        key: 'a',
        ctrlKey: true,
        shiftKey: true,
        altKey: true
      })
    })

    it('should handle different key formats', () => {
      expect(parseKeyCombo('Control+A')).toEqual({ key: 'a', ctrlKey: true })
      expect(parseKeyCombo('Meta+A')).toEqual({ key: 'a', metaKey: true })
    })
  })

  describe('matchesKeyCombo', () => {
    it('should match simple key combinations', () => {
      const event = new KeyboardEvent('keydown', { key: 'a' })
      expect(matchesKeyCombo(event, 'A')).toBe(true)
    })

    it('should match Ctrl key combinations', () => {
      const event = new KeyboardEvent('keydown', { key: 'a', ctrlKey: true })
      expect(matchesKeyCombo(event, 'Ctrl+A')).toBe(true)
    })

    it('should match Cmd key combinations on macOS', () => {
      const event = new KeyboardEvent('keydown', { key: 'a', metaKey: true })
      expect(matchesKeyCombo(event, 'Ctrl+A')).toBe(true) // Ctrl should match Cmd
    })

    it('should match Shift key combinations', () => {
      const event = new KeyboardEvent('keydown', { key: 'a', shiftKey: true })
      expect(matchesKeyCombo(event, 'Shift+A')).toBe(true)
    })

    it('should match Alt key combinations', () => {
      const event = new KeyboardEvent('keydown', { key: 'a', altKey: true })
      expect(matchesKeyCombo(event, 'Alt+A')).toBe(true)
    })

    it('should not match when keys are different', () => {
      const event = new KeyboardEvent('keydown', { key: 'b' })
      expect(matchesKeyCombo(event, 'A')).toBe(false)
    })

    it('should not match when modifiers are different', () => {
      const event = new KeyboardEvent('keydown', { key: 'a', ctrlKey: true })
      expect(matchesKeyCombo(event, 'Shift+A')).toBe(false)
    })

    it('should handle special keys', () => {
      const spaceEvent = new KeyboardEvent('keydown', { key: ' ' })
      expect(matchesKeyCombo(spaceEvent, 'Space')).toBe(true)

      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' })
      expect(matchesKeyCombo(escapeEvent, 'Esc')).toBe(true)
    })
  })

  describe('DEFAULT_SHORTCUT_CATEGORIES', () => {
    it('should have the expected categories', () => {
      expect(DEFAULT_SHORTCUT_CATEGORIES).toEqual({
        NAVIGATION: "navigation",
        VIEW_SETTINGS: "viewSettings", 
        TOOLS: "tools",
        EDITING: "editing",
        CUSTOM: "custom",
      })
    })
  })
}) 