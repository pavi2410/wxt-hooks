import { type Browser } from "@wxt-dev/browser";
import { useStore } from "@nanostores/react";
import { activeTabStore, initializeTabsStore, tabsStore } from "../stores/tabs-store";

// Adaptation from https://github.com/antoinekm/use-chrome/blob/master/src/hooks/tabs/index.ts
export function useTabs(): {
  tabs: Browser.tabs.Tab[];
  activeTab: Browser.tabs.Tab | undefined;
} {
  // Initialize listeners on first hook call
  initializeTabsStore();

  // Subscribe to the global stores
  const tabs = useStore(tabsStore);
  const activeTab = useStore(activeTabStore);

  return {
    tabs,
    activeTab,
  };
}
