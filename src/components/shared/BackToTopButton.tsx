"use client";

import { useEffect, useState } from "react";
import { ArrowUp01Icon } from "@hugeicons/core-free-icons";
import { HugeIcon } from "./HugeIcon";
import styles from "./BackToTopButton.module.css";

export function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const scrollRoot = document.querySelector("main");
    if (!(scrollRoot instanceof HTMLElement)) return;
    const update = () => setVisible(scrollRoot.scrollTop > 720);
    update();
    scrollRoot.addEventListener("scroll", update, { passive: true });
    return () => scrollRoot.removeEventListener("scroll", update);
  }, []);

  if (!visible) return null;
  return (
    <button
      aria-label="Back to top"
      className={styles.button}
      onClick={() =>
        document.querySelector("main")?.scrollTo({ behavior: "smooth", top: 0 })
      }
      title="Back to top"
      type="button"
    >
      <HugeIcon icon={ArrowUp01Icon} size={19} />
    </button>
  );
}
