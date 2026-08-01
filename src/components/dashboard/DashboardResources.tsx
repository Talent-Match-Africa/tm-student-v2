import Link from "next/link";
import { ArrowRight01Icon, BookOpen01Icon } from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/shared/HugeIcon";
import type { DashboardResource } from "@/types/student-dashboard";
import styles from "./DashboardPanel.module.css";

interface DashboardResourcesProps {
  items: DashboardResource[];
}

export function DashboardResources({ items }: DashboardResourcesProps) {
  return (
    <article className={styles.panel}>
      <header className={styles.panelHeader}>
        <div>
          <span>Career library</span>
          <h3>Recently published</h3>
        </div>
        <Link href="/resources" aria-label="View all resources">
          <HugeIcon icon={ArrowRight01Icon} size={18} />
        </Link>
      </header>
      {items.length ? (
        <div className={styles.resourceList}>
          {items.map((item) => (
            <Link href={`/resources/${item.id}`} key={item.id}>
              <span>
                <HugeIcon icon={BookOpen01Icon} size={17} />
              </span>
              <div>
                <strong>{item.name}</strong>
                <small>{item.type}</small>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className={styles.empty}>
          New career resources will appear here as they are published.
        </p>
      )}
    </article>
  );
}
