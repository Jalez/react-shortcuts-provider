import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ShortcutsProvider, ShortcutsDisplay } from '../index'
import { registerShortcut, unregisterShortcut } from '../shortcuts-exports'

// Test component that registers shortcuts
const TestComponent = () => {
  const [message, setMessage] = React.useState('')
  
  React.useEffect(() => {
    registerShortcut(
      'test-category',
      'show-message',
      'Ctrl+M',
      () => setMessage('Hello from shortcut!'),
      'Show a message'
    )

    return () => {
      unregisterShortcut('test-category', 'show-message')
    }
  }, [])

  return (
    <div>
      <div data-testid="message">{message}</div>
      <input data-testid="input" placeholder="Type here" />
    </div>
  )
}

describe('Shortcuts Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should register and execute shortcuts', async () => {
    render(
      <ShortcutsProvider>
        <TestComponent />
      </ShortcutsProvider>
    )

    // Initially no message
    expect(screen.getByTestId('message')).toHaveTextContent('')

    // Simulate Ctrl+M keypress
    fireEvent.keyDown(document, { key: 'm', ctrlKey: true })

    // Should show message
    expect(screen.getByTestId('message')).toHaveTextContent('Hello from shortcut!')
  })

  it('should not trigger shortcuts when typing in input fields', () => {
    render(
      <ShortcutsProvider>
        <TestComponent />
      </ShortcutsProvider>
    )

    const input = screen.getByTestId('input')
    
    // Focus the input
    fireEvent.focus(input)
    
    // Simulate Ctrl+M keypress while input is focused
    fireEvent.keyDown(input, { key: 'm', ctrlKey: true })

    // Should not show message because input is focused
    expect(screen.getByTestId('message')).toHaveTextContent('')
  })

  it('should display registered shortcuts in ShortcutsDisplay', () => {
    render(
      <ShortcutsProvider>
        <TestComponent />
        <ShortcutsDisplay />
      </ShortcutsProvider>
    )

    // Should show the shortcut in the display
    expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument()
    expect(screen.getByText(/Show a message/)).toBeInTheDocument()
    expect(screen.getByText('⌃ + M')).toBeInTheDocument() // Formatted key combo
  })

  it('should handle multiple shortcuts', () => {
    const TestComponentWithMultipleShortcuts = () => {
      const [state, setState] = React.useState({ message: '', count: 0 })
      
      React.useEffect(() => {
        registerShortcut(
          'test-category',
          'show-message',
          'Ctrl+M',
          () => setState(prev => ({ ...prev, message: 'Hello!' })),
          'Show message'
        )

        registerShortcut(
          'test-category',
          'increment-count',
          'Ctrl+I',
          () => setState(prev => ({ ...prev, count: prev.count + 1 })),
          'Increment count'
        )

        return () => {
          unregisterShortcut('test-category', 'show-message')
          unregisterShortcut('test-category', 'increment-count')
        }
      }, [])

      return (
        <div>
          <div data-testid="message">{state.message}</div>
          <div data-testid="count">{state.count}</div>
        </div>
      )
    }

    render(
      <ShortcutsProvider>
        <TestComponentWithMultipleShortcuts />
      </ShortcutsProvider>
    )

    // Initially empty
    expect(screen.getByTestId('message')).toHaveTextContent('')
    expect(screen.getByTestId('count')).toHaveTextContent('0')

    // Trigger first shortcut
    fireEvent.keyDown(document, { key: 'm', ctrlKey: true })
    expect(screen.getByTestId('message')).toHaveTextContent('Hello!')
    expect(screen.getByTestId('count')).toHaveTextContent('0')

    // Trigger second shortcut
    fireEvent.keyDown(document, { key: 'i', ctrlKey: true })
    expect(screen.getByTestId('message')).toHaveTextContent('Hello!')
    expect(screen.getByTestId('count')).toHaveTextContent('1')
  })

  it('should handle shortcut conflicts (only execute first match)', () => {
    const TestComponentWithConflicts = () => {
      const [executed, setExecuted] = React.useState<string[]>([])
      
      React.useEffect(() => {
        registerShortcut(
          'category1',
          'action1',
          'Ctrl+A',
          () => setExecuted(prev => [...prev, 'action1']),
          'First action'
        )

        registerShortcut(
          'category2',
          'action2',
          'Ctrl+A',
          () => setExecuted(prev => [...prev, 'action2']),
          'Second action'
        )

        return () => {
          unregisterShortcut('category1', 'action1')
          unregisterShortcut('category2', 'action2')
        }
      }, [])

      return (
        <div>
          <div data-testid="executed">{executed.join(', ')}</div>
        </div>
      )
    }

    render(
      <ShortcutsProvider>
        <TestComponentWithConflicts />
      </ShortcutsProvider>
    )

    // Trigger the conflicting shortcut
    fireEvent.keyDown(document, { key: 'a', ctrlKey: true })

    // Should only execute the first registered shortcut
    expect(screen.getByTestId('executed')).toHaveTextContent('action1')
  })

  it('should handle disabled shortcuts', () => {
    const TestComponentWithDisabledShortcut = () => {
      const [message, setMessage] = React.useState('')
      
      React.useEffect(() => {
        registerShortcut(
          'test-category',
          'disabled-shortcut',
          'Ctrl+D',
          () => setMessage('This should not execute'),
          'Disabled shortcut',
          false // disabled
        )

        return () => {
          unregisterShortcut('test-category', 'disabled-shortcut')
        }
      }, [])

      return (
        <div>
          <div data-testid="message">{message}</div>
        </div>
      )
    }

    render(
      <ShortcutsProvider>
        <TestComponentWithDisabledShortcut />
      </ShortcutsProvider>
    )

    // Trigger the disabled shortcut
    fireEvent.keyDown(document, { key: 'd', ctrlKey: true })

    // Should not execute
    expect(screen.getByTestId('message')).toHaveTextContent('')
  })

  it('should handle special keys correctly', () => {
    const TestComponentWithSpecialKeys = () => {
      const [message, setMessage] = React.useState('')
      
      React.useEffect(() => {
        registerShortcut(
          'test-category',
          'space-shortcut',
          'Space',
          () => setMessage('Space pressed'),
          'Space shortcut'
        )

        registerShortcut(
          'test-category',
          'escape-shortcut',
          'Esc',
          () => setMessage('Escape pressed'),
          'Escape shortcut'
        )

        return () => {
          unregisterShortcut('test-category', 'space-shortcut')
          unregisterShortcut('test-category', 'escape-shortcut')
        }
      }, [])

      return (
        <div>
          <div data-testid="message">{message}</div>
        </div>
      )
    }

    render(
      <ShortcutsProvider>
        <TestComponentWithSpecialKeys />
      </ShortcutsProvider>
    )

    // Test space key
    fireEvent.keyDown(document, { key: ' ' })
    expect(screen.getByTestId('message')).toHaveTextContent('Space pressed')

    // Test escape key
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.getByTestId('message')).toHaveTextContent('Escape pressed')
  })
}) 