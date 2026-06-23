"use client";

import { createPortal } from "react-dom";

type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel,
  cancelLabel = "Отмена",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[120] grid place-items-center bg-black/35 px-4 py-6">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="w-full max-w-[420px] rounded-[18px] bg-white p-5 shadow-[0_24px_70px_rgba(0,0,0,0.24)]"
      >
        <h2
          id="confirm-dialog-title"
          className="text-[24px] font-black uppercase leading-[1.05] text-[#111] [font-family:var(--font-unbounded)]"
        >
          {title}
        </h2>
        <p className="mt-3 text-[15px] font-semibold leading-[1.45] text-[#555] [font-family:var(--font-montserrat-alt)]">
          {description}
        </p>
        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-12 items-center justify-center rounded-[10px] border border-[#d8d8d8] bg-white px-5 text-[14px] font-black text-[#111] transition hover:border-[#8B3DFF] hover:text-[#6F22E8] [font-family:var(--font-montserrat-alt)]"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex h-12 items-center justify-center rounded-[10px] bg-[#FF3E80] px-5 text-[14px] font-black text-white shadow-[0_10px_22px_rgba(255,62,128,0.24)] transition hover:bg-[#E82E78] [font-family:var(--font-montserrat-alt)]"
          >
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>,
    document.body,
  );
}
