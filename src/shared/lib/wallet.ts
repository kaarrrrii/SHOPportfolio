"use client";

import { useCallback, useSyncExternalStore } from "react";
import { account } from "@/shared/data/mock";

const WALLET_STORAGE_KEY = "zazhigay-wallet-balance";
const WALLET_EVENT_NAME = "zazhigay-wallet-updated";

function readStoredBalance() {
  if (typeof window === "undefined") {
    return account.balance;
  }

  const storedValue = window.localStorage.getItem(WALLET_STORAGE_KEY);
  const parsedValue = storedValue ? Number(storedValue) : Number.NaN;

  return Number.isFinite(parsedValue) ? parsedValue : account.balance;
}

function writeStoredBalance(value: number) {
  window.localStorage.setItem(WALLET_STORAGE_KEY, String(value));
  window.dispatchEvent(new CustomEvent(WALLET_EVENT_NAME, { detail: value }));
}

function subscribeToWallet(onStoreChange: () => void) {
  function handleStorage(event: StorageEvent) {
    if (event.key === WALLET_STORAGE_KEY) {
      onStoreChange();
    }
  }

  window.addEventListener("storage", handleStorage);
  window.addEventListener(WALLET_EVENT_NAME, onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(WALLET_EVENT_NAME, onStoreChange);
  };
}

export function useWalletBalance() {
  const balance = useSyncExternalStore(
    subscribeToWallet,
    readStoredBalance,
    () => account.balance,
  );

  const setWalletBalance = useCallback((nextBalance: number) => {
    const normalizedBalance = Math.max(0, Math.round(nextBalance));
    writeStoredBalance(normalizedBalance);
  }, []);

  const spendCoins = useCallback(
    (amount: number) => {
      const nextBalance = Math.max(0, balance - Math.max(0, amount));
      setWalletBalance(nextBalance);
      return nextBalance;
    },
    [balance, setWalletBalance],
  );

  const resetWalletBalance = useCallback(() => {
    setWalletBalance(account.balance);
  }, [setWalletBalance]);

  return {
    balance,
    spendCoins,
    setWalletBalance,
    resetWalletBalance,
  };
}
