import React, { useState, useEffect } from 'react';
import { studyRoomAPI } from '../api/axios';
import { useAuth } from '../context/AuthContext';

function StudyRoom() {
  const { user } = useAuth();
  const [studyRooms, setStudyRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    roomName: '',
    meetLink: ''
  });

  useEffect(() => {
    loadStudyRooms();
  }, []);

  const loadStudyRooms = async () => {
    try {
      setLoading(true);
      const response = await studyRoomAPI.getAll();
      setStudyRooms(response.data);
      setError('');
    } catch (err) {
      console.error('Failed to load study rooms:', err);
      setError('Failed to load study rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.roomName.trim() || !formData.meetLink.trim()) {
      setError('All fields are required');
      return;
    }

    try {
      setLoading(true);
      await studyRoomAPI.create(formData);
      setFormData({ name: '', roomName: '', meetLink: '' });
      setShowForm(false);
      await loadStudyRooms();
      setError('');
    } catch (err) {
      console.error('Failed to create study room:', err);
      setError('Failed to create study room');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this study room?')) return;

    try {
      await studyRoomAPI.delete(id);
      await loadStudyRooms();
      setError('');
    } catch (err) {
      console.error('Failed to delete study room:', err);
      setError('Failed to delete study room');
    }
  };

  const handleJoinRoom = (meetLink) => {
    window.open(meetLink, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            🎓 Study Rooms
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Join public study rooms or create your own
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Create Room Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg text-sm sm:text-base"
          >
            {showForm ? '✕ Cancel' : '+ Create Study Room'}
          </button>
        </div>

        {/* Create Room Form */}
        {showForm && (
          <div className="mb-8 p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Create New Study Room
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-white text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Study Room Name
                </label>
                <input
                  type="text"
                  value={formData.roomName}
                  onChange={(e) => setFormData({ ...formData, roomName: e.target.value })}
                  placeholder="e.g., Math Study Group"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-white text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Google Meet Link
                </label>
                <input
                  type="url"
                  value={formData.meetLink}
                  onChange={(e) => setFormData({ ...formData, meetLink: e.target.value })}
                  placeholder="https://meet.google.com/xxx-xxxx-xxx"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-white text-sm sm:text-base"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {loading ? 'Creating...' : 'Create Room'}
              </button>
            </form>
          </div>
        )}

        {/* Loading State */}
        {loading && !showForm && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading study rooms...</p>
          </div>
        )}

        {/* Study Rooms List */}
        {!loading && (
          <div className="grid gap-4 sm:gap-6">
            {studyRooms.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="text-6xl mb-4">📚</div>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  No study rooms available. Create the first one!
                </p>
              </div>
            ) : (
              studyRooms.map((room) => (
                <div
                  key={room._id}
                  className="p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {room.roomName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        👤 Host: <span className="font-medium">{room.name}</span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        Created {new Date(room.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex gap-2 sm:gap-3">
                      <button
                        onClick={() => handleJoinRoom(room.meetLink)}
                        className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all shadow-md text-sm sm:text-base"
                      >
                        🔗 Join Room
                      </button>
                      
                      {room.userId._id === user.id && (
                        <button
                          onClick={() => handleDelete(room._id)}
                          className="px-3 sm:px-4 py-2 sm:py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors text-sm sm:text-base"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudyRoom;
