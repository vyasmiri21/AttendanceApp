// App.tsx
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import UserHome from "./components/user/UserHome";
import AdminOverview from "./components/admin/AdminOverview";

export type Department = "Engineering" | "Marketing" | "Sales" | "HR" | "Operations";

export type Member = {
  id: string;
  name: string;
  email: string;
  password?: string;
  department: Department;
  position: string;
  joinDate: string;
  avatar?: string;
  phone?: string;
};

export type AttendanceRecord = {
  id: string;
  memberId: string;
  date: string;
  status: "present" | "absent" | "late" | "half-day" | "work-from-home";
  checkIn?: string;
  checkOut?: string;
  notes?: string;
  timestamp: string;
  location?: string;
};

export type LeaveRequest = {
  id: string;
  memberId: string;
  startDate: string;
  endDate: string;
  type: "sick" | "vacation" | "personal" | "unpaid";
  reason: string;
  status: "pending" | "approved" | "rejected";
  requestDate: string;
  reviewedBy?: string;
  reviewDate?: string;
};

export type UserSession = {
  userId: string;
  role: "admin" | "user";
  name: string;
  department: Department;
};

function App() {
  // --- state (your existing dummy data) ---
  const [session, setSession] = useState<UserSession | null>(null);

  const [members, setMembers] = useState<Member[]>([
    { id: "admin", name: "Admin User", email: "admin@example.com", password: "admin123", department: "HR", position: "System Administrator", joinDate: "2023-01-01", phone: "+1 234-567-8900" },
    { id: "1", name: "John Smith", email: "john@example.com", password: "user123", department: "Engineering", position: "Senior Developer", joinDate: "2023-03-15", phone: "+1 234-567-8901" },
    { id: "2", name: "Sarah Johnson", email: "sarah@example.com", password: "user123", department: "Marketing", position: "Marketing Manager", joinDate: "2023-02-20", phone: "+1 234-567-8902" },
    { id: "3", name: "Michael Brown", email: "michael@example.com", password: "user123", department: "Sales", position: "Sales Executive", joinDate: "2023-04-10", phone: "+1 234-567-8903" },
    { id: "4", name: "Emily Davis", email: "emily@example.com", password: "user123", department: "Engineering", position: "Frontend Developer", joinDate: "2023-05-01", phone: "+1 234-567-8904" },
    { id: "5", name: "David Wilson", email: "david@example.com", password: "user123", department: "Operations", position: "Operations Manager", joinDate: "2023-03-01", phone: "+1 234-567-8905" },
  ]);

  const generateSampleAttendance = (): AttendanceRecord[] => {
    const records: AttendanceRecord[] = [];
    const statuses: AttendanceRecord["status"][] = ["present", "present", "present", "late", "work-from-home"];
    const today = new Date();

    members.filter(m => m.id !== "admin").forEach(member => {
      for (let i = 0; i < 20; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        if (date.getDay() === 0 || date.getDay() === 6) continue;
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        records.push({
          id: `${member.id}-${date.toISOString().split("T")[0]}`,
          memberId: member.id,
          date: date.toISOString().split("T")[0],
          status,
          checkIn: status !== "absent" ? `09:${Math.floor(Math.random() * 60).toString().padStart(2, "0")}` : undefined,
          checkOut: status !== "absent" ? `18:${Math.floor(Math.random() * 60).toString().padStart(2, "0")}` : undefined,
          timestamp: date.toISOString(),
          location: "Office",
        });
      }
    });

    return records;
  };

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(generateSampleAttendance());

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: "1",
      memberId: "1",
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      endDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      type: "vacation",
      reason: "Family vacation",
      status: "pending",
      requestDate: new Date().toISOString(),
    },
    {
      id: "2",
      memberId: "2",
      startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      type: "sick",
      reason: "Medical appointment",
      status: "approved",
      requestDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      reviewedBy: "admin",
      reviewDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]);

  // --- handlers (same as your original) ---
  const handleLogin = (email: string, password: string, role: "admin" | "user") => {
    if (role === "admin" && email === "admin@example.com" && password === "admin123") {
      const admin = members.find(m => m.id === "admin");
      setSession({
        userId: "admin",
        role: "admin",
        name: admin?.name || "Admin User",
        department: admin?.department || "HR",
      });
      return true;
    }

    const member = members.find(m => m.email === email && m.password === password && m.id !== "admin");
    if (member) {
      setSession({
        userId: member.id,
        role: "user",
        name: member.name,
        department: member.department,
      });
      return true;
    }
    return false;
  };

  const handleLogout = () => setSession(null);

  const addMember = (member: Omit<Member, "id">) => {
    const newMember = { ...member, id: Date.now().toString() };
    setMembers(prev => [...prev, newMember]);
  };

  const updateMember = (id: string, updates: Partial<Member>) => {
    setMembers(prev => prev.map(m => (m.id === id ? { ...m, ...updates } : m)));
  };

  const deleteMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    setAttendance(prev => prev.filter(a => a.memberId !== id));
    setLeaveRequests(prev => prev.filter(l => l.memberId !== id));
  };

  const addAttendance = (record: Omit<AttendanceRecord, "id" | "timestamp">) => {
    const filtered = attendance.filter(a => !(a.memberId === record.memberId && a.date === record.date));
    const newRecord: AttendanceRecord = {
      ...record,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    setAttendance([...filtered, newRecord]);
  };

  const addLeaveRequest = (request: Omit<LeaveRequest, "id" | "requestDate" | "status">) => {
    const newRequest: LeaveRequest = {
      ...request,
      id: Date.now().toString(),
      requestDate: new Date().toISOString(),
      status: "pending",
    };
    setLeaveRequests(prev => [...prev, newRequest]);
  };

  const updateLeaveRequest = (id: string, updates: Partial<LeaveRequest>) => {
    setLeaveRequests(prev => prev.map(l => (l.id === id ? { ...l, ...updates } : l)));
  };

  // --- Router + passing props to routed components ---
  return (
    <BrowserRouter>
      <Routes>
        {/* Pass the handlers/props to Login so it can call handleLogin */}
        <Route path="/" element={<Login onLogin={handleLogin} />} />

        {/* Protect user/admin routes: if no session, redirect to login */}
        <Route
          path="/user"
          element={
            session ? (
              <UserHome
                session={session}
                member={members.find(m => m.id === session.userId)!}
                attendance={attendance}
                leaveRequests={leaveRequests}
                onMarkAttendance={addAttendance}
                onAddLeaveRequest={addLeaveRequest}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/admin"
          element={
            session && session.role === "admin" ? (
              <AdminOverview
                session={session}
                members={members}
                attendance={attendance}
                leaveRequests={leaveRequests}
                onAddMember={addMember}
                onUpdateMember={updateMember}
                onDeleteMember={deleteMember}
                onAddAttendance={addAttendance}
                onUpdateLeaveRequest={updateLeaveRequest}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
