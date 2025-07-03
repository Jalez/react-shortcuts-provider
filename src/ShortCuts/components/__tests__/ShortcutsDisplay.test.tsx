import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ShortcutsDisplay from '../ShortcutsDisplay'

// Mock the registry hook
vi.mock('../../registry/shortcutsRegistry', async () => {
  const actual = await vi.importActual('../../registry/shortcutsRegistry')
  return {
    ...actual,
    useShortcutsRegistry: vi.fn(),
  }
})

// Get the mock function for testing
const { useShortcutsRegistry } = await import('../../registry/shortcutsRegistry')
const mockUseShortcutsRegistry = useShortcutsRegistry as ReturnType<typeof vi.fn>

describe('ShortcutsDisplay', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should display message when no shortcuts are registered', () => {
    mockUseShortcutsRegistry.mockReturnValue({
      getAllShortcuts: () => [],
      getShortcutCategories: () => [],
    })

    render(<ShortcutsDisplay />)
    
    expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument()
    expect(screen.getByText('No shortcuts registered')).toBeInTheDocument()
  })

  it('should display registered shortcuts', () => {
    const mockShortcuts = [
      {
        name: 'test-shortcut',
        keyCombo: 'Ctrl+A',
        description: 'Test shortcut',
        category: 'test-category',
        enabled: true,
        order: 1,
        action: vi.fn(),
      },
    ]

    mockUseShortcutsRegistry.mockReturnValue({
      getAllShortcuts: () => mockShortcuts,
      getShortcutCategories: () => ['test-category'],
    })

    render(<ShortcutsDisplay />)
    
    expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument()
    expect(screen.getByText((content) => content.includes('Test shortcut'))).toBeInTheDocument()
    expect(screen.getByText('⌃ + A')).toBeInTheDocument() // Formatted key combo
  })

  it('should group shortcuts by category when showCategories is true', () => {
    const mockShortcuts = [
      {
        name: 'shortcut1',
        keyCombo: 'Ctrl+A',
        description: 'First shortcut',
        category: 'category1',
        enabled: true,
        order: 1,
        action: vi.fn(),
      },
      {
        name: 'shortcut2',
        keyCombo: 'Ctrl+B',
        description: 'Second shortcut',
        category: 'category2',
        enabled: true,
        order: 1,
        action: vi.fn(),
      },
    ]

    mockUseShortcutsRegistry.mockReturnValue({
      getAllShortcuts: () => mockShortcuts,
      getShortcutCategories: () => ['category1', 'category2'],
    })

    render(<ShortcutsDisplay showCategories={true} />)
    
    expect(screen.getByText('category1')).toBeInTheDocument()
    expect(screen.getByText('category2')).toBeInTheDocument()
    expect(screen.getByText((content) => content.includes('First shortcut'))).toBeInTheDocument()
    expect(screen.getByText((content) => content.includes('Second shortcut'))).toBeInTheDocument()
  })

  it('should display shortcuts flat when showCategories is false', () => {
    const mockShortcuts = [
      {
        name: 'shortcut1',
        keyCombo: 'Ctrl+A',
        description: 'First shortcut',
        category: 'category1',
        enabled: true,
        order: 1,
        action: vi.fn(),
      },
      {
        name: 'shortcut2',
        keyCombo: 'Ctrl+B',
        description: 'Second shortcut',
        category: 'category2',
        enabled: true,
        order: 1,
        action: vi.fn(),
      },
    ]

    mockUseShortcutsRegistry.mockReturnValue({
      getAllShortcuts: () => mockShortcuts,
      getShortcutCategories: () => ['category1', 'category2'],
    })

    render(<ShortcutsDisplay showCategories={false} />)
    
    expect(screen.queryByText('category1')).not.toBeInTheDocument()
    expect(screen.queryByText('category2')).not.toBeInTheDocument()
    
    expect(screen.getByText((content) => content.includes('First shortcut'))).toBeInTheDocument()
    expect(screen.getByText((content) => content.includes('Second shortcut'))).toBeInTheDocument()
  })

  it('should limit displayed shortcuts based on maxShortcuts prop', () => {
    const mockShortcuts = Array.from({ length: 10 }, (_, i) => ({
      name: `shortcut${i}`,
      keyCombo: `Ctrl+${i}`,
      description: `Shortcut ${i}`,
      category: 'test-category',
      enabled: true,
      order: i,
      action: vi.fn(),
    }))

    mockUseShortcutsRegistry.mockReturnValue({
      getAllShortcuts: () => mockShortcuts,
      getShortcutCategories: () => ['test-category'],
    })

    render(<ShortcutsDisplay maxShortcuts={3} />)
    
    expect(screen.getByText('Show All (10)')).toBeInTheDocument()
    
    expect(screen.getByText('Showing 3 of 10 shortcuts')).toBeInTheDocument()
  })

  it('should toggle between showing all and limited shortcuts', () => {
    const mockShortcuts = Array.from({ length: 10 }, (_, i) => ({
      name: `shortcut${i}`,
      keyCombo: `Ctrl+${i}`,
      description: `Shortcut ${i}`,
      category: 'test-category',
      enabled: true,
      order: i,
      action: vi.fn(),
    }))

    mockUseShortcutsRegistry.mockReturnValue({
      getAllShortcuts: () => mockShortcuts,
      getShortcutCategories: () => ['test-category'],
    })

    render(<ShortcutsDisplay maxShortcuts={3} />)
    
    const showAllButton = screen.getByText('Show All (10)')
    
    expect(screen.getByText('Showing 3 of 10 shortcuts')).toBeInTheDocument()
    
    fireEvent.click(showAllButton)
    expect(screen.getByText('Show Less')).toBeInTheDocument()
    
    fireEvent.click(screen.getByText('Show Less'))
    expect(screen.getByText('Show All (10)')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    mockUseShortcutsRegistry.mockReturnValue({
      getAllShortcuts: () => [],
      getShortcutCategories: () => [],
    })

    render(<ShortcutsDisplay className="custom-class" />)
    
    const container = screen.getByText('Keyboard Shortcuts').closest('div')
    expect(container).toHaveClass('custom-class')
  })

  it('should format key combinations correctly', () => {
    const mockShortcuts = [
      {
        name: 'shortcut1',
        keyCombo: 'Ctrl+A',
        description: 'Control A',
        category: 'test-category',
        enabled: true,
        order: 1,
        action: vi.fn(),
      },
      {
        name: 'shortcut2',
        keyCombo: 'Cmd+B',
        description: 'Command B',
        category: 'test-category',
        enabled: true,
        order: 2,
        action: vi.fn(),
      },
      {
        name: 'shortcut3',
        keyCombo: 'Shift+C',
        description: 'Shift C',
        category: 'test-category',
        enabled: true,
        order: 3,
        action: vi.fn(),
      },
      {
        name: 'shortcut4',
        keyCombo: 'Alt+D',
        description: 'Alt D',
        category: 'test-category',
        enabled: true,
        order: 4,
        action: vi.fn(),
      },
      {
        name: 'shortcut5',
        keyCombo: 'Space',
        description: 'Space',
        category: 'test-category',
        enabled: true,
        order: 5,
        action: vi.fn(),
      },
      {
        name: 'shortcut6',
        keyCombo: 'Esc',
        description: 'Escape',
        category: 'test-category',
        enabled: true,
        order: 6,
        action: vi.fn(),
      },
    ]

    mockUseShortcutsRegistry.mockReturnValue({
      getAllShortcuts: () => mockShortcuts,
      getShortcutCategories: () => ['test-category'],
    })

    render(<ShortcutsDisplay />)
    
    expect(screen.getByText('⌃ + A')).toBeInTheDocument() // Ctrl
    expect(screen.getByText('⌘ + B')).toBeInTheDocument() // Cmd
    expect(screen.getByText('⇧ + C')).toBeInTheDocument() // Shift
    expect(screen.getByText('⌥ + D')).toBeInTheDocument() // Alt
    expect(screen.getByText('Space')).toBeInTheDocument() // Space
    expect(screen.getByText('Esc')).toBeInTheDocument() // Esc
  })

  it('should filter out disabled shortcuts', () => {
    const mockShortcuts = [
      {
        name: 'enabled-shortcut',
        keyCombo: 'Ctrl+A',
        description: 'Enabled shortcut',
        category: 'test-category',
        enabled: true,
        order: 1,
        action: vi.fn(),
      },
      {
        name: 'disabled-shortcut',
        keyCombo: 'Ctrl+B',
        description: 'Disabled shortcut',
        category: 'test-category',
        enabled: false,
        order: 2,
        action: vi.fn(),
      },
    ]

    mockUseShortcutsRegistry.mockReturnValue({
      getAllShortcuts: () => mockShortcuts,
      getShortcutCategories: () => ['test-category'],
    })

    render(<ShortcutsDisplay />)
    
    expect(screen.getByText((content) => content.includes('Enabled shortcut'))).toBeInTheDocument()
    expect(screen.queryByText((content) => content.includes('Disabled shortcut'))).not.toBeInTheDocument()
  })
}) 