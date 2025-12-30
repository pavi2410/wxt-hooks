import { browser, type Browser } from "@wxt-dev/browser";
import { atom } from "nanostores";
import { useStore } from "@nanostores/react";

type Unwrap<T> = T extends Browser.events.Event<infer Inner> ? Inner : never;

// Global stores for tabs state
const tabsStore = atom<Browser.tabs.Tab[]>([]);
const activeTabStore = atom<Browser.tabs.Tab | undefined>(undefined);

// Flag to ensure listeners are only set up once
let listenersInitialized = false;

// Sync function to update the stores
const sync = async () => {
  const tabs = await browser.tabs.query({ currentWindow: true });
  const activeTab = tabs.find((tab) => tab.active);
  activeTabStore.set(activeTab);
  tabsStore.set(tabs);
};

// Initialize browser tab listeners once globally
const initializeListeners = () => {
  if (listenersInitialized) return;
  listenersInitialized = true;

  const activateListener: Unwrap<typeof Browser.tabs.onActivated> = () => {
    sync();
  };

  const updateListener: Unwrap<typeof Browser.tabs.onUpdated> = (tabId, changeInfo) => {
    if (changeInfo.status === "complete") {
      sync();
    }
  };

  const createListener: Unwrap<typeof Browser.tabs.onCreated> = () => {
    sync();
  };

  const removeListener: Unwrap<typeof Browser.tabs.onRemoved> = () => {
    sync();
  };

  browser.tabs.onActivated.addListener(activateListener);
  browser.tabs.onUpdated.addListener(updateListener);
  browser.tabs.onCreated.addListener(createListener);
  browser.tabs.onRemoved.addListener(removeListener);

  // Initial sync
  sync();
};

// Adaptation from https://github.com/antoinekm/use-chrome/blob/master/src/hooks/tabs/index.ts
export function useTabs(): {
  tabs: Browser.tabs.Tab[];
  activeTab: Browser.tabs.Tab | undefined;
} {
  // Initialize listeners on first hook call
  initializeListeners();

  // Subscribe to the global stores
  const tabs = useStore(tabsStore);
  const activeTab = useStore(activeTabStore);

  return {
    tabs,
    activeTab,
  };
}
