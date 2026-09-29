"use client";

import { useEffect } from "react";

/** Drops the saved half-finished form once payment is confirmed. */
export default function ClearSavedRegistration({ slug }: { slug: string }) {
  useEffect(() => {
    try {
      sessionStorage.removeItem(`cfs-reg-${slug}`);
    } catch {
      // storage unavailable — nothing to clear
    }
  }, [slug]);
  return null;
}
