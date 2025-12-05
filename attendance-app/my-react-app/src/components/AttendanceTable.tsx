import { User, AttendanceRecord } from '../App';
import styles from './AttendanceTable.module.css';

type AttendanceTableProps = {
  records: AttendanceRecord[];
  users: User[];
};

export function AttendanceTable({ records, users }: AttendanceTableProps) {
  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user?.name || 'Unknown';
  };

  const getUserDepartment = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user?.department || 'N/A';
  };

  return (
    <div className={styles.tableWrapper}>
      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <div className={styles.tableCell}>Employee</div>
          <div className={styles.tableCell}>Department</div>
          <div className={styles.tableCell}>Date</div>
          <div className={styles.tableCell}>Status</div>
          <div className={styles.tableCell}>Check In</div>
          <div className={styles.tableCell}>Check Out</div>
        </div>
        {records.map((record) => (
          <div key={record.id} className={styles.tableRow}>
            <div className={styles.tableCell}>
              <div className={styles.employeeCell}>
                <div className={styles.avatar}>
                  {getUserName(record.userId).charAt(0)}
                </div>
                <span>{getUserName(record.userId)}</span>
              </div>
            </div>
            <div className={styles.tableCell}>
              {getUserDepartment(record.userId)}
            </div>
            <div className={styles.tableCell}>
              {new Date(record.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
            <div className={styles.tableCell}>
              <span
                className={`${styles.statusBadge} ${
                  styles[
                    `status${record.status.charAt(0).toUpperCase() + record.status.slice(1).replace('-', '')}`
                  ]
                }`}
              >
                {record.status}
              </span>
            </div>
            <div className={styles.tableCell}>{record.checkIn || '-'}</div>
            <div className={styles.tableCell}>{record.checkOut || '-'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
