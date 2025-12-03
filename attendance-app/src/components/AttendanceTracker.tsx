import { useState } from 'react';
import { Member, AttendanceRecord } from '../App';
import { Check, X, Clock } from 'lucide-react';

type Props = {
  members: Member[];
  attendance: AttendanceRecord[];
  onAddAttendance: (record: Omit<AttendanceRecord, 'id'>) => void;
};

export function AttendanceTracker({ members, attendance, onAddAttendance }: Props) {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState<Record<string, string>>({});

  const getAttendanceStatus = (memberId: string) => {
    const record = attendance.find(
      (a) => a.memberId === memberId && a.date === selectedDate
    );
    return record?.status;
  };

  const handleStatusChange = (
    memberId: string,
    status: 'present' | 'absent' | 'late'
  ) => {
    onAddAttendance({
      memberId,
      date: selectedDate,
      status,
      notes: notes[memberId] || '',
    });
  };

  const handleNotesChange = (memberId: string, value: string) => {
    setNotes({ ...notes, [memberId]: value });
  };

  const getTodayStats = () => {
    const todayAttendance = attendance.filter((a) => a.date === selectedDate);
    return {
      present: todayAttendance.filter((a) => a.status === 'present').length,
      absent: todayAttendance.filter((a) => a.status === 'absent').length,
      late: todayAttendance.filter((a) => a.status === 'late').length,
      total: members.length,
    };
  };

  const stats = getTodayStats();

  return (
    <div>
      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Select Date</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-gray-600 mb-1">Total Members</div>
          <div className="text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-green-700 mb-1">Present</div>
          <div className="text-green-900">{stats.present}</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-red-700 mb-1">Absent</div>
          <div className="text-red-900">{stats.absent}</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-yellow-700 mb-1">Late</div>
          <div className="text-yellow-900">{stats.late}</div>
        </div>
      </div>

      {/* Attendance List */}
      <div className="space-y-4">
        {members.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No members added yet. Go to the Members tab to add members.
          </div>
        ) : (
          members.map((member) => {
            const status = getAttendanceStatus(member.id);
            return (
              <div
                key={member.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-gray-900">{member.name}</div>
                    {member.email && (
                      <div className="text-gray-500">{member.email}</div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusChange(member.id, 'present')}
                      className={`p-2 rounded-lg transition-colors ${
                        status === 'present'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600'
                      }`}
                      title="Present"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleStatusChange(member.id, 'late')}
                      className={`p-2 rounded-lg transition-colors ${
                        status === 'late'
                          ? 'bg-yellow-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-yellow-50 hover:text-yellow-600'
                      }`}
                      title="Late"
                    >
                      <Clock className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleStatusChange(member.id, 'absent')}
                      className={`p-2 rounded-lg transition-colors ${
                        status === 'absent'
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                      }`}
                      title="Absent"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                {status && (
                  <input
                    type="text"
                    placeholder="Add notes (optional)"
                    value={notes[member.id] || ''}
                    onChange={(e) => handleNotesChange(member.id, e.target.value)}
                    onBlur={() => {
                      if (status) {
                        handleStatusChange(member.id, status);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
