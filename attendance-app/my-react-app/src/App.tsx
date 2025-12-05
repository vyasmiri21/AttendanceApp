import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { AdminDashboard } from './components/AdminDashboard';
import { UserDashboard } from './components/UserDashboard';

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  department: string;
};

export type AttendanceRecord = {
  id: string;
  userId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'half-day';
  checkIn?: string;
  checkOut?: string;
  notes?: string;
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <>
      {currentUser.role === 'admin' ? (
        <AdminDashboard user={currentUser} onLogout={handleLogout} />
      ) : (
        <UserDashboard user={currentUser} onLogout={handleLogout} />
      )}
    </>
  );
}
