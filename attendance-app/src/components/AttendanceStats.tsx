import { Member, AttendanceRecord } from '../App';
import { TrendingUp, Calendar, Users, Percent } from 'lucide-react';

type Props = {
  members: Member[];
  attendance: AttendanceRecord[];
};

export function AttendanceStats({ members, attendance }: Props) {
  const getMemberName = (memberId: string) => {
    return members.find((m) => m.id === memberId)?.name || 'Unknown';
  };

  const calculateMemberStats = (memberId: string) => {
    const memberRecords = attendance.filter((a) => a.memberId === memberId);
    const present = memberRecords.filter((a) => a.status === 'present').length;
    const late = memberRecords.filter((a) => a.status === 'late').length;
    const absent = memberRecords.filter((a) => a.status === 'absent').length;
    const total = memberRecords.length;
    const rate = total > 0 ? ((present + late) / total) * 100 : 0;

    return { present, late, absent, total, rate };
  };

  const getOverallStats = () => {
    const totalRecords = attendance.length;
    const present = attendance.filter((a) => a.status === 'present').length;
    const late = attendance.filter((a) => a.status === 'late').length;
    const absent = attendance.filter((a) => a.status === 'absent').length;
    const rate = totalRecords > 0 ? ((present + late) / totalRecords) * 100 : 0;

    return { totalRecords, present, late, absent, rate };
  };

  const getUniqueDates = () => {
    const dates = new Set(attendance.map((a) => a.date));
    return dates.size;
  };

  const overallStats = getOverallStats();
  const uniqueDates = getUniqueDates();

  const memberStats = members
    .map((member) => ({
      ...member,
      stats: calculateMemberStats(member.id),
    }))
    .sort((a, b) => b.stats.rate - a.stats.rate);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-gray-900 mb-1">Attendance Statistics</h2>
        <p className="text-gray-600">Overview of attendance performance</p>
      </div>

      {/* Overall Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <div className="text-blue-700">Total Days Tracked</div>
          </div>
          <div className="text-blue-900">{uniqueDates}</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-purple-600" />
            <div className="text-purple-700">Total Members</div>
          </div>
          <div className="text-purple-900">{members.length}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <div className="text-green-700">Total Records</div>
          </div>
          <div className="text-green-900">{overallStats.totalRecords}</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Percent className="w-5 h-5 text-orange-600" />
            <div className="text-orange-700">Overall Rate</div>
          </div>
          <div className="text-orange-900">{overallStats.rate.toFixed(1)}%</div>
        </div>
      </div>

      {/* Overall Distribution */}
      <div className="mb-8 p-4 border border-gray-200 rounded-lg">
        <h3 className="text-gray-900 mb-4">Overall Distribution</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-gray-600 mb-1">Present</div>
            <div className="text-green-600">{overallStats.present} records</div>
          </div>
          <div>
            <div className="text-gray-600 mb-1">Late</div>
            <div className="text-yellow-600">{overallStats.late} records</div>
          </div>
          <div>
            <div className="text-gray-600 mb-1">Absent</div>
            <div className="text-red-600">{overallStats.absent} records</div>
          </div>
        </div>
      </div>

      {/* Member-wise Statistics */}
      <div>
        <h3 className="text-gray-900 mb-4">Member-wise Statistics</h3>
        {memberStats.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No statistics available yet
          </div>
        ) : (
          <div className="space-y-4">
            {memberStats.map((member) => (
              <div
                key={member.id}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-gray-900">{member.name}</div>
                    {member.email && (
                      <div className="text-gray-500">{member.email}</div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-gray-900">
                      {member.stats.rate.toFixed(1)}%
                    </div>
                    <div className="text-gray-500">Attendance Rate</div>
                  </div>
                </div>

                {/* Progress Bar */}
                {member.stats.total > 0 && (
                  <div className="mb-3">
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-green-600 h-3 rounded-full"
                        style={{
                          width: `${
                            (member.stats.present / member.stats.total) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Detailed Stats */}
                <div className="grid grid-cols-4 gap-3">
                  <div className="bg-gray-50 p-2 rounded text-center">
                    <div className="text-gray-600">Total</div>
                    <div className="text-gray-900">{member.stats.total}</div>
                  </div>
                  <div className="bg-green-50 p-2 rounded text-center">
                    <div className="text-green-700">Present</div>
                    <div className="text-green-900">{member.stats.present}</div>
                  </div>
                  <div className="bg-yellow-50 p-2 rounded text-center">
                    <div className="text-yellow-700">Late</div>
                    <div className="text-yellow-900">{member.stats.late}</div>
                  </div>
                  <div className="bg-red-50 p-2 rounded text-center">
                    <div className="text-red-700">Absent</div>
                    <div className="text-red-900">{member.stats.absent}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
