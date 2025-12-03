import { useState } from 'react';
import { Member, LeaveRequest } from '../../App';
import { Check, X, Clock, Calendar, FileText, User } from 'lucide-react';

type Props = {
  members: Member[];
  leaveRequests: LeaveRequest[];
  onUpdateLeaveRequest: (id: string, updates: Partial<LeaveRequest>) => void;
};

export function AdminLeaves({ members, leaveRequests, onUpdateLeaveRequest }: Props) {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const getMemberName = (memberId: string) => {
    return members.find(m => m.id === memberId)?.name || 'Unknown';
  };

  const handleApprove = (id: string) => {
    onUpdateLeaveRequest(id, {
      status: 'approved',
      reviewedBy: 'admin',
      reviewDate: new Date().toISOString(),
    });
  };

  const handleReject = (id: string) => {
    onUpdateLeaveRequest(id, {
      status: 'rejected',
      reviewedBy: 'admin',
      reviewDate: new Date().toISOString(),
    });
  };

  const filteredRequests = leaveRequests
    .filter(req => filterStatus === 'all' || req.status === filterStatus)
    .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime());

  const stats = {
    total: leaveRequests.length,
    pending: leaveRequests.filter(l => l.status === 'pending').length,
    approved: leaveRequests.filter(l => l.status === 'approved').length,
    rejected: leaveRequests.filter(l => l.status === 'rejected').length,
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sick': return 'bg-red-100 text-red-800';
      case 'vacation': return 'bg-blue-100 text-blue-800';
      case 'personal': return 'bg-purple-100 text-purple-800';
      case 'unpaid': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-gray-900 mb-1">Leave Management</h2>
        <p className="text-gray-600">Review and manage leave requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-gray-600 mb-1">Total Requests</div>
          <div className="text-gray-900 text-2xl">{stats.total}</div>
        </div>
        <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
          <div className="flex items-center gap-2 text-yellow-700 mb-1">
            <Clock className="w-4 h-4" />
            Pending
          </div>
          <div className="text-yellow-900 text-2xl">{stats.pending}</div>
        </div>
        <div className="bg-green-50 rounded-lg border border-green-200 p-4">
          <div className="flex items-center gap-2 text-green-700 mb-1">
            <Check className="w-4 h-4" />
            Approved
          </div>
          <div className="text-green-900 text-2xl">{stats.approved}</div>
        </div>
        <div className="bg-red-50 rounded-lg border border-red-200 p-4">
          <div className="flex items-center gap-2 text-red-700 mb-1">
            <X className="w-4 h-4" />
            Rejected
          </div>
          <div className="text-red-900 text-2xl">{stats.rejected}</div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex gap-2 overflow-x-auto">
          {(['all', 'pending', 'approved', 'rejected'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                filterStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <div className="text-gray-500">No leave requests found</div>
          </div>
        ) : (
          filteredRequests.map((request) => {
            const member = members.find(m => m.id === request.memberId);
            const daysDiff = Math.ceil(
              (new Date(request.endDate).getTime() - new Date(request.startDate).getTime()) 
              / (1000 * 60 * 60 * 24)
            ) + 1;

            return (
              <div
                key={request.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white">
                        <User className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="text-gray-900">{getMemberName(request.memberId)}</div>
                          <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(request.type)}`}>
                            {request.type.charAt(0).toUpperCase() + request.type.slice(1)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(request.status)}`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </div>
                        <div className="text-gray-600 text-sm">
                          {member?.department} • {member?.position}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="text-gray-600 text-sm mb-1">Duration</div>
                        <div className="flex items-center gap-2 text-gray-900">
                          <Calendar className="w-4 h-4" />
                          {daysDiff} {daysDiff === 1 ? 'day' : 'days'}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-sm mb-1">Start Date</div>
                        <div className="text-gray-900">
                          {new Date(request.startDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-sm mb-1">End Date</div>
                        <div className="text-gray-900">
                          {new Date(request.endDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <FileText className="w-4 h-4 text-gray-600 mt-0.5" />
                        <div>
                          <div className="text-gray-600 text-sm mb-1">Reason</div>
                          <div className="text-gray-900">{request.reason}</div>
                        </div>
                      </div>
                    </div>

                    {request.reviewDate && (
                      <div className="mt-3 text-gray-500 text-sm">
                        Reviewed on {new Date(request.reviewDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    )}
                  </div>

                  {request.status === 'pending' && (
                    <div className="flex md:flex-col gap-2">
                      <button
                        onClick={() => handleApprove(request.id)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
