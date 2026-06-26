"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { isStoredMerchImageRef, loadStoredMerchImageObjectUrl } from "@/shared/lib/merch-images";

type MerchImageProps = {
  src: string;
  alt?: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
};

const FALLBACK_PRODUCT_IMAGE = "/худи.png";

export default function MerchImage({
  src,
  alt = "",
  className = "",
  fill = false,
  width,
  height,
  priority = false,
}: MerchImageProps) {
  const [storedImage, setStoredImage] = useState<{ ref: string; objectUrl: string } | null>(null);
  const isStoredImage = isStoredMerchImageRef(src);
  const resolvedSrc = isStoredImage
    ? storedImage?.ref === src
      ? storedImage.objectUrl
      : FALLBACK_PRODUCT_IMAGE
    : src || FALLBACK_PRODUCT_IMAGE;

  useEffect(() => {
    let isDisposed = false;
    let objectUrl = "";

    if (!isStoredMerchImageRef(src)) {
      return;
    }

    loadStoredMerchImageObjectUrl(src)
      .then((nextObjectUrl) => {
        if (!nextObjectUrl) {
          return;
        }

        if (isDisposed) {
          URL.revokeObjectURL(nextObjectUrl);
          return;
        }

        objectUrl = nextObjectUrl;
        setStoredImage({ ref: src, objectUrl: nextObjectUrl });
      })
      .catch(() => {
        // Keep the product fallback visible if the stored browser image is unavailable.
      });

    return () => {
      isDisposed = true;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [src]);

  const fillStyles: CSSProperties | undefined = fill
    ? {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
      }
    : undefined;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolvedSrc}
      alt={alt}
      className={className}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      style={fillStyles}
    />
  );
}
