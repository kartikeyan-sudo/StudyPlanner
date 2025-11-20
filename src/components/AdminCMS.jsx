import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4001/api';

const AdminCMS = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [studyRooms, setStudyRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSubjects: 0,
    totalAssignments: 0,
    totalStudyRooms: 0
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      if (activeTab === 'overview' || activeTab === 'users') {
        // Fetch all users (you'll need to create this endpoint)
        const usersRes = await axios.get(`${API_URL}/admin/users`, config);
        setUsers(usersRes.data);
        setStats(prev => ({ ...prev, totalUsers: usersRes.data.length }));
      }

      if (activeTab === 'overview' || activeTab === 'subjects') {
        const subjectsRes = await axios.get(`${API_URL}/admin/subjects`, config);
        setSubjects(subjectsRes.data);
        setStats(prev => ({ ...prev, totalSubjects: subjectsRes.data.length }));
      }

      if (activeTab === 'overview' || activeTab === 'assignments') {
        const assignmentsRes = await axios.get(`${API_URL}/admin/assignments`, config);
        setAssignments(assignmentsRes.data);
        setStats(prev => ({ ...prev, totalAssignments: assignmentsRes.data.length }));
      }

      if (activeTab === 'overview' || activeTab === 'studyrooms') {
        const roomsRes = await axios.get(`${API_URL}/admin/studyrooms`, config);
        setStudyRooms(roomsRes.data);
        setStats(prev => ({ ...prev, totalStudyRooms: roomsRes.data.length }));
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const handleBlockUnblockUser = async (userId, currentBlockStatus) => {
    const action = currentBlockStatus ? 'unblock' : 'block';
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;

    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_URL}/admin/users/${userId}/block`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
      alert(`Failed to ${action} user`);
    }
  };

  const togglePasswordVisibility = (userId) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const handleDeleteSubject = async (subjectId) => {
    if (!window.confirm('Are you sure you want to delete this subject?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/subjects/${subjectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting subject:', error);
      alert('Failed to delete subject');
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/assignments/${assignmentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting assignment:', error);
      alert('Failed to delete assignment');
    }
  };

  const handleDeleteStudyRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this study room?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/studyrooms/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting study room:', error);
      alert('Failed to delete study room');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-md border-b border-purple-500/30 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
                Admin CMS Portal
              </h1>
              <p className="text-purple-300 text-xs sm:text-sm mt-1">Welcome, {user?.name}</p>
            </div>
            <button
              onClick={onLogout}
              className="px-4 sm:px-6 py-2 bg-red-500/20 border border-red-500 text-red-400 rounded-lg hover:bg-red-500/30 transition-all hover:shadow-lg hover:shadow-red-500/50"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex gap-2 sm:gap-4 mb-6 sm:mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {['overview', 'users', 'subjects', 'assignments', 'studyrooms'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all whitespace-nowrap text-sm sm:text-base ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white shadow-lg shadow-purple-500/50'
                  : 'bg-purple-900/30 text-purple-300 hover:bg-purple-900/50 border border-purple-500/30'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-purple-300 text-xl animate-pulse">Loading...</div>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-gradient-to-br from-purple-600/20 to-purple-900/40 border border-purple-500/50 rounded-xl p-4 sm:p-6 backdrop-blur-md hover:shadow-lg hover:shadow-purple-500/30 transition-all">
                  <h3 className="text-purple-300 text-xs sm:text-sm font-medium mb-2">Total Users</h3>
                  <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{stats.totalUsers}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-600/20 to-blue-900/40 border border-blue-500/50 rounded-xl p-4 sm:p-6 backdrop-blur-md hover:shadow-lg hover:shadow-blue-500/30 transition-all">
                  <h3 className="text-blue-300 text-xs sm:text-sm font-medium mb-2">Total Subjects</h3>
                  <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">{stats.totalSubjects}</p>
                </div>
                <div className="bg-gradient-to-br from-cyan-600/20 to-cyan-900/40 border border-cyan-500/50 rounded-xl p-4 sm:p-6 backdrop-blur-md hover:shadow-lg hover:shadow-cyan-500/30 transition-all">
                  <h3 className="text-cyan-300 text-xs sm:text-sm font-medium mb-2">Total Assignments</h3>
                  <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">{stats.totalAssignments}</p>
                </div>
                <div className="bg-gradient-to-br from-pink-600/20 to-pink-900/40 border border-pink-500/50 rounded-xl p-4 sm:p-6 backdrop-blur-md hover:shadow-lg hover:shadow-pink-500/30 transition-all">
                  <h3 className="text-pink-300 text-xs sm:text-sm font-medium mb-2">Total Study Rooms</h3>
                  <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">{stats.totalStudyRooms}</p>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="bg-black/40 backdrop-blur-md border border-purple-500/50 rounded-xl p-4 sm:p-6 shadow-xl shadow-purple-500/20">
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 sm:mb-6">User Management</h2>
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="inline-block min-w-full align-middle">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-purple-500/50">
                          <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-purple-300 text-xs sm:text-sm">Name</th>
                          <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-purple-300 text-xs sm:text-sm">Email</th>
                          <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-purple-300 text-xs sm:text-sm hidden md:table-cell">Password</th>
                          <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-purple-300 text-xs sm:text-sm hidden lg:table-cell">Admin</th>
                          <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-purple-300 text-xs sm:text-sm">Status</th>
                          <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-purple-300 text-xs sm:text-sm hidden xl:table-cell">Created</th>
                          <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-purple-300 text-xs sm:text-sm">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u._id} className="border-b border-purple-500/20 hover:bg-purple-500/10 transition-colors">
                            <td className="py-2 sm:py-3 px-2 sm:px-4 text-white text-xs sm:text-sm">{u.name}</td>
                            <td className="py-2 sm:py-3 px-2 sm:px-4 text-purple-300 text-xs sm:text-sm break-all">{u.email}</td>
                            <td className="py-2 sm:py-3 px-2 sm:px-4 hidden md:table-cell">
                              <div className="flex items-center gap-1 sm:gap-2">
                                <span className="text-purple-300 font-mono text-xs truncate max-w-[100px]">
                                  {visiblePasswords[u._id] ? u.password : '••••••••'}
                                </span>
                                <button
                                  onClick={() => togglePasswordVisibility(u._id)}
                                  className="px-2 py-1 bg-blue-500/20 border border-blue-500 text-blue-400 rounded text-xs hover:bg-blue-500/30 hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                                >
                                  {visiblePasswords[u._id] ? 'Hide' : 'Show'}
                                </button>
                              </div>
                            </td>
                            <td className="py-2 sm:py-3 px-2 sm:px-4 hidden lg:table-cell">
                              <span className={`px-2 py-1 rounded text-xs ${u.isAdmin ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-gray-500/20 text-gray-400'}`}>
                                {u.isAdmin ? 'Yes' : 'No'}
                              </span>
                            </td>
                            <td className="py-2 sm:py-3 px-2 sm:px-4">
                              <span className={`px-2 py-1 rounded text-xs whitespace-nowrap ${u.isBlocked ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-green-500/20 text-green-400 border border-green-500/50'}`}>
                                {u.isBlocked ? 'Blocked' : 'Active'}
                              </span>
                            </td>
                            <td className="py-2 sm:py-3 px-2 sm:px-4 text-purple-300 text-xs sm:text-sm hidden xl:table-cell">
                              {new Date(u.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-2 sm:py-3 px-2 sm:px-4">
                              {!u.isAdmin && (
                                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                                  <button
                                    onClick={() => handleBlockUnblockUser(u._id, u.isBlocked)}
                                    className={`px-2 sm:px-3 py-1 rounded text-xs border whitespace-nowrap ${
                                      u.isBlocked 
                                        ? 'bg-green-500/20 border-green-500 text-green-400 hover:bg-green-500/30 hover:shadow-lg hover:shadow-green-500/30' 
                                        : 'bg-yellow-500/20 border-yellow-500 text-yellow-400 hover:bg-yellow-500/30 hover:shadow-lg hover:shadow-yellow-500/30'
                                    } transition-all`}
                                  >
                                    {u.isBlocked ? 'Unblock' : 'Block'}
                                  </button>
                                  <button
                                    onClick={() => handleDeleteUser(u._id)}
                                    className="px-2 sm:px-3 py-1 bg-red-500/20 border border-red-500 text-red-400 rounded hover:bg-red-500/30 text-xs hover:shadow-lg hover:shadow-red-500/30 transition-all"
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Subjects Tab */}
            {activeTab === 'subjects' && (
              <div className="bg-black/40 backdrop-blur-md border border-purple-500/50 rounded-xl p-4 sm:p-6 shadow-xl shadow-purple-500/20">
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4 sm:mb-6">Subjects Management</h2>
                <div className="grid gap-3 sm:gap-4">
                  {subjects.map((subject) => (
                    <div key={subject._id} className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 hover:bg-purple-900/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-sm sm:text-base">{subject.name}</h3>
                        <p className="text-purple-300 text-xs sm:text-sm">Owner: {subject.userId?.name || 'Unknown'}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteSubject(subject._id)}
                        className="px-3 sm:px-4 py-2 bg-red-500/20 border border-red-500 text-red-400 rounded hover:bg-red-500/30 text-xs sm:text-sm hover:shadow-lg hover:shadow-red-500/30 transition-all w-full sm:w-auto"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Assignments Tab */}
            {activeTab === 'assignments' && (
              <div className="bg-black/40 backdrop-blur-md border border-purple-500/50 rounded-xl p-4 sm:p-6 shadow-xl shadow-purple-500/20">
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent mb-4 sm:mb-6">Assignments Management</h2>
                <div className="grid gap-3 sm:gap-4">
                  {assignments.map((assignment) => (
                    <div key={assignment._id} className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 hover:bg-purple-900/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-sm sm:text-base">{assignment.title}</h3>
                        <p className="text-purple-300 text-xs sm:text-sm">Subject: {assignment.subject}</p>
                        <p className="text-purple-400 text-xs">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteAssignment(assignment._id)}
                        className="px-3 sm:px-4 py-2 bg-red-500/20 border border-red-500 text-red-400 rounded hover:bg-red-500/30 text-xs sm:text-sm hover:shadow-lg hover:shadow-red-500/30 transition-all w-full sm:w-auto"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Study Rooms Tab */}
            {activeTab === 'studyrooms' && (
              <div className="bg-black/40 backdrop-blur-md border border-purple-500/50 rounded-xl p-4 sm:p-6 shadow-xl shadow-purple-500/20">
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent mb-4 sm:mb-6">Study Rooms Management</h2>
                <div className="grid gap-3 sm:gap-4">
                  {studyRooms.map((room) => (
                    <div key={room._id} className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3 sm:p-4 flex flex-col gap-3 hover:bg-purple-900/50 hover:shadow-lg hover:shadow-pink-500/20 transition-all">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-sm sm:text-base">{room.title}</h3>
                        <p className="text-purple-300 text-xs sm:text-sm mt-1">{room.description}</p>
                        <a href={room.meetLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-xs hover:underline mt-1 inline-block break-all">
                          {room.meetLink}
                        </a>
                      </div>
                      <button
                        onClick={() => handleDeleteStudyRoom(room._id)}
                        className="px-3 sm:px-4 py-2 bg-red-500/20 border border-red-500 text-red-400 rounded hover:bg-red-500/30 text-xs sm:text-sm hover:shadow-lg hover:shadow-red-500/30 transition-all w-full sm:w-auto"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminCMS;
