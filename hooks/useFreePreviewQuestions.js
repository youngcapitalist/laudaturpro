"use client";

import { useCallback, useEffect, useState } from "react";
import { FREE_PREVIEW_LIMIT, previewStorageKey } from "../lib/free-preview";

export function useFreePreviewQuestions(subjectId) {
  const [used, setUsed] = useState(0);
  const key = previewStorageKey(subjectId);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) setUsed(parseInt(stored, 10) || 0);
    } catch {
      /* private mode */
    }
  }, [key]);

  const increment = useCallback(() => {
    const next = used + 1;
    setUsed(next);
    try {
      localStorage.setItem(key, String(next));
    } catch {
      /* ignore */
    }
    return next;
  }, [used, key]);

  const remaining = Math.max(0, FREE_PREVIEW_LIMIT - used);
  const canAsk = used < FREE_PREVIEW_LIMIT;

  return { used, remaining, canAsk, increment, limit: FREE_PREVIEW_LIMIT };
}
