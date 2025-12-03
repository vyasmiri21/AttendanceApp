import { Member, AttendanceRecord, LeaveRequest } from '../../App';
import { Download, FileText, TrendingUp, Users } from 'lucide-react';

type Props = {
  members: Member[];
  attendance: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
};

export function AdminReports({ members, attendance, leaveRequests }: Props) {
  const exportCSV = (data: any[], filename: string) => {
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  const generateAttendanceReport = () => {
    const reportData = members.map(member => {
      const memberAttendance = attendance.filter(a => a.memberId === member.id);
      const present = memberAttendance.filter(a => a.status === 'present').length;
      const late = memberAttendance.filter(a => a.status === 'late').length;
      const wfh = memberAttendance.filter(a => a.status === 'work-from-home').length;
      const absent = memberAttendance.filter(a => a.status === 'absent').length;
      const total = memberAttendance.length;
      const rate = total > 0 ? ((present + late + wfh) / total * 100).toFixed(1) : '0';

      return {
        Name: member.name,
        Email: member.email,
        Department: member.department,
        Position: member.position,
        Present: present,
        Late: late,
        WFH: wfh,
        Absent: absent,
        Total: total,
        Rate: rate + '%'
      };
    });

    exportCSV(reportData, `attendance-report-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const generateLeaveReport = () => {
    const reportData = leaveRequests.map(request => {
      const member = members.find(m => m.id === request.memberId);
      return {
        Employee: member?.name,
        Department: member?.department,
        Type: request.type,
        StartDate: request.startDate,
        EndDate: request.endDate,
        Status: request.status,
        Reason: request.reason
      };
    });

    exportCSV(reportData, `leave-report-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const departmentStats = ['Engineering', 'Marketing', 'Sales', 'HR', 'Operations'].map(dept => {
    const deptMembers = members.filter(m => m.department === dept);
    const deptAttendance = attendance.filter(a => 
      deptMembers.some(m => m.id === a.memberId)
    );
    const present = deptAttendance.filter(a => a.status === 'present' || a.status === 'work-from-home').length;
    const total = deptAttendance.length;
    const rate = total > 0 ? (present / total * 100).toFixed(1) : '0';

    return { dept, members: deptMembers.length, rate };
  }).filter(d => d.members > 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 mb-1">Reports & Analytics</h2>
        <p className="text-gray-600">Export and analyze attendance data</p>
      </div>

      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="mb-2">Attendance Report</h3>
          <p className="text-blue-100 mb-4">
            Export detailed attendance records for all team members
          </p>
          <button
            onClick={generateAttendanceReport}
            className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg p-6 text-white">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="mb-2">Leave Report</h3>
          <p className="text-purple-100 mb-4">
            Export all leave requests and their approval status
          </p>
          <button
            onClick={generateLeaveReport}
            className="flex items-center gap-2 px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Department Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className="text-gray-900">Department Performance Summary</h3>
        </div>
        <div className="space-y-4">
          {departmentStats.map(({ dept, members: count, rate }) => (
            <div key={dept} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-gray-900">{dept}</div>
                  <div className="text-gray-500 text-sm">{count} members</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-gray-900 text-2xl">{rate}%</div>
                <div className="text-gray-500 text-sm">Attendance Rate</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-gray-600 mb-2">Total Attendance Records</div>
          <div className="text-gray-900 text-3xl">{attendance.length}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-gray-600 mb-2">Total Leave Requests</div>
          <div className="text-gray-900 text-3xl">{leaveRequests.length}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-gray-600 mb-2">Active Team Members</div>
          <div className="text-gray-900 text-3xl">{members.length}</div>
        </div>
      </div>
    </div>
  );
}
