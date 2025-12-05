import { useState } from 'react';
import { User } from '../App';
import styles from './LoginPage.module.css';
import { LogIn, Users } from 'lucide-react';

type LoginPageProps = {
  onLogin: (user: User) => void;
};

const DEMO_USERS: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@company.com',
    role: 'admin',
    department: 'Management',
  },
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
];

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [showDemo, setShowDemo] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = DEMO_USERS.find((u) => u.email === email);
    if (user) {
      onLogin(user);
    } else {
      alert('User not found. Please use one of the demo accounts.');
    }
  };

  const handleDemoLogin = (user: User) => {
    onLogin(user);
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <Users className={styles.icon} />
          </div>
          <h1 className={styles.title}>Attendance System</h1>
          <p className={styles.subtitle}>Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="Enter your email"
              required
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            <LogIn size={20} />
            Sign In
          </button>
        </form>

        <div className={styles.divider}>
          <span>or</span>
        </div>

        <button
          onClick={() => setShowDemo(!showDemo)}
          className={styles.demoButton}
        >
          {showDemo ? 'Hide' : 'Show'} Demo Accounts
        </button>

        {showDemo && (
          <div className={styles.demoAccounts}>
            {DEMO_USERS.map((user) => (
              <button
                key={user.id}
                onClick={() => handleDemoLogin(user)}
                className={styles.demoAccountButton}
              >
                <div>
                  <div className={styles.demoName}>{user.name}</div>
                  <div className={styles.demoEmail}>{user.email}</div>
                </div>
                <span
                  className={
                    user.role === 'admin'
                      ? styles.badgeAdmin
                      : styles.badgeUser
                  }
                >
                  {user.role}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
