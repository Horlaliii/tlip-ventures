"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * A <details> menu that works without JavaScript. With JavaScript it also
 * closes after navigating (the layout, and so the menu, stays mounted) and
 * on Escape.
 */
export function MenuDisclosure({ summary, children }: { summary: ReactNode; children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (ref.current) ref.current.open = false;
  }, [pathname]);

  return (
    <details
      ref={ref}
      className="group"
      onKeyDown={(event) => {
        if (event.key === "Escape" && ref.current?.open) {
          ref.current.open = false;
          ref.current.querySelector("summary")?.focus();
        }
      }}
    >
      {summary}
      {children}
    </details>
  );
}
