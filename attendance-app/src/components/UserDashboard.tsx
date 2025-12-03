import { useState } from 'react';
import { AttendanceRecord, LeaveRequest, UserSession, Member } from '../App';
import { UserHome } from './user/UserHome';
import { UserAttendance } from './user/UserAttendance';
import { UserLeaves } from './user/UserLeaves';
import { UserProfile } from './user/UserProfile';
import { 
  Home,
  Calendar,
  FileText,
  User,
  LogOut,
  Bell
} from 'lucide-react';

type Tab = 'home' | 'attendance' | 'leaves' | 'profile';

type Props = {
  session: UserSession;
  member: Member;
  attendance: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  onMarkAttendance: (record: Omit<AttendanceRecord, 'id' | 'timestamp'>) => void;
  onAddLeaveRequest: (request: Omit<LeaveRequest, 'id' | 'requestDate' | 'status'>) => void;
  onLogout: () => void;
};

export function UserDashboard({
  session,
  member,
  attendance,
  leaveRequests,
  onMarkAttendance,
  onAddLeaveRequest,
  onLogout,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('home');

  const tabs = [
    { id: 'home' as Tab, label: 'Home', icon: Home },
    { id: 'attendance' as Tab, label: 'Attendance', icon: Calendar },
    { id: 'leaves' as Tab, label: 'Leave', icon: FileText },
    { id: 'profile' as Tab, label: 'Profile', icon: User },
  ];

  const userAttendance = attendance.filter(a => a.memberId === session.userId);
  const userLeaves = leaveRequests.filter(l => l.memberId === session.userId);
  const pendingLeaves = userLeaves.filter(l => l.status === 'pending').length;

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {/* Top Navigation - Desktop */}
      <nav className="hidden md:block bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white">
                {member.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-gray-900">Attendance Pro</h1>
                <p className="text-gray-500 text-sm">{member.position}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                {pendingLeaves > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Header */}
      <div className="md:hidden bg-gradient-to-br from-blue-600 to-indigo-600 p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-xl">
              {member.name.charAt(0)}
            </div>
            <div>
              <div className="text-white">{member.name}</div>
              <div className="text-blue-100 text-sm">{member.position}</div>
            </div>
          </div>
          <button className="relative p-2 text-white hover:bg-white/10 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            {pendingLeaves > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>
        </div>
      </div>

      {/* Desktop Tabs */}
      <div className="hidden md:block max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
                {tab.id === 'leaves' && pendingLeaves > 0 && (
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    activeTab === tab.id ? 'bg-white/20' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {pendingLeaves}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div>
          {activeTab === 'home' && (
            <UserHome
              member={member}
              attendance={userAttendance}
              leaveRequests={userLeaves}
              onMarkAttendance={onMarkAttendance}
            />
          )}
          {activeTab === 'attendance' && (
            <UserAttendance attendance={userAttendance} />
          )}
          {activeTab === 'leaves' && (
            <UserLeaves
              leaveRequests={userLeaves}
              onAddLeaveRequest={onAddLeaveRequest}
            />
          )}
          {activeTab === 'profile' && (
            <UserProfile member={member} attendance={userAttendance} onLogout={onLogout} />
          )}
        </div>
      </div>

      {/* Mobile Content */}
      <div className="md:hidden px-4 py-6">
        {activeTab === 'home' && (
          <UserHome
            member={member}
            attendance={userAttendance}
            leaveRequests={userLeaves}
            onMarkAttendance={onMarkAttendance}
          />
        )}
        {activeTab === 'attendance' && (
          <UserAttendance attendance={userAttendance} />
        )}
        {activeTab === 'leaves' && (
          <UserLeaves
            leaveRequests={userLeaves}
            onAddLeaveRequest={onAddLeaveRequest}
          />
        )}
        {activeTab === 'profile' && (
          <UserProfile member={member} attendance={userAttendance} onLogout={onLogout} />
        )}
      </div>

      {/* Bottom Navigation - Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="grid grid-cols-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex flex-col items-center gap-1 py-3 transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600'
                    : 'text-gray-600'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs">{tab.label}</span>
                {tab.id === 'leaves' && pendingLeaves > 0 && (
                  <span className="absolute top-2 right-1/4 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
