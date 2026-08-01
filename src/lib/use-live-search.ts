"use client";

import { useEffect, useRef } from "react";

interface UseLiveSearchOptions {
  appliedValue?: string | null;
  delayMs?: number;
  enabled?: boolean;
  minLength?: number;
  onSearch: (search: string | null) => void;
  value: string;
}

export function useLiveSearch({
  appliedValue = null,
  delayMs = 350,
  enabled = true,
  minLength = 3,
  onSearch,
  value,
}: UseLiveSearchOptions) {
  const onSearchRef = useRef(onSearch);
  const lastSubmittedRef = useRef(normalizeAppliedSearch(appliedValue));

  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  useEffect(() => {
    lastSubmittedRef.current = normalizeAppliedSearch(appliedValue);
  }, [appliedValue]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const nextSearch = normalizeDraftSearch(value, minLength);

    if (nextSearch === "wait" || nextSearch === lastSubmittedRef.current) {
      return;
    }

    const timer = window.setTimeout(() => {
      lastSubmittedRef.current = nextSearch;
      onSearchRef.current(nextSearch);
    }, delayMs);

    return () => window.clearTimeout(timer);
  }, [delayMs, enabled, minLength, value]);
}

function normalizeAppliedSearch(
  value: string | null | undefined,
): string | null {
  const trimmed = value?.trim() ?? "";

  return trimmed || null;
}

function normalizeDraftSearch(
  value: string,
  minLength: number,
): string | "wait" | null {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  return trimmed.length >= minLength ? trimmed : "wait";
}
