import styles from './DepartmentPerformance.module.css';
import { TrendingUp, Users, Award } from 'lucide-react';

type DepartmentPerformanceProps = {
  departments: Array<{
    name: string;
    totalEmployees: number;
    presentToday: number;
    attendanceRate: number;
  }>;
};

export function DepartmentPerformance({ departments }: DepartmentPerformanceProps) {
  const sortedDepartments = [...departments].sort((a, b) => b.attendanceRate - a.attendanceRate);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Department Performance</h3>
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <div className={styles.dot} style={{ background: '#48bb78' }} />
            <span>Excellent ({'>'}90%)</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.dot} style={{ background: '#ed8936' }} />
            <span>Good ({'>'}75%)</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.dot} style={{ background: '#f56565' }} />
            <span>Needs Attention</span>
          </div>
        </div>
      </div>
      <div className={styles.list}>
        {sortedDepartments.map((dept, index) => {
          const rateColor = 
            dept.attendanceRate >= 90 ? '#48bb78' : 
            dept.attendanceRate >= 75 ? '#ed8936' : 
            '#f56565';

          return (
            <div key={dept.name} className={styles.item}>
              <div className={styles.rank}>
                {index === 0 && <Award size={20} className={styles.topRank} />}
                {index > 0 && <span>#{index + 1}</span>}
              </div>
              <div className={styles.info}>
                <div className={styles.departmentName}>{dept.name}</div>
                <div className={styles.stats}>
                  <Users size={14} />
                  <span>{dept.presentToday}/{dept.totalEmployees} present</span>
                </div>
              </div>
              <div className={styles.performance}>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill}
                    style={{ 
                      width: `${dept.attendanceRate}%`,
                      background: rateColor
                    }}
                  />
                </div>
                <div className={styles.rate} style={{ color: rateColor }}>
                  {dept.attendanceRate}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}