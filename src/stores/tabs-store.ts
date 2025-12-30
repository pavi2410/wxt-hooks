import { browser, type Browser } from "@wxt-dev/browser";
import { atom, onMount } from "nanostores";

type Unwrap<T> = T extends Browser.events.Event<infer Inner> ? Inner : never;

/**
 * Global store for all tabs in the current window.
 *
 * Automatically initializes browser tab listeners when first subscriber connects.
 */
export const tabsStore = atom<Browser.tabs.Tab[]>([]);

/**
 * Global store for the active tab in the current window.
 *
 * Automatically initializes browser tab listeners when first subscriber connects.
 */
export const activeTabStore = atom<Browser.tabs.Tab | undefined>(undefined);

/**
 * Syncs the current tabs state from the browser to the stores
 */
const sync = async () => {
  const tabs = await browser.tabs.query({ currentWindow: true });
  const activeTab = tabs.find((tab) => tab.active);
  activeTabStore.set(activeTab);
  tabsStore.set(tabs);
};

// Use onMount to lazily initialize listeners when first subscriber connects
onMount(tabsStore, () => {
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

  // Return cleanup function to remove listeners when last subscriber disconnects
  return () => {
    browser.tabs.onActivated.removeListener(activateListener);
    browser.tabs.onUpdated.removeListener(updateListener);
    browser.tabs.onCreated.removeListener(createListener);
    browser.tabs.onRemoved.removeListener(removeListener);
  };
});
