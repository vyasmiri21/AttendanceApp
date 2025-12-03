import React, { useState } from 'react';
import { ClipboardList, Lock, Mail, User, Shield } from 'lucide-react';

type LoginResult =
  | boolean
  | {
      success: boolean;
      user?: { id: string; [k: string]: any };
      token?: string;
    };

type Props = {
  // NOTE: onLogin may be synchronous (returns boolean) or async (returns boolean | object)
  onLogin: (email: string, password: string, role: 'admin' | 'user') => Promise<LoginResult> | LoginResult;
};

export default function Login({ onLogin }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'user'>('user');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // -- get device location with timeout and fallback --
  const getLocation = () =>
    new Promise<{ latitude: number | null; longitude: number | null; accuracy?: number | null; reason?: string }>(
      (resolve) => {
        if (!navigator.geolocation) {
          return resolve({ latitude: null, longitude: null, reason: 'unsupported' });
        }

        const timer = window.setTimeout(() => {
          resolve({ latitude: null, longitude: null, reason: 'timeout' });
        }, 7000);

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            clearTimeout(timer);
            resolve({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              accuracy: pos.coords.accuracy,
            });
          },
          (err) => {
            clearTimeout(timer);
            resolve({
              latitude: null,
              longitude: null,
              reason: err.code === 1 ? 'permission_denied' : 'error',
            });
          },
          { maximumAge: 60_000, enableHighAccuracy: false, timeout: 7000 }
        );
      }
    );

  // -- send attendance POST --
  const markAttendance = async (payload: {
    user_id_or_email: string;
    latitude: number | null;
    longitude: number | null;
    accuracy?: number | null;
    location_source?: string;
    client_timestamp?: string;
  }) => {
    try {
      // use a relative path by default; change to absolute using VITE_API_BASE_URL if needed
      const base = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(`${base}/api/attendance/mark`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: payload.user_id_or_email,
          latitude: payload.latitude,
          longitude: payload.longitude,
          accuracy: payload.accuracy ?? null,
          location_source: payload.location_source ?? null,
          client_timestamp: payload.client_timestamp ?? new Date().toISOString(),
        }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(`Attendance API error: ${res.status} ${txt}`);
      }
      return true;
    } catch (e) {
      console.error('markAttendance failed:', e);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      // call onLogin (supports sync or async)
      const result = await Promise.resolve(onLogin(email, password, role));

      // normalize result
      let loginOk = false;
      let userId: string | null = null;
      if (typeof result === 'boolean') {
        loginOk = result;
        userId = result ? email : null; // fallback to email if boolean success
      } else if (typeof result === 'object' && result !== null) {
        loginOk = !!result.success;
        userId = result.user?.id ?? result.user?.email ?? email;
      }

      if (!loginOk) {
        setError('Invalid credentials. Please try again.');
        setIsLoading(false);
        return;
      }

      // we are logged in — capture location and send attendance, but don't block UI on failure
      const loc = await getLocation();
      const attendancePayload = {
        user_id_or_email: String(userId),
        latitude: loc.latitude,
        longitude: loc.longitude,
        accuracy: loc.accuracy ?? null,
        location_source: loc.reason ? 'fallback' : 'geolocation',
        client_timestamp: new Date().toISOString(),
      };

      // fire-and-forget mark attendance, but attempt and log failures
      (async () => {
        const ok = await markAttendance(attendancePayload);
        if (!ok) {
          // optional: store to localStorage queue to retry when online
          try {
            const q = JSON.parse(localStorage.getItem('att_q') || '[]');
            q.push(attendancePayload);
            localStorage.setItem('att_q', JSON.stringify(q));
            console.warn('Attendance queued to localStorage for retry.');
          } catch (err) {
            console.error('Failed to enqueue attendance payload', err);
          }
        }
      })();

      // success: you may redirect from onLogin or parent component; keep UI simple here
      // Note: If onLogin returned object with token, parent likely set auth — so just clear form / show success
      setIsLoading(false);
      // optionally: you can navigate or call a callback here to change routes

    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? 'Login failed');
      setIsLoading(false);
    }
  };

  const quickLogin = async (userRole: 'admin' | 'user', demoEmail: string, demoPassword: string) => {
    setIsLoading(true);
    setEmail(demoEmail);
    setPassword(demoPassword);
    setRole(userRole);

    try {
      // call onLogin (don't await location here to keep UX snappy)
      const result = await Promise.resolve(onLogin(demoEmail, demoPassword, userRole));

      let loginOk = false;
      let userId: string | null = null;
      if (typeof result === 'boolean') {
        loginOk = result;
        userId = result ? demoEmail : null;
      } else if (typeof result === 'object' && result !== null) {
        loginOk = !!result.success;
        userId = result.user?.id ?? demoEmail;
      }

      if (!loginOk) {
        setError('Invalid demo credentials.');
        setIsLoading(false);
        return;
      }

      // capture location and send attendance (background)
      const loc = await getLocation();
      const attendancePayload = {
        user_id_or_email: String(userId),
        latitude: loc.latitude,
        longitude: loc.longitude,
        accuracy: loc.accuracy ?? null,
        location_source: loc.reason ? 'fallback' : 'geolocation',
        client_timestamp: new Date().toISOString(),
      };

      (async () => {
        const ok = await markAttendance(attendancePayload);
        if (!ok) {
          try {
            const q = JSON.parse(localStorage.getItem('att_q') || '[]');
            q.push(attendancePayload);
            localStorage.setItem('att_q', JSON.stringify(q));
          } catch {}
        }
      })();
    } catch (err) {
      console.error('quickLogin failed', err);
      setError('Demo login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl shadow-lg mb-4">
            <ClipboardList className="w-10 h-10" />
          </div>
          <h1 className="text-gray-900 mb-2">Attendance Pro</h1>
          <p className="text-gray-600">Enterprise Attendance Management System</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 mb-4 border border-white/20">
          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-3">Sign in as</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('user')}
                className={`p-4 border-2 rounded-xl transition-all ${
                  role === 'user'
                    ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <User className={`w-6 h-6 mx-auto mb-2 ${role === 'user' ? 'text-blue-600' : 'text-gray-600'}`} />
                <div className={role === 'user' ? 'text-blue-600' : 'text-gray-900'}>Employee</div>
                <div className="text-gray-500 text-sm">Mark Attendance</div>
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`p-4 border-2 rounded-xl transition-all ${
                  role === 'admin'
                    ? 'border-purple-600 bg-gradient-to-br from-purple-50 to-pink-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <Shield className={`w-6 h-6 mx-auto mb-2 ${role === 'admin' ? 'text-purple-600' : 'text-gray-600'}`} />
                <div className={role === 'admin' ? 'text-purple-600' : 'text-gray-900'}>Admin</div>
                <div className="text-gray-500 text-sm">Full Access</div>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  disabled={isLoading}
                />
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Demo Credentials */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20">
          <h3 className="text-gray-900 mb-3">Quick Demo Access</h3>
          <div className="space-y-3">
            <button
              onClick={() => quickLogin('admin', 'admin@example.com', 'admin123')}
              disabled={isLoading}
              className="w-full text-left p-4 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border border-purple-200 rounded-lg transition-all disabled:opacity-50"
            >
              <div className="flex items-center gap-3 mb-1">
                <Shield className="w-5 h-5 text-purple-600" />
                <div className="text-purple-900">Admin Dashboard</div>
              </div>
              <div className="text-purple-700 text-sm">admin@example.com / admin123</div>
            </button>
            <button
              onClick={() => quickLogin('user', 'john@example.com', 'user123')}
              disabled={isLoading}
              className="w-full text-left p-4 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border border-green-200 rounded-lg transition-all disabled:opacity-50"
            >
              <div className="flex items-center gap-3 mb-1">
                <User className="w-5 h-5 text-green-600" />
                <div className="text-green-900">Employee Portal</div>
              </div>
              <div className="text-green-700 text-sm">john@example.com / user123</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
