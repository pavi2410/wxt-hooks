# Refactor useTabs to use Nanostores for Global State Management

## Summary

This PR refactors the `useTabs` hook to use [nanostores](https://github.com/nanostores/nanostores) for global state management, eliminating redundant browser event listeners and enabling usage in non-React projects.

## Key Changes

### 🎯 Performance Improvements
- **Before**: Each component using `useTabs` created its own set of browser event listeners
- **After**: Single set of listeners shared globally across all components via nanostores
- **Result**: Eliminates redundant listeners and improves performance

### 🏗️ Architecture
- Created `src/stores/tabs-store.ts` with global atom stores:
  - `tabsStore`: Tracks all tabs in the current window
  - `activeTabStore`: Tracks the active tab
- Implemented lazy initialization using nanostores `onMount` lifecycle hook
- Browser listeners auto-initialize on first subscription and auto-cleanup when last subscriber disconnects

### ✨ New Features
- **Non-React Support**: Stores can now be used directly in vanilla JS/TS or other frameworks (Vue, Svelte, Solid, etc.)
- **Framework Agnostic**: Core state management is now decoupled from React
- **Automatic Lifecycle**: No manual initialization or cleanup required

### 📦 Dependencies Added
- `nanostores`: Core state management library
- `@nanostores/react`: React integration for nanostores

## Usage Examples

### React (as before, but more efficient)
```tsx
import { useTabs } from 'wxt-hooks';

function TabsList() {
  const { tabs, activeTab } = useTabs();
  // Auto-initializes on mount, shares state globally
  return <div>...</div>;
}
```

### Vanilla JavaScript/TypeScript (NEW)
```typescript
import { tabsStore, activeTabStore } from 'wxt-hooks';

// Auto-initializes on first subscription
const unsubscribe = tabsStore.subscribe(tabs => {
  console.log('Tabs:', tabs);
});
```

### Vue 3 (NEW)
```vue
<script setup>
import { useStore } from '@nanostores/vue';
import { tabsStore, activeTabStore } from 'wxt-hooks';

const tabs = useStore(tabsStore);
const activeTab = useStore(activeTabStore);
</script>
```

### Svelte (NEW)
```svelte
<script>
  import { tabsStore, activeTabStore } from 'wxt-hooks';
</script>

<h2>Active: {$activeTabStore?.title}</h2>
```

## Implementation Details

### Lazy Initialization with `onMount`
The stores use nanostores' `onMount` lifecycle hook for lazy initialization:
- Listeners are only created when someone subscribes
- Listeners are automatically cleaned up when all subscribers disconnect
- Follows nanostores best practices for lazy stores

### Benefits
1. **Efficiency**: Single set of browser listeners regardless of component count
2. **Consistency**: All subscribers see the same synchronized state
3. **Flexibility**: Works in React, Vue, Svelte, vanilla JS, or any framework
4. **Clean**: Automatic lifecycle management, no manual setup/teardown

## Commits

- `refactor: migrate useTabs to nanostores for global state management`
- `refactor: extract tabs stores to dedicated stores directory`
- `refactor: use nanostores onMount for automatic lazy initialization`
- `docs: add nanostores integration documentation to README`

## Breaking Changes

None. The React hook API remains exactly the same. This is a backward-compatible refactor.

## Testing

- ✅ TypeScript type checking passes
- ✅ Build completes successfully
- ✅ Maintains same API surface for React users
- ✅ Adds new capabilities for non-React users
