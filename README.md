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

- React 19+ (optional - only needed for React hooks)
- TypeScript 5+

And depends on:

- `@wxt-dev/browser`: For browser extension APIs
- `@wxt-dev/storage`: For storage management
- `nanostores`: For global state management
- `@nanostores/react`: For React integration

## Available Hooks

### `useTabs`

A React hook to access and monitor browser tabs. Automatically subscribes to tab changes and updates when tabs are created, removed, activated, or updated.

**Features:**
- Automatic subscription to browser tab events
- Lazy initialization using nanostores `onMount`
- Shared global state across all components
- Automatic cleanup when component unmounts

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

## Nanostores Integration (for Non-React Projects)

This package exposes nanostores atoms that can be used directly in vanilla JavaScript, TypeScript, or other frameworks (Vue, Svelte, Solid, etc.).

### `tabsStore`

Global store for browser tabs state containing both the list of tabs and the active tab. This store uses lazy initialization - browser event listeners are automatically set up when you subscribe and cleaned up when you unsubscribe.

```typescript
import { tabsStore } from 'wxt-hooks';

// Subscribe to tabs state
const unsubscribe = tabsStore.subscribe(({ tabs, activeTab }) => {
  console.log('All tabs:', tabs);
  console.log('Active tab:', activeTab);
});

// Cleanup when done
unsubscribe();
```

**Direct store access:**

```typescript
import { tabsStore } from 'wxt-hooks';

// Get current value (without subscribing)
const { tabs, activeTab } = tabsStore.get();
console.log(`${tabs.length} tabs, active: ${activeTab?.title}`);
```

**Integration with other frameworks:**

```vue
<!-- Vue 3 -->
<script setup>
import { useStore } from '@nanostores/vue';
import { tabsStore } from 'wxt-hooks';

const tabsState = useStore(tabsStore);
</script>

<template>
  <h2>Active: {{ tabsState.activeTab?.title }}</h2>
  <li v-for="tab in tabsState.tabs" :key="tab.id">{{ tab.title }}</li>
</template>
```

```svelte
<!-- Svelte -->
<script>
  import { tabsStore } from 'wxt-hooks';
</script>

<h2>Active: {$tabsStore.activeTab?.title}</h2>
{#each $tabsStore.tabs as tab}
  <li>{tab.title}</li>
{/each}
```

For more information about nanostores integration, see the [nanostores documentation](https://github.com/nanostores/nanostores).

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
