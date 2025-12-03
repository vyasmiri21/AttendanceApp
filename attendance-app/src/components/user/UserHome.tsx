import { useState } from 'react';
import type { Member, AttendanceRecord, LeaveRequest } from '../../App';
import { Check, Clock, X, Home, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Props = {
  member: Member;
  attendance: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  onMarkAttendance: (record: Omit<AttendanceRecord, 'id' | 'timestamp'>) => void;
};

export default function UserHome({ member, attendance, leaveRequests, onMarkAttendance }: Props) {
  const [notes, setNotes] = useState('');
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.find(a => a.date === today);

  const handleMarkAttendance = (status: AttendanceRecord['status']) => {
    const now = new Date();
    onMarkAttendance({
      memberId: member.id,
      date: today,
      status,
      checkIn: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`,
      notes,
      location: 'Office',
    });
    setNotes('');
  };

  // Stats
  const stats = {
    total: attendance.length,
    present: attendance.filter(a => a.status === 'present').length,
    late: attendance.filter(a => a.status === 'late').length,
    wfh: attendance.filter(a => a.status === 'work-from-home').length,
  };
  const attendanceRate = stats.total > 0 
    ? ((stats.present + stats.late + stats.wfh) / stats.total * 100).toFixed(1)
    : '0';

  // Last 7 days trend
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const trendData = last7Days.map(date => {
    const record = attendance.find(a => a.date === date);
    return {
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: record ? (record.status === 'present' || record.status === 'work-from-home' ? 1 : 0.5) : 0,
    };
  });

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-8 text-white">
        <h2 className="mb-2">Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, {member.name}!</h2>
        <p className="text-blue-100">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Check-in Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h3 className="text-gray-900">Today's Attendance</h3>
        </div>

        {todayAttendance ? (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-green-900">Attendance Marked</div>
                <div className="text-green-700 text-sm">
                  Status: {todayAttendance.status === 'work-from-home' ? 'Work From Home' :
                           todayAttendance.status === 'half-day' ? 'Half Day' :
                           todayAttendance.status.charAt(0).toUpperCase() + todayAttendance.status.slice(1)}
                </div>
              </div>
            </div>
            {todayAttendance.checkIn && (
              <div className="flex items-center gap-2 text-green-700 text-sm">
                <Clock className="w-4 h-4" />
                Check-in: {todayAttendance.checkIn}
              </div>
            )}
            {todayAttendance.notes && (
              <div className="mt-2 text-green-700 text-sm">
                Note: {todayAttendance.notes}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="w-5 h-5" />
              <span>You haven't marked your attendance today</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <button
            onClick={() => handleMarkAttendance('present')}
            className="flex flex-col items-center gap-2 p-4 bg-green-50 hover:bg-green-100 border-2 border-green-200 rounded-xl transition-all"
          >
            <Check className="w-6 h-6 text-green-600" />
            <span className="text-green-900">Present</span>
          </button>
          <button
            onClick={() => handleMarkAttendance('late')}
            className="flex flex-col items-center gap-2 p-4 bg-yellow-50 hover:bg-yellow-100 border-2 border-yellow-200 rounded-xl transition-all"
          >
            <Clock className="w-6 h-6 text-yellow-600" />
            <span className="text-yellow-900">Late</span>
          </button>
          <button
            onClick={() => handleMarkAttendance('work-from-home')}
            className="flex flex-col items-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-xl transition-all"
          >
            <Home className="w-6 h-6 text-blue-600" />
            <span className="text-blue-900">WFH</span>
          </button>
          <button
            onClick={() => handleMarkAttendance('absent')}
            className="flex flex-col items-center gap-2 p-4 bg-red-50 hover:bg-red-100 border-2 border-red-200 rounded-xl transition-all"
          >
            <X className="w-6 h-6 text-red-600" />
            <span className="text-red-900">Absent</span>
          </button>
        </div>

        <input
          type="text"
          placeholder="Add a note (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <div className="text-gray-600 text-sm">Rate</div>
          </div>
          <div className="text-gray-900 text-2xl">{attendanceRate}%</div>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-4">
          <div className="text-green-700 text-sm mb-2">Present</div>
          <div className="text-green-900 text-2xl">{stats.present}</div>
        </div>
        <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4">
          <div className="text-yellow-700 text-sm mb-2">Late</div>
          <div className="text-yellow-900 text-2xl">{stats.late}</div>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
          <div className="text-blue-700 text-sm mb-2">WFH</div>
          <div className="text-blue-900 text-2xl">{stats.wfh}</div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-gray-900 mb-4">7-Day Attendance Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Upcoming Leaves */}
      {leaveRequests.filter(l => new Date(l.startDate) >= new Date() && l.status === 'approved').length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-4">Upcoming Approved Leaves</h3>
          <div className="space-y-3">
            {leaveRequests
              .filter(l => new Date(l.startDate) >= new Date() && l.status === 'approved')
              .slice(0, 3)
              .map(leave => (
                <div key={leave.id} className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div>
                    <div className="text-blue-900">{leave.type.charAt(0).toUpperCase() + leave.type.slice(1)} Leave</div>
                    <div className="text-blue-700 text-sm">
                      {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    Approved
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
