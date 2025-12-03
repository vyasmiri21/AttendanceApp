import { useState } from 'react';
import { Member, AttendanceRecord } from '../../App';
import { Search, Filter, Download, Check, X, Clock, Home, Calendar } from 'lucide-react';

type Props = {
  members: Member[];
  attendance: AttendanceRecord[];
  onAddAttendance: (record: Omit<AttendanceRecord, 'id' | 'timestamp'>) => void;
};

export function AdminAttendance({ members, attendance, onAddAttendance }: Props) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const getDayAttendance = attendance.filter(a => a.date === selectedDate);
  
  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || member.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const getAttendanceStatus = (memberId: string) => {
    return getDayAttendance.find(a => a.memberId === memberId);
  };

  const handleStatusChange = (memberId: string, status: AttendanceRecord['status']) => {
    const now = new Date();
    onAddAttendance({
      memberId,
      date: selectedDate,
      status,
      checkIn: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`,
      location: 'Office',
    });
  };

  const stats = {
    total: filteredMembers.length,
    present: getDayAttendance.filter(a => a.status === 'present').length,
    late: getDayAttendance.filter(a => a.status === 'late').length,
    wfh: getDayAttendance.filter(a => a.status === 'work-from-home').length,
    absent: filteredMembers.length - getDayAttendance.length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-gray-900 mb-1">Attendance Tracker</h2>
          <p className="text-gray-600">Mark and manage daily attendance</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-gray-600 mb-1">Total</div>
          <div className="text-gray-900 text-2xl">{stats.total}</div>
        </div>
        <div className="bg-green-50 rounded-lg border border-green-200 p-4">
          <div className="text-green-700 mb-1">Present</div>
          <div className="text-green-900 text-2xl">{stats.present}</div>
        </div>
        <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
          <div className="text-yellow-700 mb-1">Late</div>
          <div className="text-yellow-900 text-2xl">{stats.late}</div>
        </div>
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
          <div className="text-blue-700 mb-1">WFH</div>
          <div className="text-blue-900 text-2xl">{stats.wfh}</div>
        </div>
        <div className="bg-red-50 rounded-lg border border-red-200 p-4">
          <div className="text-red-700 mb-1">Absent</div>
          <div className="text-red-900 text-2xl">{stats.absent}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            >
              <option value="all">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="HR">HR</option>
              <option value="Operations">Operations</option>
            </select>
          </div>
        </div>
      </div>

      {/* Attendance List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-gray-700">Employee</th>
                <th className="text-left py-3 px-4 text-gray-700">Department</th>
                <th className="text-left py-3 px-4 text-gray-700">Check In</th>
                <th className="text-left py-3 px-4 text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-500">
                    No members found
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => {
                  const record = getAttendanceStatus(member.id);
                  return (
                    <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-gray-900">{member.name}</div>
                            <div className="text-gray-500 text-sm">{member.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-900">{member.department}</td>
                      <td className="py-3 px-4 text-gray-900">
                        {record?.checkIn || '-'}
                      </td>
                      <td className="py-3 px-4">
                        {record ? (
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            record.status === 'present' ? 'bg-green-100 text-green-800' :
                            record.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                            record.status === 'work-from-home' ? 'bg-blue-100 text-blue-800' :
                            record.status === 'half-day' ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {record.status === 'work-from-home' ? 'WFH' : 
                             record.status === 'half-day' ? 'Half Day' :
                             record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                            Not Marked
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleStatusChange(member.id, 'present')}
                            className={`p-2 rounded-lg transition-colors ${
                              record?.status === 'present'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600'
                            }`}
                            title="Present"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleStatusChange(member.id, 'late')}
                            className={`p-2 rounded-lg transition-colors ${
                              record?.status === 'late'
                                ? 'bg-yellow-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-yellow-50 hover:text-yellow-600'
                            }`}
                            title="Late"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleStatusChange(member.id, 'work-from-home')}
                            className={`p-2 rounded-lg transition-colors ${
                              record?.status === 'work-from-home'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                            }`}
                            title="Work From Home"
                          >
                            <Home className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleStatusChange(member.id, 'absent')}
                            className={`p-2 rounded-lg transition-colors ${
                              record?.status === 'absent'
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                            }`}
                            title="Absent"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
