"use client";

import { useSyncExternalStore } from "react";

export const ESDIR_AUTH_URL = "https://www.osu.ru/iss/1win/?";
export const ESDIR_AUTH_STORAGE_KEY = "zazhigay-esdir-authorized";
export const ESDIR_AUTH_ROLE_STORAGE_KEY = "zazhigay-esdir-role";
const ESDIR_AUTH_EVENT_NAME = "zazhigay-esdir-auth-updated";

export type AuthRole = "student" | "admin";

type DemoUser = {
  login: string;
  password: string;
  role: AuthRole;
};

const DEMO_USERS: DemoUser[] = [
  { login: "student", password: "student", role: "student" },
  { login: "admin", password: "admin", role: "admin" },
];

export function getEsdirAuthRole(): AuthRole | null {
  if (typeof window === "undefined") {
    return null;
  }

  const role = window.localStorage.getItem(ESDIR_AUTH_ROLE_STORAGE_KEY);

  if (role === "student" || role === "admin") {
    return role;
  }

  return window.localStorage.getItem(ESDIR_AUTH_STORAGE_KEY) === "true" ? "student" : null;
}

export function isEsdirAuthorized() {
  if (typeof window === "undefined") {
    return false;
  }

  return getEsdirAuthRole() !== null;
}

export function isAdminAuthorized() {
  return getEsdirAuthRole() === "admin";
}

function subscribeToEsdirAuth(onStoreChange: () => void) {
  function handleStorage(event: StorageEvent) {
    if (event.key === ESDIR_AUTH_STORAGE_KEY || event.key === ESDIR_AUTH_ROLE_STORAGE_KEY) {
      onStoreChange();
    }
  }

  window.addEventListener("storage", handleStorage);
  window.addEventListener(ESDIR_AUTH_EVENT_NAME, onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(ESDIR_AUTH_EVENT_NAME, onStoreChange);
  };
}

export function useEsdirAuth() {
  return useSyncExternalStore(subscribeToEsdirAuth, isEsdirAuthorized, () => false);
}

export function useEsdirAuthRole() {
  return useSyncExternalStore(subscribeToEsdirAuth, getEsdirAuthRole, () => null);
}

export function useAdminAuth() {
  return useSyncExternalStore(subscribeToEsdirAuth, isAdminAuthorized, () => false);
}

function authorizeEsdirRole(role: AuthRole) {
  window.localStorage.setItem(ESDIR_AUTH_STORAGE_KEY, "true");
  window.localStorage.setItem(ESDIR_AUTH_ROLE_STORAGE_KEY, role);
  window.dispatchEvent(new CustomEvent(ESDIR_AUTH_EVENT_NAME));
}

export function authorizeEsdirDemo() {
  authorizeEsdirRole("student");
}

export function authorizeAdminDemo() {
  authorizeEsdirRole("admin");
}

export function authorizeByCredentials(login: string, password: string) {
  const normalizedLogin = login.trim().toLowerCase();
  const user = DEMO_USERS.find(
    (item) => item.login === normalizedLogin && item.password === password,
  );

  if (!user) {
    return null;
  }

  authorizeEsdirRole(user.role);

  return user.role;
}

export function logoutEsdirDemo() {
  window.localStorage.removeItem(ESDIR_AUTH_STORAGE_KEY);
  window.localStorage.removeItem(ESDIR_AUTH_ROLE_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(ESDIR_AUTH_EVENT_NAME));
}
