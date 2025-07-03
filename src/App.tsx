import React, { useState } from 'react';
import {
  ShortcutsProvider,
  ShortcutsDisplay,
} from './ShortCuts';
import {
  registerShortcut,
  unregisterShortcut,
} from './ShortCuts/shortcuts-exports';

function App() {
  const [showMessage, setShowMessage] = useState(false);
  const message = 'Hello from keyboard shortcut!'

  // Register some custom shortcuts for this example
  React.useEffect(() => {
    registerShortcut(
      'Examples',
      'show-message',
      'ctrl+M',
      () => {
        setShowMessage(prev => !prev);
      },
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
      <div className="min-h-screen bg-background text-foreground p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">React Shortcuts Provider Demo</h1>

          <ShortcutsDisplay />
          {showMessage && (
            <div className="bg-primary text-primary-foreground p-4 rounded-lg">
              {message}
            </div>
          )}
        </div>
      </div>
    </ShortcutsProvider>
  );
}

export default App;
