"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import type { CartItem, Order, OrderItem, Product } from "@/shared/data/mock";
import { FIXED_PICKUP_INFO, cartItems, getStudentBySlug, orderHistory } from "@/shared/data/mock";
import {
  getMerchProductFromSnapshot,
  getProductSizeNames,
  getProductSizeStock,
  useMerchProducts,
} from "@/shared/lib/merch";

export type ShopCartLine = CartItem & {
  product: Product;
};

const CART_STORAGE_KEY = "zazhigay-cart-items";
const ORDERS_STORAGE_KEY = "zazhigay-order-history";
const LAST_ORDER_STORAGE_KEY = "zazhigay-last-order-id";
const CART_EVENT_NAME = "zazhigay-cart-updated";
const ORDERS_EVENT_NAME = "zazhigay-orders-updated";
export const ORDER_STATUSES = ["Оформлен", "Готов к выдаче", "Получен"] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

const defaultOrderStudent = getStudentBySlug("smirnova-anna") ?? {
  name: "Смирнова Анна Андреевна",
  group: "24АС-1",
};

let cartSnapshotKey: string | null = null;
let cartSnapshot: CartItem[] = cartItems;
let ordersSnapshotKey: string | null = null;
let ordersSnapshot: Order[] = orderHistory;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function safeParse(value: string | null): unknown {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function getProductSafe(productSlug: string) {
  return getMerchProductFromSnapshot(productSlug) || null;
}

function normalizeQuantity(_value: unknown, stock = Number.POSITIVE_INFINITY) {
  void _value;
  void stock;

  return 1;
}

function createCartItemId(productSlug: string, size: string) {
  return `cart-${productSlug}-${encodeURIComponent(size)}`;
}

function normalizeCartItems(value: unknown): CartItem[] {
  const source = Array.isArray(value) ? value : cartItems;
  const mergedItems = new Map<string, CartItem>();

  for (const rawItem of source) {
    if (!isRecord(rawItem) || typeof rawItem.productSlug !== "string") {
      continue;
    }

    const product = getProductSafe(rawItem.productSlug);

    if (!product) {
      continue;
    }

    const productSizes = getProductSizeNames(product);
    const rawSize = typeof rawItem.size === "string" && rawItem.size.length > 0
      ? rawItem.size
      : productSizes[0] || "One size";
    const size = productSizes.includes(rawSize) ? rawSize : productSizes[0] || "One size";
    const quantity = normalizeQuantity(rawItem.quantity, getProductSizeStock(product, size));
    const key = `${product.slug}::${size}`;
    const existingItem = mergedItems.get(key);

    if (existingItem) {
      mergedItems.set(key, {
        ...existingItem,
        quantity: 1,
        selected: existingItem.selected || rawItem.selected === true,
      });
      continue;
    }

    mergedItems.set(key, {
      id: typeof rawItem.id === "string" && rawItem.id.length > 0
        ? rawItem.id
        : createCartItemId(product.slug, size),
      productSlug: product.slug,
      size,
      quantity,
      selected: typeof rawItem.selected === "boolean" ? rawItem.selected : true,
    });
  }

  return Array.from(mergedItems.values());
}

function readCartSnapshot() {
  if (typeof window === "undefined") {
    return cartItems;
  }

  const storedValue = window.localStorage.getItem(CART_STORAGE_KEY);
  const snapshotKey = storedValue || "__initial_cart__";

  if (snapshotKey === cartSnapshotKey) {
    return cartSnapshot;
  }

  cartSnapshot = normalizeCartItems(safeParse(storedValue));
  cartSnapshotKey = snapshotKey;

  return cartSnapshot;
}

function writeCartSnapshot(nextItems: CartItem[]) {
  const normalizedItems = normalizeCartItems(nextItems);
  const serializedItems = JSON.stringify(normalizedItems);

  cartSnapshot = normalizedItems;
  cartSnapshotKey = serializedItems;
  window.localStorage.setItem(CART_STORAGE_KEY, serializedItems);
  window.dispatchEvent(new CustomEvent(CART_EVENT_NAME));
}

function subscribeToCart(onStoreChange: () => void) {
  function handleStorage(event: StorageEvent) {
    if (event.key === CART_STORAGE_KEY) {
      onStoreChange();
    }
  }

  window.addEventListener("storage", handleStorage);
  window.addEventListener(CART_EVENT_NAME, onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(CART_EVENT_NAME, onStoreChange);
  };
}

function normalizeOrderItems(value: unknown): OrderItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((rawItem) => {
    if (!isRecord(rawItem) || typeof rawItem.productSlug !== "string") {
      return [];
    }

    const product = getProductSafe(rawItem.productSlug);

    if (!product) {
      return [];
    }

    return [{
      productSlug: product.slug,
      quantity: normalizeQuantity(rawItem.quantity, getProductSizeStock(product, typeof rawItem.size === "string" ? rawItem.size : "")),
      size: typeof rawItem.size === "string" && getProductSizeNames(product).includes(rawItem.size)
        ? rawItem.size
        : getProductSizeNames(product)[0] || "One size",
    }];
  });
}

function normalizeOrders(value: unknown): Order[] {
  const source = Array.isArray(value) ? value : orderHistory;

  return source.flatMap((rawOrder) => {
    if (!isRecord(rawOrder) || typeof rawOrder.id !== "string") {
      return [];
    }

    const items = normalizeOrderItems(rawOrder.items);

    if (items.length === 0) {
      return [];
    }

    const status = normalizeOrderStatus(rawOrder.status);

    return [{
      id: rawOrder.id,
      createdAt: typeof rawOrder.createdAt === "string" ? rawOrder.createdAt : formatOrderDate(new Date()),
      studentName: typeof rawOrder.studentName === "string" && rawOrder.studentName.trim()
        ? rawOrder.studentName.trim()
        : defaultOrderStudent.name,
      studentGroup: typeof rawOrder.studentGroup === "string" && rawOrder.studentGroup.trim()
        ? rawOrder.studentGroup.trim()
        : defaultOrderStudent.group,
      status,
      total: normalizeOrderTotal(rawOrder.total, items),
      pickup: FIXED_PICKUP_INFO,
      items,
      timeline: getOrderTimeline(status),
    }];
  });
}

function normalizeOrderStatus(value: unknown): OrderStatus {
  if (value === "Выдан" || value === "Получен") {
    return "Получен";
  }

  if (value === "Готов к выдаче") {
    return "Готов к выдаче";
  }

  return "Оформлен";
}

function getOrderTimeline(status: OrderStatus) {
  if (status === "Получен") {
    return [...ORDER_STATUSES];
  }

  if (status === "Готов к выдаче") {
    return ["Оформлен", "Готов к выдаче"];
  }

  return ["Оформлен"];
}

function normalizeOrderTotal(value: unknown, items: OrderItem[]) {
  const total = Math.round(Number(value));

  if (Number.isFinite(total) && total >= 0) {
    return total;
  }

  return items.reduce((sum, item) => {
    const product = getProductSafe(item.productSlug);

    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
}

function readOrdersSnapshot() {
  if (typeof window === "undefined") {
    return orderHistory;
  }

  const storedValue = window.localStorage.getItem(ORDERS_STORAGE_KEY);
  const snapshotKey = storedValue || "__initial_orders__";

  if (snapshotKey === ordersSnapshotKey) {
    return ordersSnapshot;
  }

  ordersSnapshot = normalizeOrders(safeParse(storedValue));
  ordersSnapshotKey = snapshotKey;

  return ordersSnapshot;
}

function writeOrdersSnapshot(nextOrders: Order[]) {
  const normalizedOrders = normalizeOrders(nextOrders);
  const serializedOrders = JSON.stringify(normalizedOrders);

  ordersSnapshot = normalizedOrders;
  ordersSnapshotKey = serializedOrders;
  window.localStorage.setItem(ORDERS_STORAGE_KEY, serializedOrders);
  window.dispatchEvent(new CustomEvent(ORDERS_EVENT_NAME));
}

function subscribeToOrders(onStoreChange: () => void) {
  function handleStorage(event: StorageEvent) {
    if (event.key === ORDERS_STORAGE_KEY || event.key === LAST_ORDER_STORAGE_KEY) {
      onStoreChange();
    }
  }

  window.addEventListener("storage", handleStorage);
  window.addEventListener(ORDERS_EVENT_NAME, onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(ORDERS_EVENT_NAME, onStoreChange);
  };
}

function formatOrderDate(date: Date) {
  return date
    .toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .replace(/\s?г\.$/, "");
}

function createOrderId(date = new Date()) {
  const year = date.getFullYear();
  const suffix = String(date.getTime() % 100000).padStart(5, "0");

  return `ZG-${year}-${suffix}`;
}

function readLastOrderId() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(LAST_ORDER_STORAGE_KEY) || "";
}

function writeLastOrderId(orderId: string) {
  window.localStorage.setItem(LAST_ORDER_STORAGE_KEY, orderId);
  window.dispatchEvent(new CustomEvent(ORDERS_EVENT_NAME));
}

export function useShopCart() {
  const { products } = useMerchProducts();
  const rawItems = useSyncExternalStore(
    subscribeToCart,
    readCartSnapshot,
    () => cartItems,
  );

  const items = useMemo(
    () =>
      rawItems.flatMap((item) => {
        const product = products.find((productItem) => productItem.slug === item.productSlug);

        return product ? [{ ...item, product }] : [];
      }),
    [products, rawItems],
  );

  const selectedItems = useMemo(() => items.filter((item) => item.selected), [items]);
  const selectedTotal = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [selectedItems],
  );
  const selectedQuantity = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.quantity, 0),
    [selectedItems],
  );
  const totalQuantity = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );
  const isAllSelected = items.length > 0 && items.every((item) => item.selected);

  const updateCartItems = useCallback((updater: (currentItems: CartItem[]) => CartItem[]) => {
    writeCartSnapshot(updater(readCartSnapshot()));
  }, []);

  const addItem = useCallback(
    (productSlug: string, size: string, quantity = 1) => {
      const product = getProductSafe(productSlug);

      if (!product) {
        return;
      }

      const productSizes = getProductSizeNames(product);
      const nextSize = productSizes.includes(size) ? size : productSizes[0] || "One size";
      const nextQuantity = normalizeQuantity(quantity, getProductSizeStock(product, nextSize));

      updateCartItems((currentItems) => {
        const existingItem = currentItems.find(
          (item) =>
            item.productSlug === product.slug &&
            item.size === nextSize,
        );

        if (!existingItem) {
          return [
            ...currentItems,
            {
              id: createCartItemId(product.slug, nextSize),
              productSlug: product.slug,
              size: nextSize,
              quantity: nextQuantity,
              selected: true,
            },
          ];
        }

        return currentItems.map((item) =>
          item.id === existingItem.id
            ? {
                ...item,
                quantity: 1,
                selected: true,
              }
            : item,
        );
      });
    },
    [updateCartItems],
  );

  const removeItem = useCallback(
    (id: string) => {
      updateCartItems((currentItems) => currentItems.filter((item) => item.id !== id));
    },
    [updateCartItems],
  );

  const clearSelected = useCallback(() => {
    updateCartItems((currentItems) => currentItems.filter((item) => !item.selected));
  }, [updateCartItems]);

  const clearCart = useCallback(() => {
    writeCartSnapshot([]);
  }, []);

  const resetCart = useCallback(() => {
    writeCartSnapshot(cartItems);
  }, []);

  const toggleAll = useCallback(() => {
    updateCartItems((currentItems) => {
      const shouldSelectAll = currentItems.some((item) => !item.selected);

      return currentItems.map((item) => ({ ...item, selected: shouldSelectAll }));
    });
  }, [updateCartItems]);

  const toggleItem = useCallback(
    (id: string) => {
      updateCartItems((currentItems) =>
        currentItems.map((item) =>
          item.id === id ? { ...item, selected: !item.selected } : item,
        ),
      );
    },
    [updateCartItems],
  );

  return {
    items,
    selectedItems,
    selectedTotal,
    selectedQuantity,
    totalQuantity,
    isAllSelected,
    addItem,
    removeItem,
    clearSelected,
    clearCart,
    resetCart,
    toggleAll,
    toggleItem,
  };
}

export function useOrderHistory() {
  const orders = useSyncExternalStore(
    subscribeToOrders,
    readOrdersSnapshot,
    () => orderHistory,
  );
  const lastOrderId = typeof window === "undefined" ? "" : readLastOrderId();
  const lastOrder = orders.find((order) => order.id === lastOrderId) || orders[0];

  const createOrder = useCallback((lines: ShopCartLine[]) => {
    const orderItems = lines.map((item) => ({
      productSlug: item.product.slug,
      quantity: item.quantity,
      size: item.size,
    }));
    const total = lines.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const order: Order = {
      id: createOrderId(),
      createdAt: formatOrderDate(new Date()),
      studentName: defaultOrderStudent.name,
      studentGroup: defaultOrderStudent.group,
      status: "Оформлен",
      total,
      pickup: FIXED_PICKUP_INFO,
      items: orderItems,
      timeline: getOrderTimeline("Оформлен"),
    };

    writeOrdersSnapshot([order, ...readOrdersSnapshot()]);
    writeLastOrderId(order.id);

    return order;
  }, []);

  const setOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    writeOrdersSnapshot(
      readOrdersSnapshot().map((order) =>
        order.id === orderId
          ? {
              ...order,
              status,
              timeline: getOrderTimeline(status),
            }
          : order,
      ),
    );
  }, []);

  const markOrderReady = useCallback(
    (orderId: string) => {
      setOrderStatus(orderId, "Готов к выдаче");
    },
    [setOrderStatus],
  );

  const issueOrder = useCallback(
    (orderId: string) => {
      setOrderStatus(orderId, "Получен");
    },
    [setOrderStatus],
  );

  const resetOrders = useCallback(() => {
    writeOrdersSnapshot(orderHistory);
    writeLastOrderId("");
  }, []);

  return {
    orders,
    lastOrderId,
    lastOrder,
    createOrder,
    setOrderStatus,
    markOrderReady,
    issueOrder,
    resetOrders,
  };
}
