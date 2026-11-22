"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { uploadReceiptFile } from "@/actions/registration/actions";
import { validateSlip } from "@/validations/registration";

export type ReceiptUploadState = {
  file: File | null;
  key: string;
  status: "idle" | "uploading" | "done" | "error";
  progress: number;
  error?: string;
};

const IDLE: ReceiptUploadState = {
  file: null,
  key: "",
  status: "idle",
  progress: 0,
};

export function useReceiptUpload() {
  const [state, setState] = useState<ReceiptUploadState>(IDLE);
  const abortRef = useRef<(() => void) | null>(null);
  const gen = useRef(0);

  const choose = useCallback((file: File | null) => {
    const id = ++gen.current;
    abortRef.current?.();
    abortRef.current = null;
    if (!file) return setState(IDLE);

    const invalid = validateSlip(file);
    if (invalid) {
      return setState({
        file,
        key: "",
        status: "error",
        progress: 0,
        error: invalid,
      });
    }

    const patch = (update: Partial<ReceiptUploadState>) =>
      setState((current) =>
        gen.current === id ? { ...current, ...update } : current,
      );

    setState({ file, key: "", status: "uploading", progress: 8 });
    let cancelled = false;
    abortRef.current = () => {
      cancelled = true;
    };
    const formData = new FormData();
    formData.set("file", file);
    uploadReceiptFile(formData).then(
      (result) => {
        if (cancelled) return;
        if (!result.ok) {
          patch({ status: "error", error: result.error });
          return;
        }
        patch({
          key: result.key,
          status: "done",
          progress: 100,
          error: undefined,
        });
      },
      () => {
        if (cancelled) return;
        patch({
          status: "error",
          error: "Upload failed. Please try again.",
        });
      },
    );
  }, []);

  useEffect(() => () => abortRef.current?.(), []);

  return { ...state, choose, retry: () => choose(state.file) };
}

export type ReceiptUpload = ReturnType<typeof useReceiptUpload>;
