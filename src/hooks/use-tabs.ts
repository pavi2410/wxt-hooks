import { type Browser } from "@wxt-dev/browser";
import { useStore } from "@nanostores/react";
import { activeTabStore, tabsStore } from "../stores/tabs-store";

// Adaptation from https://github.com/antoinekm/use-chrome/blob/master/src/hooks/tabs/index.ts
export function useTabs(): {
  tabs: Browser.tabs.Tab[];
  activeTab: Browser.tabs.Tab | undefined;
} {
  // Subscribe to the global stores
  // Listeners are automatically initialized via onMount when first subscriber connects
  const tabs = useStore(tabsStore);
  const activeTab = useStore(activeTabStore);

  return {
    tabs,
    activeTab,
  };
}
