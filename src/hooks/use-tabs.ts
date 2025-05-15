import { browser, type Browser } from "@wxt-dev/browser";
import { useEffect, useState } from "react";

type Unwrap<T> = T extends Browser.events.Event<infer Inner> ? Inner : never;

// Adaptation from https://github.com/antoinekm/use-chrome/blob/master/src/hooks/tabs/index.ts
export function useTabs() {
  const [tabs, setTabs] = useState<Browser.tabs.Tab[]>([]);
  const [activeTab, setActiveTab] = useState<Browser.tabs.Tab | undefined>(undefined);

  const sync = async () => {
    const tabs = await browser.tabs.query({ currentWindow: true });
    const activeTab = tabs.find((tab) => tab.active);
    setActiveTab(activeTab);
    setTabs(tabs);
  };

  // subscribe to tab events
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    let isMounted = true;

    const activateListener: Unwrap<Browser.tabs.TabActivatedEvent> = (activeInfo) => {
      // console.debug("Tab activated");
      if (isMounted) {
        sync();
      }
    };

    const updateListener: Unwrap<Browser.tabs.TabUpdatedEvent> = (tabId, changeInfo, tab) => {
      if (changeInfo.status === "complete") {
        // console.debug("Tab updated");
        if (isMounted) {
          sync();
        }
      }
    };

    const createListener: Unwrap<Browser.tabs.TabCreatedEvent> = (tab) => {
      // console.debug("Tab created");
      if (isMounted) {
        sync();
      }
    };

    const removeListener: Unwrap<Browser.tabs.TabRemovedEvent> = (tabId) => {
      // console.debug("Tab removed");
      if (isMounted) {
        sync();
      }
    };

    browser.tabs.onActivated.addListener(activateListener);
    browser.tabs.onUpdated.addListener(updateListener);
    browser.tabs.onCreated.addListener(createListener);
    browser.tabs.onRemoved.addListener(removeListener);

    // initial sync
    sync();

    return () => {
      isMounted = false;
      browser.tabs.onActivated.removeListener(activateListener);
      browser.tabs.onUpdated.removeListener(updateListener);
      browser.tabs.onCreated.removeListener(createListener);
      browser.tabs.onRemoved.removeListener(removeListener);
    };
  }, []);

  return {
    tabs,
    activeTab,
  };
}