import React, { useState, useEffect } from 'react';
import { assignmentAPI } from '../api/axios';

function Dashboard({ subjects, completedTopics, onAddSubject, onGoToPlanner, onGoToAssignments }) {
  const [assignments, setAssignments] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(true);

  // Load assignments from database
  const loadAssignments = async () => {
    try {
      setLoadingAssignments(true);
      const response = await assignmentAPI.getAll();
      setAssignments(response.data || []);
    } catch (error) {
      console.error('Failed to load assignments:', error);
      setAssignments([]);
    } finally {
      setLoadingAssignments(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  // Listen for assignment changes
  useEffect(() => {
    const handleAssignmentsChanged = () => {
      loadAssignments();
    };

    window.addEventListener('assignmentsChanged', handleAssignmentsChanged);
    return () => {
      window.removeEventListener('assignmentsChanged', handleAssignmentsChanged);
    };
  }, []);

  // Calculate statistics
  const totalSubjects = subjects.length;
  
  let totalTopics = 0;
  let completedCount = 0;
  let pendingCount = 0;
  
  subjects.forEach(subject => {
    const subjectData = subject.studyData || {};
    const topicsInSubject = Object.values(subjectData).reduce(
      (sum, topics) => sum + (Array.isArray(topics) ? topics.length : 0), 
      0
    );
    totalTopics += topicsInSubject;
  });
  
  // Count completed topics
  Object.keys(completedTopics).forEach(key => {
    if (completedTopics[key]) {
      completedCount++;
    }
  });
  
  pendingCount = totalTopics - completedCount;
  
  const overallProgress = totalTopics > 0 
    ? Math.round((completedCount / totalTopics) * 100) 
    : 0;

  // Get subjects with deadlines approaching
  const today = new Date();
  const upcomingDeadlines = subjects
    .map(subject => ({
      ...subject,
      daysRemaining: Math.ceil((new Date(subject.deadline) - today) / (1000 * 60 * 60 * 24))
    }))
    .filter(subject => subject.daysRemaining >= 0 && subject.daysRemaining <= 7)
    .sort((a, b) => a.daysRemaining - b.daysRemaining);

  // Assignment statistics
  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter(a => a.completed).length;
  const pendingAssignments = totalAssignments - completedAssignments;

  // Get upcoming assignments (next 7 days)
  const upcomingAssignments = assignments
    .filter(a => !a.completed && a.deadline)
    .map(a => ({
      ...a,
      daysRemaining: Math.ceil((new Date(a.deadline) - today) / (1000 * 60 * 60 * 24))
    }))
    .filter(a => a.daysRemaining >= 0 && a.daysRemaining <= 7)
    .sort((a, b) => a.daysRemaining - b.daysRemaining)
    .slice(0, 3);

  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 sm:gap-3 justify-end">
        <button
          type="button"
          onClick={onAddSubject}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 sm:px-6 rounded-lg transition-colors text-sm sm:text-base shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <span className="text-lg">📚</span>
          <span>Add Subject</span>
        </button>
        <button
          type="button"
          onClick={() => onGoToAssignments(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 sm:px-6 rounded-lg transition-colors text-sm sm:text-base shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <span className="text-lg">✅</span>
          <span>Add Assignment</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Subjects */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-xs sm:text-sm font-medium">Subjects</p>
              <p className="text-2xl sm:text-4xl font-bold mt-1 sm:mt-2">{totalSubjects}</p>
            </div>
            <div className="text-3xl sm:text-5xl opacity-50">📚</div>
          </div>
        </div>

        {/* Total Topics */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-xs sm:text-sm font-medium">Topics</p>
              <p className="text-2xl sm:text-4xl font-bold mt-1 sm:mt-2">{totalTopics}</p>
            </div>
            <div className="text-3xl sm:text-5xl opacity-50">📝</div>
          </div>
        </div>

        {/* Completed */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-xs sm:text-sm font-medium">Done</p>
              <p className="text-2xl sm:text-4xl font-bold mt-1 sm:mt-2">{completedCount}</p>
            </div>
            <div className="text-3xl sm:text-5xl opacity-50">✅</div>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-xs sm:text-sm font-medium">Pending</p>
              <p className="text-2xl sm:text-4xl font-bold mt-1 sm:mt-2">{pendingCount}</p>
            </div>
            <div className="text-3xl sm:text-5xl opacity-50">⏳</div>
          </div>
        </div>
      </div>

      {/* Assignments Overview Section */}
      {assignments.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              ✅ Assignments Overview
            </h3>
            <button
              type="button"
              onClick={() => onGoToAssignments(false)}
              className="text-sm sm:text-base text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              View All →
            </button>
          </div>

          {/* Assignment Stats */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 sm:p-4 border border-blue-200 dark:border-blue-700">
              <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-medium">Total</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-900 dark:text-blue-300">{totalAssignments}</p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 sm:p-4 border border-orange-200 dark:border-orange-700">
              <p className="text-xs sm:text-sm text-orange-600 dark:text-orange-400 font-medium">Pending</p>
              <p className="text-xl sm:text-2xl font-bold text-orange-900 dark:text-orange-300">{pendingAssignments}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 sm:p-4 border border-green-200 dark:border-green-700">
              <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 font-medium">Done</p>
              <p className="text-xl sm:text-2xl font-bold text-green-900 dark:text-green-300">{completedAssignments}</p>
            </div>
          </div>

          {/* Upcoming Assignments */}
          {upcomingAssignments.length > 0 && (
            <div>
              <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-3">
                📌 Upcoming Deadlines
              </h4>
              <div className="space-y-2">
                {upcomingAssignments.map(assignment => {
                  const daysText = assignment.daysRemaining === 0 ? 'Today' : 
                                   assignment.daysRemaining === 1 ? 'Tomorrow' : 
                                   `${assignment.daysRemaining} days`;
                  return (
                    <div
                      key={assignment.id}
                      className={`p-3 rounded-lg border-2 ${
                        assignment.daysRemaining === 0
                          ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                          : assignment.daysRemaining <= 2
                          ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700'
                          : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">
                            {assignment.title}
                          </p>
                          {assignment.description && (
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
                              {assignment.description}
                            </p>
                          )}
                        </div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded ml-2 whitespace-nowrap ${
                          assignment.daysRemaining === 0
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : assignment.daysRemaining <= 2
                            ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {daysText}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Overall Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
          📊 Overall Progress
        </h3>
        <div className="space-y-2 sm:space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Completion Rate</span>
            <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{overallProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 sm:h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-400 to-green-600 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
              style={{ width: `${overallProgress}%` }}
            >
              {overallProgress > 10 && (
                <span className="text-xs font-semibold text-white">{overallProgress}%</span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-2">
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{totalTopics}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Total</p>
            </div>
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">{completedCount}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Done</p>
            </div>
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-orange-600 dark:text-orange-400">{pendingCount}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Remaining</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Deadlines */}
      {upcomingDeadlines.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
            🔥 Upcoming Deadlines (Next 7 Days)
          </h3>
          <div className="space-y-2 sm:space-y-3">
            {upcomingDeadlines.map(subject => (
              <div 
                key={subject.id}
                className={`flex items-center justify-between p-3 sm:p-4 rounded-lg border-2 ${
                  subject.daysRemaining === 0 
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700' 
                    : subject.daysRemaining <= 2
                    ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700'
                    : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">{subject.name}</p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{subject.course}</p>
                </div>
                <div className="text-right ml-2">
                  <p className={`font-bold text-sm sm:text-base ${
                    subject.daysRemaining === 0 
                      ? 'text-red-600 dark:text-red-400' 
                      : subject.daysRemaining <= 2
                      ? 'text-orange-600 dark:text-orange-400'
                      : 'text-yellow-600 dark:text-yellow-400'
                  }`}>
                    {subject.daysRemaining === 0 ? 'Today!' : `${subject.daysRemaining}d`}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 hidden sm:block">
                    {new Date(subject.deadline).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subject List */}
      {subjects.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
            📋 All Subjects
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {subjects.map(subject => {
              const subjectData = subject.studyData || {};
              const topicsInSubject = Object.values(subjectData).reduce(
                (sum, topics) => sum + (Array.isArray(topics) ? topics.length : 0), 
                0
              );
              
              let subjectCompleted = 0;
              Object.keys(completedTopics).forEach(key => {
                if (key.startsWith(`${subject.id}::`) && completedTopics[key]) {
                  subjectCompleted++;
                }
              });
              
              const subjectProgress = topicsInSubject > 0 
                ? Math.round((subjectCompleted / topicsInSubject) * 100)
                : 0;

              return (
                <div key={subject.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">{subject.name}</h4>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{subject.course}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ml-2 whitespace-nowrap ${
                      subjectProgress === 100 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : subjectProgress > 0
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      {subjectProgress}%
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-400 to-blue-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${subjectProgress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400">
                      <span>{subjectCompleted} / {topicsInSubject} topics</span>
                      <span className="hidden sm:inline">📅 {new Date(subject.deadline).toLocaleDateString()}</span>
                      <span className="sm:hidden">📅 {new Date(subject.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onGoToPlanner(subject)}
                      className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium py-1.5 sm:py-2 px-3 rounded-lg transition-colors"
                    >
                      📝 Go to Planner
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {subjects.length === 0 && assignments.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-8 sm:p-12 border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-5xl sm:text-6xl mb-4">🎓</div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Welcome to Study Planner
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
            Start by adding subjects and assignments to track your progress!
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              type="button"
              onClick={onAddSubject}
              className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm sm:text-base transition-colors shadow-md hover:shadow-lg"
            >
              ➕ Add Your First Subject
            </button>
            <button
              type="button"
              onClick={() => onGoToAssignments(true)}
              className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium text-sm sm:text-base transition-colors shadow-md hover:shadow-lg"
            >
              ✅ Add Your First Assignment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
