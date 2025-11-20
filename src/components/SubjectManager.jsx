import React, { useState } from 'react';
import AddSubjectForm from './AddSubjectForm';

function SubjectManager({ subjects, activeSubject, onSubjectSelect, onSubjectAdd, onSubjectDelete }) {
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddSubject = (subjectData) => {
    onSubjectAdd(subjectData);
    setShowAddForm(false);
  };

  const formatDeadline = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return '⚠️ Overdue';
    if (diffDays === 0) return '🔥 Today';
    if (diffDays === 1) return '⏰ Tomorrow';
    if (diffDays <= 7) return `📅 ${diffDays} days`;
    return `📅 ${date.toLocaleDateString()}`;
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
          📚 My Subjects
        </h2>
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 sm:px-4 rounded-lg transition-colors text-xs sm:text-sm"
        >
          ➕ Add Subject
        </button>
      </div>

      {/* Subject List */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-3">
        {subjects.length === 0 ? (
          <div className="text-center py-6 sm:py-8 px-3 sm:px-4">
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              No subjects yet. Click "Add Subject" to get started!
            </p>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-2">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                className={`p-2 sm:p-3 rounded-lg cursor-pointer transition-all ${
                  activeSubject?.id === subject.id
                    ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500'
                    : 'bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => onSubjectSelect(subject)}
              >
                <div className="flex justify-between items-start mb-1 sm:mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm flex-1 pr-2">
                    {subject.name}
                  </h3>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Delete "${subject.name}"?`)) {
                        onSubjectDelete(subject.id);
                      }
                    }}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    🗑️
                  </button>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    🎓 {subject.course}
                  </p>
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {formatDeadline(subject.deadline)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Subject Form Modal */}
      {showAddForm && (
        <AddSubjectForm
          onSubmit={handleAddSubject}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
}

export default SubjectManager;
