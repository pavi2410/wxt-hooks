# wxt-hooks

A collection of React hooks for building browser extensions with [WXT](https://wxt.dev).

## Installation

```bash
# npm
npm install wxt-hooks

# yarn
yarn add wxt-hooks

# pnpm
pnpm add wxt-hooks

# bun
bun add wxt-hooks
```

## Requirements

This package has the following peer dependencies:

- React 19+
- TypeScript 5+

And depends on:

- `@wxt-dev/browser`: For browser extension APIs
- `@wxt-dev/storage`: For storage management

## Available Hooks

### `useTabs`

A hook to access and monitor browser tabs.

```tsx
import { useTabs } from 'wxt-hooks';

function TabsList() {
  const { tabs, activeTab } = useTabs();
  
  return (
    <div>
      <h2>Active Tab: {activeTab?.title}</h2>
      <ul>
        {tabs.map(tab => (
          <li key={tab.id} className={tab.active ? 'active' : ''}>
            {tab.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### `useWxtStorage`

A hook to interact with WXT's storage system with React.

```tsx
import { useWxtStorage } from 'wxt-hooks';
import { storage } from '@wxt-dev/storage';

// Define your storage item
const counterState = storage.defineItem('local:counter', {
  fallback: 0,
});

function Counter() {
  const [count, setCount] = useWxtStorage(counterState);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

## Development

To install dependencies:

```bash
bun install
```

To check for type errors:

```bash
bun run check
```

To build the package:

```bash
bun run build
```

## License

MIT
