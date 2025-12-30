import { browser, type Browser } from "@wxt-dev/browser";
import { atom } from "nanostores";

type Unwrap<T> = T extends Browser.events.Event<infer Inner> ? Inner : never;

/**
 * Global store for all tabs in the current window
 */
export const tabsStore = atom<Browser.tabs.Tab[]>([]);

/**
 * Global store for the active tab in the current window
 */
export const activeTabStore = atom<Browser.tabs.Tab | undefined>(undefined);

// Flag to ensure listeners are only set up once
let listenersInitialized = false;

/**
 * Syncs the current tabs state from the browser to the stores
 */
const sync = async () => {
  const tabs = await browser.tabs.query({ currentWindow: true });
  const activeTab = tabs.find((tab) => tab.active);
  activeTabStore.set(activeTab);
  tabsStore.set(tabs);
};

/**
 * Initializes browser tab event listeners and performs initial sync.
 * This function is idempotent - it will only set up listeners once.
 *
 * Call this function to start tracking tabs state in the stores.
 * For React projects, this is automatically called by the useTabs hook.
 */
export const initializeTabsStore = () => {
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
