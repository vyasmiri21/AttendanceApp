import { useState } from 'react';
import { Member, AttendanceRecord, UserSession, LeaveRequest } from '../App';
import { AdminOverview } from './admin/AdminOverview';
import { AdminAttendance } from './admin/AdminAttendance';
import { AdminLeaves } from './admin/AdminLeaves';
import { AdminMembers } from './admin/AdminMembers';
import { AdminReports } from './admin/AdminReports';
import { AdminCalendar } from './admin/AdminCalendar';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Calendar, 
  Users, 
  FileText, 
  CalendarDays,
  LogOut, 
  Shield, 
  Bell,
  Settings
} from 'lucide-react';

type Tab = 'overview' | 'attendance' | 'leaves' | 'members' | 'reports' | 'calendar';

type Props = {
  session: UserSession;
  members: Member[];
  attendance: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  onAddMember: (member: Omit<Member, 'id'>) => void;
  onUpdateMember: (id: string, updates: Partial<Member>) => void;
  onDeleteMember: (id: string) => void;
  onAddAttendance: (record: Omit<AttendanceRecord, 'id' | 'timestamp'>) => void;
  onUpdateLeaveRequest: (id: string, updates: Partial<LeaveRequest>) => void;
  onLogout: () => void;
};

export function AdminDashboard({
  session,
  members,
  attendance,
  leaveRequests,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
  onAddAttendance,
  onUpdateLeaveRequest,
  onLogout,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const tabs = [
    { id: 'overview' as Tab, label: 'Overview', icon: LayoutDashboard },
    { id: 'attendance' as Tab, label: 'Attendance', icon: ClipboardList },
    { id: 'leaves' as Tab, label: 'Leave Requests', icon: Calendar },
    { id: 'members' as Tab, label: 'Team', icon: Users },
    { id: 'calendar' as Tab, label: 'Calendar', icon: CalendarDays },
    { id: 'reports' as Tab, label: 'Reports', icon: FileText },
  ];

  const regularMembers = members.filter((m) => m.id !== 'admin');
  const pendingLeaves = leaveRequests.filter(l => l.status === 'pending').length;

  return (
    <div className="min-h-screen">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-gray-900">Admin Portal</h1>
                <p className="text-gray-500 text-sm">{session.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                {pendingLeaves > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
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
                  <span className="whitespace-nowrap">{tab.label}</span>
                  {tab.id === 'leaves' && pendingLeaves > 0 && (
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      activeTab === tab.id ? 'bg-white/20' : 'bg-red-100 text-red-700'
                    }`}>
                      {pendingLeaves}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div>
          {activeTab === 'overview' && (
            <AdminOverview 
              members={regularMembers} 
              attendance={attendance}
              leaveRequests={leaveRequests}
            />
          )}
          {activeTab === 'attendance' && (
            <AdminAttendance
              members={regularMembers}
              attendance={attendance}
              onAddAttendance={onAddAttendance}
            />
          )}
          {activeTab === 'leaves' && (
            <AdminLeaves
              members={regularMembers}
              leaveRequests={leaveRequests}
              onUpdateLeaveRequest={onUpdateLeaveRequest}
            />
          )}
          {activeTab === 'members' && (
            <AdminMembers
              members={regularMembers}
              attendance={attendance}
              onAddMember={onAddMember}
              onUpdateMember={onUpdateMember}
              onDeleteMember={onDeleteMember}
            />
          )}
          {activeTab === 'calendar' && (
            <AdminCalendar
              members={regularMembers}
              attendance={attendance}
              leaveRequests={leaveRequests}
            />
          )}
          {activeTab === 'reports' && (
            <AdminReports
              members={regularMembers}
              attendance={attendance}
              leaveRequests={leaveRequests}
            />
          )}
        </div>
      </div>
    </div>
  );
}
