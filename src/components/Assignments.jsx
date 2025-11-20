import React, { useState, useEffect } from 'react';
import { assignmentAPI } from '../api/axios';

function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load assignments from MongoDB
  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const response = await assignmentAPI.getAll();
      setAssignments(response.data);
      setError('');
    } catch (err) {
      console.error('Failed to load assignments:', err);
      setError('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  // Listen for custom event to open form
  useEffect(() => {
    const handleOpenForm = () => {
      setShowForm(true);
    };
    window.addEventListener('openAssignmentForm', handleOpenForm);
    return () => window.removeEventListener('openAssignmentForm', handleOpenForm);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      setLoading(true);
      const response = await assignmentAPI.create({
        title: formData.title,
        description: formData.description,
        deadline: formData.deadline || null
      });

      setAssignments(prev => [...prev, response.data]);
      setFormData({ title: '', description: '', deadline: '' });
      setShowForm(false);
      setError('');
      
      // Notify Dashboard to reload assignments
      window.dispatchEvent(new CustomEvent('assignmentsChanged'));
    } catch (err) {
      console.error('Failed to create assignment:', err);
      setError('Failed to create assignment');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id) => {
    const assignment = assignments.find(a => a._id === id);
    if (!assignment) return;

    try {
      const response = await assignmentAPI.update(id, {
        completed: !assignment.completed
      });

      setAssignments(prev =>
        prev.map(a => a._id === id ? response.data : a)
      );
      setError('');
      
      // Notify Dashboard to reload assignments
      window.dispatchEvent(new CustomEvent('assignmentsChanged'));
    } catch (err) {
      console.error('Failed to update assignment:', err);
      setError('Failed to update assignment');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this assignment?')) return;

    try {
      await assignmentAPI.delete(id);
      setAssignments(prev => prev.filter(a => a._id !== id));
      setError('');
      
      // Notify Dashboard to reload assignments
      window.dispatchEvent(new CustomEvent('assignmentsChanged'));
    } catch (err) {
      console.error('Failed to delete assignment:', err);
      setError('Failed to delete assignment');
    }
  };

  const pendingAssignments = assignments.filter(a => !a.completed);
  const completedAssignments = assignments.filter(a => a.completed);

  const isOverdue = (deadline) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  const getDaysRemaining = (deadline) => {
    if (!deadline) return null;
    const days = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    if (days < 0) return 'Overdue';
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `${days} days`;
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            📝 Assignments
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            Track your assignments and deadlines
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 sm:px-6 rounded-lg transition-colors text-sm sm:text-base shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <span className="text-lg">{showForm ? '✕' : '➕'}</span>
          <span className="hidden sm:inline">{showForm ? 'Cancel' : 'Add Assignment'}</span>
        </button>
      </div>

      {/* Add Assignment Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
            New Assignment
          </h3>
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label htmlFor="title" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Math Homework Chapter 5"
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm sm:text-base"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Additional details about the assignment..."
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none text-sm sm:text-base"
              />
            </div>

            <div>
              <label htmlFor="deadline" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                Deadline
              </label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm sm:text-base"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 sm:py-3 px-4 rounded-lg transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding...' : 'Add Assignment'}
            </button>
          </form>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 text-white">
          <p className="text-blue-100 text-xs sm:text-sm font-medium">Total</p>
          <p className="text-2xl sm:text-4xl font-bold mt-1 sm:mt-2">{assignments.length}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 text-white">
          <p className="text-orange-100 text-xs sm:text-sm font-medium">Pending</p>
          <p className="text-2xl sm:text-4xl font-bold mt-1 sm:mt-2">{pendingAssignments.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 text-white col-span-2 sm:col-span-1">
          <p className="text-green-100 text-xs sm:text-sm font-medium">Completed</p>
          <p className="text-2xl sm:text-4xl font-bold mt-1 sm:mt-2">{completedAssignments.length}</p>
        </div>
      </div>

      {/* Pending Assignments */}
      {pendingAssignments.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
            📋 Pending Assignments ({pendingAssignments.length})
          </h3>
          <div className="space-y-3">
            {pendingAssignments
              .sort((a, b) => new Date(a.deadline || '9999') - new Date(b.deadline || '9999'))
              .map(assignment => (
                <div
                  key={assignment._id}
                  className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
                    isOverdue(assignment.deadline)
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                      : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={assignment.completed}
                      onChange={() => handleToggle(assignment._id)}
                      className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">
                        {assignment.title}
                      </h4>
                      {assignment.description && (
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {assignment.description}
                        </p>
                      )}
                      {assignment.deadline && (
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-xs font-medium px-2 py-1 rounded ${
                            isOverdue(assignment.deadline)
                              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                              : getDaysRemaining(assignment.deadline) === 'Today'
                              ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          }`}>
                            📅 {getDaysRemaining(assignment.deadline)} - {new Date(assignment.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(assignment._id)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Completed Assignments */}
      {completedAssignments.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
            ✅ Completed Assignments ({completedAssignments.length})
          </h3>
          <div className="space-y-3">
            {completedAssignments
              .sort((a, b) => new Date(b.deadline || '0') - new Date(a.deadline || '0'))
              .map(assignment => (
                <div
                  key={assignment._id}
                  className="p-3 sm:p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border-2 border-green-300 dark:border-green-700"
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={assignment.completed}
                      onChange={() => handleToggle(assignment._id)}
                      className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white line-through opacity-60">
                        {assignment.title}
                      </h4>
                      {assignment.description && (
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 opacity-60">
                          {assignment.description}
                        </p>
                      )}
                      {assignment.deadline && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                          📅 {new Date(assignment.deadline).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(assignment._id)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {assignments.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-8 sm:p-12 border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-5xl sm:text-6xl mb-4">📝</div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Assignments Yet
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
            Click "Add Assignment" to create your first assignment!
          </p>
        </div>
      )}
    </div>
  );
}

export default Assignments;
