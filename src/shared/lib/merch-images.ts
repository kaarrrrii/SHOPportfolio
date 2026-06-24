"use client";

const MERCH_IMAGE_DB_NAME = "zazhigay-merch-images";
const MERCH_IMAGE_STORE_NAME = "images";
const MERCH_IMAGE_DB_VERSION = 1;
const MERCH_IMAGE_REF_PREFIX = "merch-image:";

type StoredMerchImage = {
  id: string;
  blob: Blob;
  createdAt: number;
  type: string;
  size: number;
};

export function isStoredMerchImageRef(value: string) {
  return value.startsWith(MERCH_IMAGE_REF_PREFIX);
}

export function isInlineMerchImageSrc(value: string) {
  return value.startsWith("data:image/");
}

export async function saveMerchImageBlob(blob: Blob) {
  if (!blob.type.startsWith("image/")) {
    throw new Error("MERCH_IMAGE_INVALID_TYPE");
  }

  const id = createMerchImageId();
  const db = await openMerchImageDb();
  const transaction = db.transaction(MERCH_IMAGE_STORE_NAME, "readwrite");

  transaction.objectStore(MERCH_IMAGE_STORE_NAME).put({
    id,
    blob,
    createdAt: Date.now(),
    type: blob.type,
    size: blob.size,
  } satisfies StoredMerchImage);

  await waitForTransaction(transaction, db);

  return `${MERCH_IMAGE_REF_PREFIX}${id}`;
}

export async function saveMerchImageDataUrl(dataUrl: string) {
  const blob = await dataUrlToBlob(dataUrl);

  return saveMerchImageBlob(blob);
}

export async function loadStoredMerchImageObjectUrl(ref: string) {
  const blob = await loadStoredMerchImageBlob(ref);

  return blob ? URL.createObjectURL(blob) : "";
}

export async function removeStoredMerchImage(ref: string) {
  if (!isStoredMerchImageRef(ref)) {
    return;
  }

  const id = getMerchImageId(ref);
  const db = await openMerchImageDb();
  const transaction = db.transaction(MERCH_IMAGE_STORE_NAME, "readwrite");

  transaction.objectStore(MERCH_IMAGE_STORE_NAME).delete(id);

  await waitForTransaction(transaction, db);
}

export async function migrateInlineMerchProductImages<T extends { imageSrc: string }>(products: T[]) {
  let hasChanges = false;

  const migratedProducts = await Promise.all(
    products.map(async (product) => {
      if (!isInlineMerchImageSrc(product.imageSrc)) {
        return product;
      }

      const imageSrc = await saveMerchImageDataUrl(product.imageSrc);
      hasChanges = true;

      return {
        ...product,
        imageSrc,
      };
    }),
  );

  return hasChanges ? migratedProducts : products;
}

function openMerchImageDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("MERCH_IMAGE_STORAGE_UNAVAILABLE"));
      return;
    }

    const request = window.indexedDB.open(MERCH_IMAGE_DB_NAME, MERCH_IMAGE_DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(MERCH_IMAGE_STORE_NAME)) {
        db.createObjectStore(MERCH_IMAGE_STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("MERCH_IMAGE_DB_OPEN_FAILED"));
  });
}

async function loadStoredMerchImageBlob(ref: string) {
  if (!isStoredMerchImageRef(ref)) {
    return null;
  }

  const db = await openMerchImageDb();

  return new Promise<Blob | null>((resolve, reject) => {
    const request = db
      .transaction(MERCH_IMAGE_STORE_NAME, "readonly")
      .objectStore(MERCH_IMAGE_STORE_NAME)
      .get(getMerchImageId(ref));

    request.onsuccess = () => {
      const record = request.result as StoredMerchImage | undefined;

      db.close();
      resolve(record?.blob ?? null);
    };
    request.onerror = () => {
      db.close();
      reject(request.error ?? new Error("MERCH_IMAGE_READ_FAILED"));
    };
  });
}

function waitForTransaction(transaction: IDBTransaction, db: IDBDatabase) {
  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
    transaction.onerror = () => {
      db.close();
      reject(transaction.error ?? new Error("MERCH_IMAGE_TRANSACTION_FAILED"));
    };
    transaction.onabort = () => {
      db.close();
      reject(transaction.error ?? new Error("MERCH_IMAGE_TRANSACTION_ABORTED"));
    };
  });
}

async function dataUrlToBlob(dataUrl: string) {
  const response = await fetch(dataUrl);

  if (!response.ok) {
    throw new Error("MERCH_IMAGE_DATA_URL_INVALID");
  }

  return response.blob();
}

function createMerchImageId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `img-${crypto.randomUUID()}`;
  }

  return `img-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function getMerchImageId(ref: string) {
  return ref.slice(MERCH_IMAGE_REF_PREFIX.length);
}
