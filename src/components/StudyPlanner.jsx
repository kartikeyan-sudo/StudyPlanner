import React from 'react';
import ProgressBar from './ProgressBar';
import ChapterCard from './ChapterCard';

function StudyPlanner({ studyData, completedTopics, onTopicToggle, onResetProgress }) {
  // Calculate statistics
  const totalTopics = Object.values(studyData).reduce((sum, topics) => sum + topics.length, 0);
  const completedCount = Object.values(completedTopics).filter(Boolean).length;
  const percentage = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  return (
    <div className="animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
          <h2 className="text-base sm:text-xl font-semibold text-gray-900 dark:text-white">
            ✅ Study Progress
          </h2>
          <button
            type="button"
            onClick={onResetProgress}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors text-xs sm:text-sm font-medium"
          >
            🔄 Reset Progress
          </button>
        </div>

        {/* Progress Statistics */}
        <div className="mb-4 sm:mb-6">
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-3 sm:mb-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg p-2 sm:p-4 border border-blue-200 dark:border-blue-700">
              <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-medium">Topics</p>
              <p className="text-lg sm:text-2xl font-bold text-blue-900 dark:text-blue-300">{totalTopics}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-lg p-2 sm:p-4 border border-green-200 dark:border-green-700">
              <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 font-medium">Done</p>
              <p className="text-lg sm:text-2xl font-bold text-green-900 dark:text-green-300">{completedCount}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg p-2 sm:p-4 border border-purple-200 dark:border-purple-700">
              <p className="text-xs sm:text-sm text-purple-600 dark:text-purple-400 font-medium">Progress</p>
              <p className="text-lg sm:text-2xl font-bold text-purple-900 dark:text-purple-300">{percentage}%</p>
            </div>
          </div>

          <ProgressBar percentage={percentage} />
        </div>

        {/* Chapters and Topics */}
        <div className="space-y-3 sm:space-y-4 max-h-[400px] sm:max-h-[600px] overflow-y-auto pr-1 sm:pr-2">
          {Object.entries(studyData).map(([chapter, topics]) => (
            <ChapterCard
              key={chapter}
              chapter={chapter}
              topics={topics}
              completedTopics={completedTopics}
              onTopicToggle={onTopicToggle}
            />
          ))}
        </div>

        {Object.keys(studyData).length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No study data yet. Parse JSON to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudyPlanner;
