import { ReactNode } from 'react';
import styles from './StatsCard.module.css';

type StatsCardProps = {
  icon: ReactNode;
  title: string;
  value: string;
  subtitle?: string;
  color: string;
};

export function StatsCard({ icon, title, value, subtitle, color }: StatsCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.iconWrapper} style={{ background: `${color}15` }}>
        <div style={{ color }}>{icon}</div>
      </div>
      <div className={styles.content}>
        <div className={styles.title}>{title}</div>
        <div className={styles.value}>{value}</div>
        {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
      </div>
    </div>
  );
}
