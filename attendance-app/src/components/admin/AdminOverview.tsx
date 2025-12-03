import type { Member, AttendanceRecord, LeaveRequest } from '../../App';
import { 
  Users, 
  TrendingUp, 
  Clock, 
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Home
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type Props = {
  members: Member[];
  attendance: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
};

export default function AdminOverview({ members, attendance, leaveRequests }: Props) {
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter(a => a.date === today);
  
  const presentToday = todayAttendance.filter(a => a.status === 'present').length;
  const lateToday = todayAttendance.filter(a => a.status === 'late').length;
  const absentToday = members.length - todayAttendance.length;
  const wfhToday = todayAttendance.filter(a => a.status === 'work-from-home').length;

  const attendanceRate = members.length > 0 
    ? ((presentToday + lateToday + wfhToday) / members.length * 100).toFixed(1)
    : '0';

  const pendingLeaves = leaveRequests.filter(l => l.status === 'pending').length;

  // Last 7 days trend
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const trendData = last7Days.map(date => {
    const dayAttendance = attendance.filter(a => a.date === date);
    return {
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      present: dayAttendance.filter(a => a.status === 'present').length,
      late: dayAttendance.filter(a => a.status === 'late').length,
      wfh: dayAttendance.filter(a => a.status === 'work-from-home').length,
      absent: members.length - dayAttendance.length,
    };
  });

  // Department breakdown
  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Operations'];
  const departmentData = departments.map(dept => {
    const deptMembers = members.filter(m => m.department === dept);
    const deptAttendance = todayAttendance.filter(a => 
      deptMembers.some(m => m.id === a.memberId)
    );
    return {
      name: dept,
      present: deptAttendance.filter(a => a.status === 'present' || a.status === 'work-from-home').length,
      total: deptMembers.length,
    };
  }).filter(d => d.total > 0);

  // Status distribution
  const statusData = [
    { name: 'Present', value: presentToday, color: '#10b981' },
    { name: 'Late', value: lateToday, color: '#f59e0b' },
    { name: 'WFH', value: wfhToday, color: '#3b82f6' },
    { name: 'Absent', value: absentToday, color: '#ef4444' },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-right">
              <div className="text-blue-600 text-sm">Total Team</div>
              <div className="text-gray-900 text-2xl">{members.length}</div>
            </div>
          </div>
          <div className="text-gray-600">Members</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div className="text-right">
              <div className="text-green-100 text-sm">Present Today</div>
              <div className="text-3xl">{presentToday}</div>
            </div>
          </div>
          <div className="text-green-100">{attendanceRate}% attendance rate</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-right">
              <div className="text-orange-600 text-sm">Late / WFH</div>
              <div className="text-gray-900 text-2xl">{lateToday + wfhToday}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4 text-yellow-500" />
            {lateToday} Late
            <Home className="w-4 h-4 text-blue-500 ml-2" />
            {wfhToday} WFH
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-right">
              <div className="text-purple-600 text-sm">Leave Requests</div>
              <div className="text-gray-900 text-2xl">{pendingLeaves}</div>
            </div>
          </div>
          <div className="text-gray-600">Pending approval</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-4">7-Day Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="present" stroke="#10b981" strokeWidth={2} name="Present" />
              <Line type="monotone" dataKey="wfh" stroke="#3b82f6" strokeWidth={2} name="WFH" />
              <Line type="monotone" dataKey="late" stroke="#f59e0b" strokeWidth={2} name="Late" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-4">Today's Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${Math.round((percent ?? 0) * 100)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Department Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
          <h3 className="text-gray-900 mb-4">Department Attendance Today</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="present" fill="#10b981" name="Present" radius={[8, 8, 0, 0]} />
              <Bar dataKey="total" fill="#e5e7eb" name="Total Members" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {attendance
            .filter(a => a.date === today)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 5)
            .map((record) => {
              const member = members.find(m => m.id === record.memberId);
              const statusConfig = {
                present: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
                late: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
                absent: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
                'work-from-home': { icon: Home, color: 'text-blue-600', bg: 'bg-blue-50' },
                'half-day': { icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50' },
              };
              const config = statusConfig[record.status];
              const Icon = config.icon;

              return (
                <div key={record.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${config.bg} rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${config.color}`} />
                    </div>
                    <div>
                      <div className="text-gray-900">{member?.name}</div>
                      <div className="text-gray-500 text-sm">
                        {record.status.replace('-', ' ').charAt(0).toUpperCase() + record.status.slice(1).replace('-', ' ')}
                        {record.checkIn && ` • Check-in: ${record.checkIn}`}
                      </div>
                    </div>
                  </div>
                  <div className="text-gray-500 text-sm">
                    {new Date(record.timestamp).toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
