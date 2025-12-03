import { Member, AttendanceRecord } from '../../App';
import { Mail, Phone, Briefcase, Calendar, Building, TrendingUp, LogOut, Award } from 'lucide-react';

type Props = {
  member: Member;
  attendance: AttendanceRecord[];
  onLogout: () => void;
};

export function UserProfile({ member, attendance, onLogout }: Props) {
  const stats = {
    total: attendance.length,
    present: attendance.filter(a => a.status === 'present').length,
    late: attendance.filter(a => a.status === 'late').length,
    wfh: attendance.filter(a => a.status === 'work-from-home').length,
    absent: attendance.filter(a => a.status === 'absent').length,
  };

  const attendanceRate = stats.total > 0 
    ? ((stats.present + stats.late + stats.wfh) / stats.total * 100).toFixed(1)
    : '0';

  const joinDuration = Math.floor(
    (new Date().getTime() - new Date(member.joinDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  const yearsEmployed = Math.floor(joinDuration / 365);
  const monthsEmployed = Math.floor((joinDuration % 365) / 30);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 mb-1">My Profile</h2>
        <p className="text-gray-600">View your profile and performance</p>
      </div>

      {/* Profile Card */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-8 text-white">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center text-4xl">
            {member.name.charAt(0)}
          </div>
          <div>
            <h3 className="mb-1">{member.name}</h3>
            <p className="text-blue-100 mb-2">{member.position}</p>
            <div className="flex items-center gap-2 text-blue-100">
              <Building className="w-4 h-4" />
              {member.department}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {member.email && (
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-lg rounded-lg p-3">
              <Mail className="w-5 h-5" />
              <div>
                <div className="text-blue-100 text-sm">Email</div>
                <div>{member.email}</div>
              </div>
            </div>
          )}
          {member.phone && (
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-lg rounded-lg p-3">
              <Phone className="w-5 h-5" />
              <div>
                <div className="text-blue-100 text-sm">Phone</div>
                <div>{member.phone}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Employment Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="w-5 h-5 text-blue-600" />
          <h3 className="text-gray-900">Employment Information</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="text-gray-600 text-sm">Position</div>
              <div className="text-gray-900">{member.position}</div>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="text-gray-600 text-sm">Department</div>
              <div className="text-gray-900">{member.department}</div>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-600" />
              <div>
                <div className="text-gray-600 text-sm">Joined</div>
                <div className="text-gray-900">
                  {new Date(member.joinDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-gray-900">
                {yearsEmployed > 0 && `${yearsEmployed}y `}
                {monthsEmployed}m
              </div>
              <div className="text-gray-600 text-sm">with company</div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <h3 className="text-gray-900">Attendance Performance</h3>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-600">Overall Attendance Rate</div>
            <div className="text-gray-900 text-2xl">{attendanceRate}%</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all"
              style={{ width: `${attendanceRate}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-gray-600 text-sm mb-1">Total Days</div>
            <div className="text-gray-900 text-2xl">{stats.total}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-green-700 text-sm mb-1">Present</div>
            <div className="text-green-900 text-2xl">{stats.present}</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <div className="text-yellow-700 text-sm mb-1">Late</div>
            <div className="text-yellow-900 text-2xl">{stats.late}</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-blue-700 text-sm mb-1">WFH</div>
            <div className="text-blue-900 text-2xl">{stats.wfh}</div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      {parseFloat(attendanceRate) >= 95 && (
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-yellow-900" />
            </div>
            <div>
              <h3 className="text-yellow-900">Excellent Attendance!</h3>
              <p className="text-yellow-700">You have {attendanceRate}% attendance rate</p>
            </div>
          </div>
        </div>
      )}

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </div>
  );
}
