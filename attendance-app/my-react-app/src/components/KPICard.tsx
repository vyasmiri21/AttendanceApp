import { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import styles from './KPICard.module.css';

type KPICardProps = {
  title: string;
  value: string;
  change?: number;
  changeLabel?: string;
  icon: ReactNode;
  color: string;
};

export function KPICard({ title, value, change, changeLabel, icon, color }: KPICardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.iconWrapper} style={{ background: `${color}15` }}>
          <div style={{ color }}>{icon}</div>
        </div>
        <div className={styles.titleSection}>
          <div className={styles.title}>{title}</div>
          <div className={styles.value}>{value}</div>
        </div>
      </div>
      {change !== undefined && (
        <div className={styles.footer}>
          <div className={`${styles.change} ${isPositive ? styles.positive : isNegative ? styles.negative : ''}`}>
            {isPositive && <TrendingUp size={16} />}
            {isNegative && <TrendingDown size={16} />}
            <span>{change > 0 ? '+' : ''}{change}%</span>
          </div>
          {changeLabel && <span className={styles.changeLabel}>{changeLabel}</span>}
        </div>
      )}
    </div>
  );
}
