import { useState } from 'react';
import { User, AttendanceRecord } from '../App';
import styles from './UserDashboard.module.css';
import {
  LogOut,
  CheckCircle,
  Calendar,
  Clock,
  TrendingUp,
  Award,
  Target,
} from 'lucide-react';
import { StatsCard } from './StatsCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { KPICard } from './KPICard';

type UserDashboardProps = {
  user: User;
  onLogout: () => void;
};

const generateUserAttendance = (userId: string): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const statuses: ('present' | 'absent' | 'late' | 'half-day')[] = [
    'present',
    'present',
    'present',
    'late',
    'half-day',
  ];

  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const status = statuses[Math.floor(Math.random() * statuses.length)];
    records.push({
      id: `${userId}-${dateStr}`,
      userId,
      date: dateStr,
      status,
      checkIn: status !== 'absent' ? '09:00 AM' : undefined,
      checkOut: status !== 'absent' ? '05:30 PM' : undefined,
    });
  }

  return records;
};

export function UserDashboard({ user, onLogout }: UserDashboardProps) {
  const [attendanceRecords] = useState<AttendanceRecord[]>(
    generateUserAttendance(user.id)
  );
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);

  const handleCheckIn = () => {
    setIsCheckedIn(true);
    setCheckInTime(new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }));
  };

  const handleCheckOut = () => {
    setIsCheckedIn(false);
    alert('Checked out successfully!');
  };

  const thisMonthRecords = attendanceRecords.filter((record) => {
    const recordDate = new Date(record.date);
    const now = new Date();
    return (
      recordDate.getMonth() === now.getMonth() &&
      recordDate.getFullYear() === now.getFullYear()
    );
  });

  const presentDays = thisMonthRecords.filter((r) => r.status === 'present').length;
  const lateDays = thisMonthRecords.filter((r) => r.status === 'late').length;
  const absentDays = thisMonthRecords.filter((r) => r.status === 'absent').length;
  const totalDays = thisMonthRecords.length;
  const attendanceRate = Math.round(((presentDays + lateDays) / totalDays) * 100);

  // Calculate 7-day trend for user
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const userTrendData = last7Days.map(date => {
    const record = attendanceRecords.find(r => r.date === date);
    return {
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      status: record ? (record.status === 'present' ? 1 : record.status === 'late' ? 0.7 : 0) : 0,
    };
  });

  // Calculate streak
  let currentStreak = 0;
  const sortedRecords = [...attendanceRecords]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  for (const record of sortedRecords) {
    if (record.status === 'present' || record.status === 'late') {
      currentStreak++;
    } else {
      break;
    }
  }

  const avgCheckInTime = '9:15 AM';
  const onTimeRate = Math.round((presentDays / (presentDays + lateDays)) * 100);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.greeting}>Welcome back, {user.name}!</h1>
            <p className={styles.date}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <button onClick={onLogout} className={styles.logoutButton}>
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.checkInSection}>
          <div className={styles.checkInCard}>
            <div className={styles.checkInHeader}>
              <Clock size={32} className={styles.checkInIcon} />
              <div>
                <h2 className={styles.checkInTitle}>
                  {isCheckedIn ? 'You are checked in' : 'Mark your attendance'}
                </h2>
                <p className={styles.checkInSubtitle}>
                  {isCheckedIn
                    ? `Checked in at ${checkInTime}`
                    : 'Click the button below to check in'}
                </p>
              </div>
            </div>
            <button
              onClick={isCheckedIn ? handleCheckOut : handleCheckIn}
              className={
                isCheckedIn ? styles.checkOutButton : styles.checkInButton
              }
            >
              {isCheckedIn ? 'Check Out' : 'Check In'}
            </button>
          </div>
        </div>

        <div className={styles.kpiGrid}>
          <KPICard
            icon={<Target />}
            title="Monthly Attendance"
            value={`${attendanceRate}%`}
            change={3}
            changeLabel="vs last month"
            color="#667eea"
          />
          <KPICard
            icon={<Award />}
            title="Current Streak"
            value={`${currentStreak} days`}
            color="#48bb78"
          />
          <KPICard
            icon={<Clock />}
            title="Avg Check-in"
            value={avgCheckInTime}
            color="#ed8936"
          />
          <KPICard
            icon={<TrendingUp />}
            title="On-time Rate"
            value={`${onTimeRate}%`}
            change={8}
            changeLabel="vs last month"
            color="#9f7aea"
          />
        </div>

        <div className={styles.statsGrid}>
          <StatsCard
            icon={<CheckCircle />}
            title="Present Days"
            value={presentDays.toString()}
            subtitle="This month"
            color="#48bb78"
          />
          <StatsCard
            icon={<Clock />}
            title="Late Days"
            value={lateDays.toString()}
            subtitle="This month"
            color="#ed8936"
          />
          <StatsCard
            icon={<Calendar />}
            title="Absent Days"
            value={absentDays.toString()}
            subtitle="This month"
            color="#f56565"
          />
          <StatsCard
            icon={<TrendingUp />}
            title="Total Days"
            value={totalDays.toString()}
            subtitle="This month"
            color="#667eea"
          />
        </div>

        <div className={styles.chartSection}>
          <h2 className={styles.sectionTitle}>7-Day Attendance Trend</h2>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={userTrendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#718096"
                  style={{ fontSize: '0.875rem' }}
                />
                <YAxis 
                  domain={[0, 1]}
                  ticks={[0, 0.5, 1]}
                  tickFormatter={(value) => value === 1 ? 'Present' : value === 0.7 ? 'Late' : 'Absent'}
                  stroke="#718096"
                  style={{ fontSize: '0.875rem' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '12px'
                  }}
                  formatter={(value: number) => {
                    if (value === 1) return 'Present';
                    if (value === 0.7) return 'Late';
                    return 'Absent';
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="status" 
                  stroke="#667eea" 
                  strokeWidth={3}
                  dot={{ fill: '#667eea', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.historySection}>
          <h2 className={styles.sectionTitle}>Attendance History</h2>
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <div className={styles.tableCell}>Date</div>
              <div className={styles.tableCell}>Status</div>
              <div className={styles.tableCell}>Check In</div>
              <div className={styles.tableCell}>Check Out</div>
            </div>
            {attendanceRecords.slice(0, 15).map((record) => (
              <div key={record.id} className={styles.tableRow}>
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
                      styles[`status${record.status.charAt(0).toUpperCase() + record.status.slice(1).replace('-', '')}`]
                    }`}
                  >
                    {record.status}
                  </span>
                </div>
                <div className={styles.tableCell}>
                  {record.checkIn || '-'}
                </div>
                <div className={styles.tableCell}>
                  {record.checkOut || '-'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}