import { useState } from 'react';
import { Member, AttendanceRecord, LeaveRequest } from '../../App';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
  members: Member[];
  attendance: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
};

export function AdminCalendar({ members, attendance, leaveRequests }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getDayData = (day: number) => {
    const date = new Date(year, month, day).toISOString().split('T')[0];
    const dayAttendance = attendance.filter(a => a.date === date);
    const present = dayAttendance.filter(a => a.status === 'present' || a.status === 'work-from-home').length;
    const total = members.length;
    const rate = total > 0 ? Math.round((present / total) * 100) : 0;

    return { date, present, total, rate };
  };

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 mb-1">Attendance Calendar</h2>
        <p className="text-gray-600">Monthly overview of team attendance</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h3 className="text-gray-900">
            {monthNames[month]} {year}
          </h3>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {days.map(day => (
            <div key={day} className="text-center text-gray-600 text-sm py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: startingDayOfWeek }).map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const { date, present, total, rate } = getDayData(day);
            const isToday = date === new Date().toISOString().split('T')[0];
            const isPast = new Date(date) < new Date(new Date().toISOString().split('T')[0]);

            return (
              <div
                key={day}
                className={`aspect-square border rounded-lg p-2 transition-all hover:shadow-md ${
                  isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
                } ${isPast ? 'opacity-75' : ''}`}
              >
                <div className="text-sm text-gray-900 mb-1">{day}</div>
                <div className="text-xs">
                  <div className={`${
                    rate >= 80 ? 'text-green-600' :
                    rate >= 60 ? 'text-yellow-600' :
                    rate > 0 ? 'text-red-600' :
                    'text-gray-400'
                  }`}>
                    {present}/{total}
                  </div>
                  {rate > 0 && (
                    <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                      <div
                        className={`h-1 rounded-full ${
                          rate >= 80 ? 'bg-green-500' :
                          rate >= 60 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${rate}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-gray-600">≥80% Present</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <span className="text-gray-600">60-79% Present</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span className="text-gray-600">&lt;60% Present</span>
          </div>
        </div>
      </div>
    </div>
  );
}