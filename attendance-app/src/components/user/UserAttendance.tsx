import { useState } from 'react';
import { AttendanceRecord } from '../../App';
import { Calendar, Filter } from 'lucide-react';

type Props = {
  attendance: AttendanceRecord[];
};

export function UserAttendance({ attendance }: Props) {
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth());
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());

  const filteredAttendance = attendance
    .filter(record => {
      const date = new Date(record.date);
      return date.getMonth() === filterMonth && date.getFullYear() === filterYear;
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800 border-green-200';
      case 'late': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'work-from-home': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'half-day': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'absent': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'work-from-home': return 'Work From Home';
      case 'half-day': return 'Half Day';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 mb-1">My Attendance History</h2>
        <p className="text-gray-600">View your attendance records</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-gray-900">Filter</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2 text-sm">Month</label>
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {months.map((month, index) => (
                <option key={index} value={index}>{month}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2 text-sm">Year</label>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Records */}
      {filteredAttendance.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <div className="text-gray-500">No attendance records for this period</div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAttendance.map((record) => (
            <div
              key={record.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-gray-900">
                    {new Date(record.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                  <div className="text-gray-500 text-sm">
                    {new Date(record.timestamp).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-lg border ${getStatusColor(record.status)}`}>
                  {getStatusLabel(record.status)}
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-3 border-t border-gray-200">
                {record.checkIn && (
                  <div>
                    <div className="text-gray-600 text-sm">Check In</div>
                    <div className="text-gray-900">{record.checkIn}</div>
                  </div>
                )}
                {record.checkOut && (
                  <div>
                    <div className="text-gray-600 text-sm">Check Out</div>
                    <div className="text-gray-900">{record.checkOut}</div>
                  </div>
                )}
                {record.location && (
                  <div>
                    <div className="text-gray-600 text-sm">Location</div>
                    <div className="text-gray-900">{record.location}</div>
                  </div>
                )}
              </div>

              {record.notes && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="text-gray-600 text-sm mb-1">Note</div>
                  <div className="text-gray-900">{record.notes}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
