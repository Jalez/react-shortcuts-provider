import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ShortcutsProvider } from '../ShortcutsContext'
import { useShortcuts } from '../useShortcuts'

// Mock the keyboard handler to avoid actual event listeners
vi.mock('../../registry/shortcutsRegistry', async () => {
  const actual = await vi.importActual('../../registry/shortcutsRegistry')
  return {
    ...actual,
    useKeyboardShortcutHandler: vi.fn(),
  }
})

// Test component that uses the context
const TestComponent = () => {
  const { showShortcuts, toggleShortcuts, setShowShortcuts } = useShortcuts()
  
  return (
    <div>
      <div data-testid="show-shortcuts">{showShortcuts.toString()}</div>
      <button onClick={toggleShortcuts} data-testid="toggle-button">
        Toggle
      </button>
      <button onClick={() => setShowShortcuts(true)} data-testid="show-button">
        Show
      </button>
      <button onClick={() => setShowShortcuts(false)} data-testid="hide-button">
        Hide
      </button>
    </div>
  )
}

describe('ShortcutsProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render children', () => {
    render(
      <ShortcutsProvider>
        <div data-testid="child">Child Component</div>
      </ShortcutsProvider>
    )
    
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('should initialize with default showShortcuts state (false)', () => {
    render(
      <ShortcutsProvider>
        <TestComponent />
      </ShortcutsProvider>
    )
    
    expect(screen.getByTestId('show-shortcuts')).toHaveTextContent('false')
  })

  it('should initialize with custom initialShow state', () => {
    render(
      <ShortcutsProvider initialShow={true}>
        <TestComponent />
      </ShortcutsProvider>
    )
    
    expect(screen.getByTestId('show-shortcuts')).toHaveTextContent('true')
  })

  it('should toggle showShortcuts state', () => {
    render(
      <ShortcutsProvider>
        <TestComponent />
      </ShortcutsProvider>
    )
    
    const toggleButton = screen.getByTestId('toggle-button')
    
    // Initially false
    expect(screen.getByTestId('show-shortcuts')).toHaveTextContent('false')
    
    // Toggle to true
    fireEvent.click(toggleButton)
    expect(screen.getByTestId('show-shortcuts')).toHaveTextContent('true')
    
    // Toggle back to false
    fireEvent.click(toggleButton)
    expect(screen.getByTestId('show-shortcuts')).toHaveTextContent('false')
  })

  it('should set showShortcuts to true', () => {
    render(
      <ShortcutsProvider>
        <TestComponent />
      </ShortcutsProvider>
    )
    
    const showButton = screen.getByTestId('show-button')
    
    expect(screen.getByTestId('show-shortcuts')).toHaveTextContent('false')
    fireEvent.click(showButton)
    expect(screen.getByTestId('show-shortcuts')).toHaveTextContent('true')
  })

  it('should set showShortcuts to false', () => {
    render(
      <ShortcutsProvider initialShow={true}>
        <TestComponent />
      </ShortcutsProvider>
    )
    
    const hideButton = screen.getByTestId('hide-button')
    
    expect(screen.getByTestId('show-shortcuts')).toHaveTextContent('true')
    fireEvent.click(hideButton)
    expect(screen.getByTestId('show-shortcuts')).toHaveTextContent('false')
  })

  it('should throw error when useShortcuts is used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    expect(() => {
      render(<TestComponent />)
    }).toThrow('useShortcuts must be used within a ShortcutsProvider')
    
    consoleSpy.mockRestore()
  })

  it('should maintain stable references for context values', () => {
    const contextValues: unknown[] = []
    
    const TestComponentWithRefs = () => {
      const context = useShortcuts()
      contextValues.push(context)
      return <div>Test</div>
    }
    
    const { rerender } = render(
      <ShortcutsProvider>
        <TestComponentWithRefs />
      </ShortcutsProvider>
    )
    
    // Re-render to check if references are stable
    rerender(
      <ShortcutsProvider>
        <TestComponentWithRefs />
      </ShortcutsProvider>
    )
    
    // The context values should have stable references
    expect(contextValues[0]).toStrictEqual(contextValues[1])
  })
}) 