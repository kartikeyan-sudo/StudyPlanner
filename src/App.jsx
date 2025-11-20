import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { subjectAPI } from './api/axios';
import Login from './components/Login';
import Register from './components/Register';
import WelcomeScreen from './components/WelcomeScreen';
import Dashboard from './components/Dashboard';
import JsonInput from './components/JsonInput';
import StudyPlanner from './components/StudyPlanner';
import SubjectManager from './components/SubjectManager';
import AddSubjectForm from './components/AddSubjectForm';
import Assignments from './components/Assignments';
import StudyRoom from './components/StudyRoom';
import AdminCMS from './components/AdminCMS';
import { Sun, Moon } from './components/Icons';

const EXAMPLE_JSON = {
  "Unit 1: Introduction to Programming": ["Variables and Data Types", "Control Structures", "Functions and Methods"],
  "Unit 2: Object-Oriented Programming": ["Classes and Objects", "Inheritance", "Polymorphism", "Encapsulation"],
  "Unit 3: Data Structures": ["Arrays and Lists", "Stacks and Queues", "Trees", "Graphs", "Hash Tables"],
  "Unit 4: Algorithms": ["Sorting Algorithms", "Searching Algorithms", "Recursion", "Dynamic Programming"],
  "Unit 5: Web Development": ["HTML & CSS", "JavaScript Basics", "React Fundamentals", "API Integration"]
};

function App() {
  const { user, loading: authLoading, showWelcome, login, register, logout } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [showAddSubjectForm, setShowAddSubjectForm] = useState(false);
  const [currentView, setCurrentView] = useState('home'); // 'home', 'planner', 'assignments', or 'studyroom'
  const [menuOpen, setMenuOpen] = useState(false);
  const [subjectMenuOpen, setSubjectMenuOpen] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [activeSubject, setActiveSubject] = useState(null);
  const [jsonInput, setJsonInput] = useState('');
  const [studyData, setStudyData] = useState({});
  const [completedTopics, setCompletedTopics] = useState({});
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  // Close hamburger menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && !event.target.closest('.hamburger-menu')) {
        setMenuOpen(false);
      }
      if (subjectMenuOpen && !event.target.closest('.subject-menu')) {
        setSubjectMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen, subjectMenuOpen]);

  // Load subjects from MongoDB when user logs in
  useEffect(() => {
    if (user) {
      loadSubjects();
    } else {
      setSubjects([]);
      setActiveSubject(null);
      setStudyData({});
    }
  }, [user]);

  // Load theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
    }
  }, []);

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const response = await subjectAPI.getAll();
      const loadedSubjects = response.data.map(sub => ({
        id: sub._id,
        name: sub.name,
        course: sub.course,
        deadline: sub.deadline,
        studyData: sub.studyData || {},
        createdAt: sub.createdAt
      }));
      setSubjects(loadedSubjects);
      
      // Load completed topics
      const allCompletedTopics = {};
      response.data.forEach(sub => {
        if (sub.completedTopics) {
          Object.keys(sub.completedTopics).forEach(key => {
            allCompletedTopics[`${sub._id}::${key}`] = sub.completedTopics[key];
          });
        }
      });
      setCompletedTopics(allCompletedTopics);
      
      if (loadedSubjects.length > 0) {
        setActiveSubject(loadedSubjects[0]);
        setStudyData(loadedSubjects[0].studyData || {});
      }
    } catch (error) {
      console.error('Failed to load subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJsonChange = (value) => {
    setJsonInput(value);
  };

  const handleParseJson = async () => {
    if (!activeSubject) {
      setError('Please select or add a subject first');
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);
      if (typeof parsed !== 'object' || Array.isArray(parsed)) {
        setError('JSON must be an object with chapters as keys and topic arrays as values');
        return;
      }
      
      // Transform the data to the expected format
      let transformedData = {};
      
      // Check if it's a nested structure with "syllabus" or similar
      const dataToProcess = parsed.syllabus || parsed;
      
      // Detect if it's the format with separate unit and topics keys
      const keys = Object.keys(dataToProcess);
      const hasTopicsPattern = keys.some(key => key.startsWith('topics_'));
      
      if (hasTopicsPattern) {
        // Handle the format: { "Unit 1": "Title", "topics_unit1": [...], ... }
        const unitKeys = keys.filter(key => !key.startsWith('topics_'));
        
        unitKeys.forEach(unitKey => {
          const unitNumber = unitKey.toLowerCase().replace(/\s+/g, '');
          const topicsKey = keys.find(key => 
            key.toLowerCase().replace(/[_\s]/g, '') === `topics${unitNumber}`
          );
          
          if (topicsKey && Array.isArray(dataToProcess[topicsKey])) {
            const unitTitle = dataToProcess[unitKey];
            const fullTitle = `${unitKey}: ${unitTitle}`;
            transformedData[fullTitle] = dataToProcess[topicsKey];
          }
        });
      } else {
        // Standard format: { "Chapter 1": ["Topic 1", ...], ... }
        transformedData = dataToProcess;
      }
      
      // Validate that we have at least one chapter with topics
      const hasValidData = Object.values(transformedData).some(
        topics => Array.isArray(topics) && topics.length > 0
      );
      
      if (!hasValidData) {
        setError('No valid chapters with topics found. Please check your JSON format.');
        return;
      }
      
      // Update the active subject's study data
      await subjectAPI.update(activeSubject.id, { studyData: transformedData });
      
      setSubjects(prevSubjects => 
        prevSubjects.map(subject => 
          subject.id === activeSubject.id 
            ? { ...subject, studyData: transformedData }
            : subject
        )
      );
      
      setStudyData(transformedData);
      setError('');
    } catch (e) {
      setError('Invalid JSON: ' + e.message);
    }
  };

  const handleSubjectAdd = async (subjectData) => {
    try {
      const response = await subjectAPI.create({
        name: subjectData.name,
        course: subjectData.course,
        deadline: subjectData.deadline,
        studyData: {}
      });
      
      const newSubject = {
        id: response.data._id,
        name: response.data.name,
        course: response.data.course,
        deadline: response.data.deadline,
        studyData: {},
        createdAt: response.data.createdAt
      };
      
      setSubjects(prev => [...prev, newSubject]);
      setActiveSubject(newSubject);
      setStudyData({});
      setJsonInput('');
      setShowAddSubjectForm(false); // Close the modal after adding subject
    } catch (error) {
      console.error('Failed to create subject:', error);
      setError('Failed to create subject');
    }
  };

  const handleSubjectDelete = async (subjectId) => {
    try {
      await subjectAPI.delete(subjectId);
      setSubjects(prev => prev.filter(s => s.id !== subjectId));
      
      const newProgress = { ...completedTopics };
      Object.keys(newProgress).forEach(key => {
        if (key.startsWith(`${subjectId}::`)) {
          delete newProgress[key];
        }
      });
      setCompletedTopics(newProgress);
      
      if (activeSubject?.id === subjectId) {
        setActiveSubject(null);
        setStudyData({});
        setJsonInput('');
      }
    } catch (error) {
      console.error('Failed to delete subject:', error);
      setError('Failed to delete subject');
    }
  };

  const handleSubjectSelect = (subject) => {
    setActiveSubject(subject);
    setStudyData(subject.studyData || {});
    setJsonInput(subject.studyData ? JSON.stringify(subject.studyData, null, 2) : '');
    setError('');
    setCurrentView('planner'); // Switch to planner view when subject is selected
  };

  const handleTopicToggle = async (chapter, topic) => {
    if (!activeSubject) return;
    const key = `${activeSubject.id}::${chapter}::${topic}`;
    const newCompletedTopics = {
      ...completedTopics,
      [key]: !completedTopics[key]
    };
    setCompletedTopics(newCompletedTopics);
    
    // Save to MongoDB
    try {
      const subjectProgress = {};
      Object.keys(newCompletedTopics).forEach(k => {
        if (k.startsWith(`${activeSubject.id}::`)) {
          const cleanKey = k.replace(`${activeSubject.id}::`, '');
          subjectProgress[cleanKey] = newCompletedTopics[k];
        }
      });
      
      await subjectAPI.update(activeSubject.id, { completedTopics: subjectProgress });
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  const handleResetProgress = async () => {
    if (!activeSubject) return;
    
    if (window.confirm('Are you sure you want to reset progress for this subject? This cannot be undone.')) {
      const newProgress = { ...completedTopics };
      Object.keys(newProgress).forEach(key => {
        if (key.startsWith(`${activeSubject.id}::`)) {
          delete newProgress[key];
        }
      });
      setCompletedTopics(newProgress);
      
      // Save to MongoDB
      try {
        await subjectAPI.update(activeSubject.id, { completedTopics: {} });
      } catch (error) {
        console.error('Failed to reset progress:', error);
      }
    }
  };

  // Get completed topics for active subject only
  const getActiveSubjectProgress = () => {
    if (!activeSubject) return {};
    
    const progress = {};
    Object.keys(completedTopics).forEach(key => {
      if (key.startsWith(`${activeSubject.id}::`)) {
        const cleanKey = key.replace(`${activeSubject.id}::`, '');
        progress[cleanKey] = completedTopics[key];
      }
    });
    return progress;
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">📚</div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show welcome screen
  if (showWelcome) {
    return <WelcomeScreen user={user} />;
  }

  // User not logged in
  if (!user) {
    if (showRegister) {
      return <Register onRegister={register} onSwitchToLogin={() => setShowRegister(false)} />;
    }
    return <Login onLogin={login} onSwitchToRegister={() => setShowRegister(true)} />;
  }

  // Admin users go to Admin CMS
  if (user && user.isAdmin) {
    return <AdminCMS user={user} onLogout={logout} />;
  }

  return (
    <div className="animate-fade-in">
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 sm:gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                  📚 Study Planner
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 hidden sm:block">
                  {currentView === 'home' 
                    ? `Welcome, ${user.name}!`
                    : activeSubject 
                    ? `${activeSubject.name} - ${activeSubject.course}` 
                    : 'Study Planner'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 relative">
              {/* Subject Dropdown (only in planner view) */}
              {currentView === 'planner' && (
                <div className="relative subject-menu">
                  <button
                    type="button"
                    onClick={() => setSubjectMenuOpen(!subjectMenuOpen)}
                    className="px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all shadow-sm flex items-center gap-2"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span className="hidden sm:inline text-sm font-medium">
                      {activeSubject ? activeSubject.name : 'Select Subject'}
                    </span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Subject Dropdown Menu */}
                  {subjectMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden max-h-[70vh] overflow-y-auto">
                      <div className="py-2">
                        {subjects.length === 0 ? (
                          <div className="px-4 py-8 text-center">
                            <div className="text-4xl mb-2">📚</div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">No subjects yet</p>
                            <button
                              onClick={() => {
                                setShowAddSubjectForm(true);
                                setSubjectMenuOpen(false);
                              }}
                              className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                            >
                              Create First Subject
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              My Subjects
                            </div>
                            {subjects.map((subject) => (
                              <div
                                key={subject.id}
                                className={`group transition-colors ${
                                  activeSubject?.id === subject.id
                                    ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'
                                    : 'hover:bg-gray-50 dark:hover:bg-gray-700 border-l-4 border-transparent'
                                }`}
                              >
                                <div className="flex items-center justify-between px-4 py-3">
                                  <button
                                    onClick={() => {
                                      handleSubjectSelect(subject);
                                      setSubjectMenuOpen(false);
                                    }}
                                    className="flex-1 text-left"
                                  >
                                    <div className={`font-medium truncate ${
                                      activeSubject?.id === subject.id
                                        ? 'text-blue-600 dark:text-blue-400'
                                        : 'text-gray-700 dark:text-gray-300'
                                    }`}>
                                      {subject.name}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                                      {subject.course}
                                    </div>
                                    {subject.deadline && (
                                      <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                                        📅 {new Date(subject.deadline).toLocaleDateString()}
                                      </div>
                                    )}
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSubjectDelete(subject.id);
                                    }}
                                    className="ml-2 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-lg transition-colors shadow-sm"
                                    title="Delete subject"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            ))}
                            <button
                              onClick={() => {
                                setShowAddSubjectForm(true);
                                setSubjectMenuOpen(false);
                              }}
                              className="w-full px-4 py-3 text-left flex items-center gap-3 transition-colors text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-t border-gray-200 dark:border-gray-700 mt-2"
                            >
                              <span className="text-xl">➕</span>
                              <span className="font-medium">Add New Subject</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Universal Hamburger Menu */}
              <div className="relative hamburger-menu">
                <button
                  type="button"
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-2 sm:p-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all shadow-md"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden max-h-[80vh] overflow-y-auto">
                    <div className="py-2">
                      <button
                        onClick={() => {
                          setCurrentView('home');
                          setActiveSubject(null);
                          setMenuOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                          currentView === 'home'
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <span className="text-xl">🏠</span>
                        <span className="font-medium">Home</span>
                      </button>
                      <button
                        onClick={() => {
                          setCurrentView('planner');
                          setMenuOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                          currentView === 'planner'
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <span className="text-xl">📝</span>
                        <span className="font-medium">Planner</span>
                      </button>

                      <button
                        onClick={() => {
                          setCurrentView('assignments');
                          setMenuOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors border-t border-gray-200 dark:border-gray-700 ${
                          currentView === 'assignments'
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <span className="text-xl">✅</span>
                        <span className="font-medium">Assignments</span>
                      </button>
                      <button
                        onClick={() => {
                          setCurrentView('studyroom');
                          setMenuOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                          currentView === 'studyroom'
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <span className="text-xl">🎓</span>
                        <span className="font-medium">Study Room</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun /> : <Moon />}
              </button>
              <button
                type="button"
                onClick={logout}
                className="px-2 sm:px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors text-xs sm:text-sm font-medium"
              >
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">Exit</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)] sm:h-[calc(100vh-73px)]">
        {/* Left Sidebar - Subjects (Only show in Planner view) */}
        {currentView === 'planner' && (
          <div className="hidden lg:block lg:w-64 transition-all duration-300">
            {/* Sidebar content */}
            <div className="relative lg:relative w-64 h-full">
              <SubjectManager
                subjects={subjects}
                activeSubject={activeSubject}
                onSubjectSelect={handleSubjectSelect}
                onSubjectAdd={handleSubjectAdd}
                onSubjectDelete={handleSubjectDelete}
              />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto w-full">
          {currentView === 'home' ? (
            <main className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
              <Dashboard 
                subjects={subjects}
                completedTopics={completedTopics}
                onAddSubject={() => setShowAddSubjectForm(true)}
                onGoToPlanner={(subject) => {
                  setActiveSubject(subject);
                  setCurrentView('planner');
                  setStudyData(subject.studyData || {});
                  setSidebarOpen(false);
                }}
                onGoToAssignments={(openForm) => {
                  setCurrentView('assignments');
                  // Trigger opening the form if needed by updating the Assignments component
                  if (openForm) {
                    // The form will be opened via a ref or event in the Assignments component
                    setTimeout(() => {
                      const event = new CustomEvent('openAssignmentForm');
                      window.dispatchEvent(event);
                    }, 100);
                  }
                }}
              />
            </main>
          ) : currentView === 'planner' && activeSubject ? (
            <main className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-8">
                {/* Left Section - JSON Input */}
                <JsonInput
                  jsonInput={jsonInput}
                  error={error}
                  onJsonChange={handleJsonChange}
                  onParseJson={handleParseJson}
                  hasData={Object.keys(studyData).length > 0}
                />

                {/* Right Section - Study Planner */}
                <StudyPlanner
                  studyData={studyData}
                  completedTopics={getActiveSubjectProgress()}
                  onTopicToggle={handleTopicToggle}
                  onResetProgress={handleResetProgress}
                />
              </div>
            </main>
          ) : currentView === 'assignments' ? (
            <main className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
              <Assignments />
            </main>
          ) : currentView === 'studyroom' ? (
            <main className="w-full">
              <StudyRoom />
            </main>
          ) : (
            <div className="flex items-center justify-center h-full px-4">
              <div className="text-center p-4 sm:p-8">
                <div className="text-4xl sm:text-6xl mb-4">📚</div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Select a Subject
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
                  Choose a subject from the sidebar to start studying.
                </p>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-lg font-medium"
                >
                  Open Subjects
                </button>
                <div className="hidden lg:inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-lg">
                  Click on a subject or add a new one
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Subject Form Modal */}
      {showAddSubjectForm && (
        <AddSubjectForm
          onSubmit={handleSubjectAdd}
          onCancel={() => setShowAddSubjectForm(false)}
        />
      )}
    </div>
    </div>
  );
}

export default App;
