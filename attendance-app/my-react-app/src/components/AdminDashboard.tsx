import { useState, useEffect } from 'react';
import { User, AttendanceRecord } from '../App';
import styles from './AdminDashboard.module.css';
import {
  LogOut,
  Users,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Menu,
  X,
  Target,
  Activity,
} from 'lucide-react';
import { AttendanceTable } from './AttendanceTable';
import { StatsCard } from './StatsCard';
import { UserManagement } from './UserManagement';
import { AttendanceChart } from './AttendanceChart';
import { DepartmentChart } from './DepartmentChart';
import { StatusDistribution } from './StatusDistribution';
import { KPICard } from './KPICard';
import { DepartmentPerformance } from './DepartmentPerformance';

type AdminDashboardProps = {
  user: User;
  onLogout: () => void;
};

const INITIAL_USERS: User[] = [
  {
    id: '2',
    name: 'John Smith',
    email: 'john@company.com',
    role: 'user',
    department: 'Engineering',
  },
  {
    id: '3',
    name: 'Sarah Johnson',
    email: 'sarah@company.com',
    role: 'user',
    department: 'Design',
  },
  {
    id: '4',
    name: 'Michael Brown',
    email: 'michael@company.com',
    role: 'user',
    department: 'Engineering',
  },
  {
    id: '5',
    name: 'Emily Davis',
    email: 'emily@company.com',
    role: 'user',
    department: 'Marketing',
  },
  {
    id: '6',
    name: 'David Wilson',
    email: 'david@company.com',
    role: 'user',
    department: 'Sales',
  },
];

const generateMockAttendance = (users: User[]): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const statuses: ('present' | 'absent' | 'late' | 'half-day')[] = [
    'present',
    'absent',
    'late',
    'half-day',
  ];

  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    users.forEach((user) => {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      records.push({
        id: `${user.id}-${dateStr}`,
        userId: user.id,
        date: dateStr,
        status,
        checkIn: status !== 'absent' ? '09:00 AM' : undefined,
        checkOut: status !== 'absent' ? '05:30 PM' : undefined,
      });
    });
  }

  return records;
};

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'users'>('overview');
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setAttendanceRecords(generateMockAttendance(users));
  }, [users]);

  const handleAddUser = (newUser: User) => {
    setUsers([...users, newUser]);
  };

  const handleRemoveUser = (userId: string) => {
    setUsers(users.filter((u) => u.id !== userId));
    setAttendanceRecords(attendanceRecords.filter((r) => r.userId !== userId));
  };

  const todayRecords = attendanceRecords.filter(
    (record) => record.date === new Date().toISOString().split('T')[0]
  );

  const presentCount = todayRecords.filter((r) => r.status === 'present').length;
  const absentCount = todayRecords.filter((r) => r.status === 'absent').length;
  const lateCount = todayRecords.filter((r) => r.status === 'late').length;
  const halfDayCount = todayRecords.filter((r) => r.status === 'half-day').length;
  const totalUsers = users.length;
  const attendanceRate = totalUsers > 0 ? Math.round(((presentCount + lateCount) / totalUsers) * 100) : 0;

  // Calculate 7-day trend data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const trendData = last7Days.map(date => {
    const dayRecords = attendanceRecords.filter(r => r.date === date);
    return {
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      present: dayRecords.filter(r => r.status === 'present').length,
      absent: dayRecords.filter(r => r.status === 'absent').length,
      late: dayRecords.filter(r => r.status === 'late').length,
    };
  });

  // Calculate department data
  const departments = [...new Set(users.map(u => u.department))];
  const departmentData = departments.map(dept => ({
    name: dept,
    value: users.filter(u => u.department === dept).length,
  }));

  // Calculate status distribution for today
  const statusData = [
    { name: 'Present', count: presentCount },
    { name: 'Absent', count: absentCount },
    { name: 'Late', count: lateCount },
    { name: 'Half-Day', count: halfDayCount },
  ].filter(item => item.count > 0);

  // Calculate department performance
  const departmentPerformance = departments.map(dept => {
    const deptUsers = users.filter(u => u.department === dept);
    const deptTodayRecords = todayRecords.filter(r => 
      deptUsers.some(u => u.id === r.userId)
    );
    const deptPresent = deptTodayRecords.filter(r => 
      r.status === 'present' || r.status === 'late'
    ).length;
    
    return {
      name: dept,
      totalEmployees: deptUsers.length,
      presentToday: deptPresent,
      attendanceRate: deptUsers.length > 0 
        ? Math.round((deptPresent / deptUsers.length) * 100) 
        : 0,
    };
  });

  // Calculate week-over-week change (mock data for demo)
  const lastWeekRate = 82;
  const rateChange = attendanceRate - lastWeekRate;

  // Calculate average check-in time (mock)
  const avgCheckInTime = '9:12 AM';
  const onTimePercentage = 78;

  return (
    <div className={styles.container}>
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logoWrapper}>
            <Users size={24} />
          </div>
          <span className={styles.logoText}>Attendance</span>
          <button 
            className={styles.closeSidebar}
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className={styles.nav}>
          <button
            onClick={() => {
              setActiveTab('overview');
              setIsSidebarOpen(false);
            }}
            className={activeTab === 'overview' ? styles.navItemActive : styles.navItem}
          >
            <TrendingUp size={20} />
            <span>Overview</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('attendance');
              setIsSidebarOpen(false);
            }}
            className={activeTab === 'attendance' ? styles.navItemActive : styles.navItem}
          >
            <Calendar size={20} />
            <span>Attendance</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('users');
              setIsSidebarOpen(false);
            }}
            className={activeTab === 'users' ? styles.navItemActive : styles.navItem}
          >
            <Users size={20} />
            <span>Users</span>
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>{user.name.charAt(0)}</div>
            <div>
              <div className={styles.userName}>{user.name}</div>
              <div className={styles.userRole}>Administrator</div>
            </div>
          </div>
          <button onClick={onLogout} className={styles.logoutButton}>
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {isSidebarOpen && (
        <div 
          className={styles.overlay}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <main className={styles.main}>
        <header className={styles.header}>
          <button 
            className={styles.menuButton}
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          <div>
            <h1 className={styles.pageTitle}>
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'attendance' && 'Attendance Records'}
              {activeTab === 'users' && 'User Management'}
            </h1>
            <p className={styles.pageSubtitle}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </header>

        <div className={styles.content}>
          {activeTab === 'overview' && (
            <>
              <div className={styles.kpiGrid}>
                <KPICard
                  icon={<Target />}
                  title="Attendance Rate"
                  value={`${attendanceRate}%`}
                  change={rateChange}
                  changeLabel="vs last week"
                  color="#667eea"
                />
                <KPICard
                  icon={<Clock />}
                  title="Avg Check-in Time"
                  value={avgCheckInTime}
                  color="#48bb78"
                />
                <KPICard
                  icon={<Activity />}
                  title="On-time Arrivals"
                  value={`${onTimePercentage}%`}
                  change={5}
                  changeLabel="vs last week"
                  color="#ed8936"
                />
                <KPICard
                  icon={<Users />}
                  title="Active Employees"
                  value={totalUsers.toString()}
                  color="#9f7aea"
                />
              </div>

              <div className={styles.statsGrid}>
                <StatsCard
                  icon={<CheckCircle />}
                  title="Present Today"
                  value={presentCount.toString()}
                  subtitle={`${Math.round((presentCount / totalUsers) * 100)}% of total`}
                  color="#48bb78"
                />
                <StatsCard
                  icon={<Clock />}
                  title="Late Arrivals"
                  value={lateCount.toString()}
                  subtitle={`${Math.round((lateCount / totalUsers) * 100)}% of total`}
                  color="#ed8936"
                />
                <StatsCard
                  icon={<XCircle />}
                  title="Absent Today"
                  value={absentCount.toString()}
                  subtitle={`${Math.round((absentCount / totalUsers) * 100)}% of total`}
                  color="#f56565"
                />
                <StatsCard
                  icon={<AlertCircle />}
                  title="Half-Day"
                  value={halfDayCount.toString()}
                  subtitle={`${Math.round((halfDayCount / totalUsers) * 100)}% of total`}
                  color="#38b2ac"
                />
              </div>

              <div className={styles.chartsGrid}>
                <AttendanceChart data={trendData} />
                <StatusDistribution data={statusData} />
              </div>

              <div className={styles.chartsGrid}>
                <DepartmentPerformance departments={departmentPerformance} />
                <DepartmentChart data={departmentData} />
              </div>

              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Recent Attendance</h2>
                <AttendanceTable
                  records={attendanceRecords.slice(0, 10)}
                  users={users}
                />
              </div>
            </>
          )}

          {activeTab === 'attendance' && (
            <div className={styles.section}>
              <AttendanceTable records={attendanceRecords} users={users} />
            </div>
          )}

          {activeTab === 'users' && (
            <div className={styles.section}>
              <UserManagement 
                users={users}
                onAddUser={handleAddUser}
                onRemoveUser={handleRemoveUser}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}