import { ShieldCheck } from "lucide-react";
import styles from "../../../../styles/Admin.module.css";

interface AdminAuthHeaderProps {
  title: string;
  highlight: string;
  subtitle: string;
}

export function AdminAuthHeader({ title, highlight, subtitle }: AdminAuthHeaderProps) {
  return (
    <div className={styles.authHeader}>
      <div className={styles.authIconWrapper}>
        <ShieldCheck size={26} />
      </div>
      <h1 className={styles.authTitle}>
        {title} <span style={{ color: "#10b981" }}>{highlight}</span>
      </h1>
      <p className={styles.authSubtitle}>{subtitle}</p>
    </div>
  );
}
