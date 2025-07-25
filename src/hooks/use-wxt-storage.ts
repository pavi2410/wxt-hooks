import type { WxtStorageItem } from "@wxt-dev/storage";
import { useCallback, useEffect, useState } from "react";

export function useWxtStorage<T>(
  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  storageItem: WxtStorageItem<T, {}>,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(storageItem.fallback);

  // get initial value
  useEffect(() => {
    let isMounted = true;
    storageItem
      .getValue()
      .then((initialValue) => {
        if (isMounted) {
          setValue(initialValue);
        }
      })
      .catch((error) => {
        console.error("Failed to get initial value:", error);
      });

    return () => {
      isMounted = false;
    };
  }, [storageItem]);

  // subscribe to changes
  useEffect(() => {
    const unwatch = storageItem.watch((newValue) => {
      setValue(newValue);
    });

    return () => unwatch();
  }, [storageItem]);

  // Create a stable setter function
  const updateValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      const resolvedValue = typeof newValue === 'function' ? (newValue as (prev: T) => T)(value) : newValue;
      storageItem.setValue(resolvedValue).catch((error) => {
        console.error("Failed to update storage value:", error);
      });
    },
    [storageItem, value],
  );

  return [value, updateValue];
}