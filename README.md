# @jalez/react-shortcuts-provider

A React context/provider and utilities for managing keyboard shortcuts in your app. This library provides a decoupled, registry-based keyboard shortcuts system that allows components to register actions with specific key combinations without being tightly coupled to other components.

## Installation

```sh
npm install @jalez/react-shortcuts-provider
```

## Features

- **Registry-based**: Components can register/unregister shortcuts dynamically
- **Decoupled**: No dependencies on other contexts or systems
- **Categorized**: Shortcuts can be organized into categories
- **Automatic handling**: Global keyboard event handling
- **Type-safe**: Full TypeScript support
- **Flexible**: Support for complex key combinations
- **Cross-platform**: Works with Ctrl (Windows/Linux) and Cmd (macOS) automatically
- **Fast Refresh Compatible**: Optimized for React Fast Refresh development

## Quick Start

### 1. Wrap your app with ShortcutsProvider

```tsx
import { ShortcutsProvider } from '@jalez/react-shortcuts-provider';

function App() {
  return (
    <ShortcutsProvider>
      <YourMainComponent />
    </ShortcutsProvider>
  );
}
```

### 2. Register shortcuts in any component

```tsx
import { useEffect } from 'react';
import { registerShortcut, unregisterShortcut, DEFAULT_SHORTCUT_CATEGORIES } from '@jalez/react-shortcuts-provider';

function MyComponent() {
  useEffect(() => {
    // Register a shortcut
    registerShortcut(
      DEFAULT_SHORTCUT_CATEGORIES.NAVIGATION,
      'my-action',
      'Ctrl+M',
      () => console.log('My action triggered!'),
      'My custom action'
    );

    // Cleanup
    return () => {
      unregisterShortcut(DEFAULT_SHORTCUT_CATEGORIES.NAVIGATION, 'my-action');
    };
  }, []);

  return <div>My Component</div>;
}
```

### 3. Display shortcuts (optional)

```tsx
import { ShortcutsDisplay } from '@jalez/react-shortcuts-provider';

function MyApp() {
  return (
    <ShortcutsProvider>
      <div>
        <h1>My App</h1>
        {/* Position the shortcuts display wherever you want */}
        <ShortcutsDisplay className="absolute bottom-5 right-5" />
      </div>
    </ShortcutsProvider>
  );
}
```

## API Reference

### Registry Functions

#### `registerShortcut(category, name, keyCombo, action, description, enabled?, order?)`

Register a new keyboard shortcut.

- `category`: Shortcut category (string)
- `name`: Unique name for the shortcut within its category
- `keyCombo`: Key combination (e.g., "Ctrl+F", "Shift+M", "Delete")
- `action`: Function to execute when triggered
- `description`: Human-readable description
- `enabled`: Whether the shortcut is enabled (default: true)
- `order`: Display order (lower numbers appear first)

#### `unregisterShortcut(category, name)`

Remove a registered shortcut.

#### `getAllShortcuts()`

Get all registered shortcuts across all categories.

### Key Combination Format

The system supports various key combination formats:

- `"Ctrl+F"` - Control + F (or Cmd+F on macOS)
- `"Shift+Delete"` - Shift + Delete
- `"Alt+Tab"` - Alt + Tab
- `"Ctrl+Shift+Z"` - Control + Shift + Z
- `"F11"` - Function key F11
- `"Esc"` - Escape key

### Default Categories

```tsx
DEFAULT_SHORTCUT_CATEGORIES = {
  NAVIGATION: "navigation",
  VIEW_SETTINGS: "viewSettings", 
  TOOLS: "tools",
  EDITING: "editing",
  CUSTOM: "custom",
}
```

### Hooks

#### `useShortcutsRegistry()`

Access the shortcuts registry state:

```tsx
const { shortcuts, getShortcuts, getAllShortcuts } = useShortcutsRegistry();
```

#### `useShortcuts()`

Access shortcuts display state (requires ShortcutsProvider):

```tsx
const { showShortcuts, toggleShortcuts } = useShortcuts();
```

#### `useKeyboardShortcutHandler()`

Enable automatic keyboard event handling (used internally by ShortcutsManager).

## Components

### `ShortcutsProvider`

Main component that provides the complete shortcuts system:

```tsx
<ShortcutsProvider initialShow={false}>
  <YourApp />
</ShortcutsProvider>
```

### `ShortcutsDisplay`

Component that displays registered shortcuts. Position it wherever you want:

```tsx
<ShortcutsDisplay 
  showCategories={true}
  maxShortcuts={20}
  className="absolute bottom-5 right-5 z-50"
/>
```

Props:
- `showCategories`: Whether to group shortcuts by category (default: true)
- `maxShortcuts`: Maximum number of shortcuts to show initially (default: 20)
- `className`: Additional CSS classes for positioning and styling

## Examples

### Basic Usage

```tsx
import React, { useState, useEffect } from 'react';
import { 
  ShortcutsProvider, 
  ShortcutsDisplay, 
  registerShortcut, 
  unregisterShortcut 
} from '@jalez/react-shortcuts-provider';

function App() {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    registerShortcut(
      'Examples',
      'show-message',
      'Ctrl+M',
      () => setShowMessage(prev => !prev),
      'Toggle a message',
      true,
      20
    );

    return () => {
      unregisterShortcut('Examples', 'show-message');
    };
  }, []);

  return (
    <ShortcutsProvider>
      <div className="min-h-screen p-8">
        <h1>React Shortcuts Provider Demo</h1>
        
        <ShortcutsDisplay className="absolute bottom-5 right-5" />
        
        {showMessage && (
          <div className="bg-blue-500 text-white p-4 rounded-lg">
            Hello from keyboard shortcut!
          </div>
        )}
      </div>
    </ShortcutsProvider>
  );
}
```

### Advanced Usage with Multiple Categories

```tsx
import { useEffect } from 'react';
import { 
  registerShortcut, 
  unregisterShortcut, 
  DEFAULT_SHORTCUT_CATEGORIES 
} from '@jalez/react-shortcuts-provider';

function MyComponent() {
  useEffect(() => {
    // Navigation shortcuts
    registerShortcut(
      DEFAULT_SHORTCUT_CATEGORIES.NAVIGATION,
      'next-item',
      'ArrowDown',
      () => navigateNext(),
      'Navigate to next item'
    );

    // Editing shortcuts
    registerShortcut(
      DEFAULT_SHORTCUT_CATEGORIES.EDITING,
      'delete-item',
      'Delete',
      () => deleteCurrentItem(),
      'Delete current item'
    );

    // Tools shortcuts
    registerShortcut(
      DEFAULT_SHORTCUT_CATEGORIES.TOOLS,
      'toggle-panel',
      'Ctrl+P',
      () => togglePanel(),
      'Toggle side panel'
    );

    return () => {
      unregisterShortcut(DEFAULT_SHORTCUT_CATEGORIES.NAVIGATION, 'next-item');
      unregisterShortcut(DEFAULT_SHORTCUT_CATEGORIES.EDITING, 'delete-item');
      unregisterShortcut(DEFAULT_SHORTCUT_CATEGORIES.TOOLS, 'toggle-panel');
    };
  }, []);

  return <div>My Component</div>;
}
```

## Best Practices

1. **Always clean up**: Use the return function in useEffect to unregister shortcuts
2. **Use meaningful names**: Give shortcuts descriptive names and descriptions
3. **Organize by category**: Use appropriate categories for different types of actions
4. **Check for conflicts**: Be aware that multiple shortcuts with the same key combination may conflict
5. **Consider order**: Use the order parameter to control display order in the shortcuts panel
6. **Position ShortcutsDisplay**: The ShortcutsDisplay component is not positioned by default - you control where it appears
7. **Cross-platform compatibility**: Use "Ctrl" in key combinations - it automatically works as "Cmd" on macOS

## TypeScript Support

The library is fully typed with TypeScript. All functions and components include proper type definitions:

```tsx
import type { 
  ShortcutEntry, 
  ShortcutCategory, 
  KeyCombination 
} from '@jalez/react-shortcuts-provider';
```

## Development

This project uses:

- **React** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Zustand** for state management
- **Vitest** for testing
- **ESLint** for linting

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build the library
npm run preview      # Preview the build

# Testing
npm run test         # Run tests in watch mode
npm run test:run     # Run tests once
npm run test:ui      # Run tests with UI
npm run test:coverage # Run tests with coverage

# Linting
npm run lint         # Run ESLint
```

### Project Structure

```
src/
├── ShortCuts/
│   ├── components/          # React components
│   │   └── ShortcutsDisplay.tsx
│   │
│   ├── context/            # React context and hooks
│   │   ├── ShortcutsContext.tsx
│   │   ├── ShortcutsContextDef.ts
│   │   └── useShortcuts.ts
│   │
│   ├── registry/           # Core registry system
│   │   └── shortcutsRegistry.ts
│   │
│   ├── index.tsx           # Component exports
│   └── shortcuts-exports.ts # Function and type exports
└── index.ts               # Main library entry point
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
