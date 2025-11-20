# 📚 Study Planner - Full Stack Application

A modern, full-stack React application with MongoDB authentication that converts JSON input into a beautiful checkbox-based study planner with progress tracking.

## ✨ Features

### 🔐 Authentication
- **User Registration**: Create account with name, email, and password
- **User Login**: Secure login with JWT tokens
- **Session Persistence**: Stay logged in even after page reload
- **Welcome Screen**: Beautiful 2-second greeting "Welcome Future Writers" with blur effect
- **Logout**: Secure logout functionality

### 📝 Subject Management
- **Add Subjects**: Create subjects with name, course (B.Tech, BCA, etc.), and deadline
- **Multiple Subjects**: Manage unlimited subjects per user
- **Subject Selection**: Switch between subjects easily
- **Delete Subjects**: Remove subjects you no longer need

### 📊 Study Planning
- **JSON Input**: Paste your study plan in JSON format (supports multiple formats)
- **Interactive Checkboxes**: Check off topics as you complete them
- **Progress Tracking**: 
  - Total topics count
  - Completed topics count
  - Overall percentage
  - Per-chapter progress bars
- **Auto-save**: Progress automatically saved to MongoDB
- **Reset Progress**: Clear progress per subject

### 🎨 Modern UI
- **Dark/Light Mode**: Toggle between themes
- **Responsive Design**: Works on all screen sizes
- **Smooth Animations**: Fade-ins and transitions
- **Clean Layout**: Sidebar navigation + main content area

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up MongoDB:**
   
   **Option A - Local MongoDB:**
   - Install MongoDB from https://www.mongodb.com/try/download/community
   - Start MongoDB service:
     ```bash
     # Windows
     net start MongoDB
     
     # macOS/Linux
     sudo systemctl start mongod
     ```

   **Option B - MongoDB Atlas (Cloud):**
   - Create free account at https://www.mongodb.com/cloud/atlas
   - Create a cluster and get connection string
   - Update `.env` file with your connection string

3. **Configure environment variables:**
   
   The `.env` file is already created with default values:
   ```env
   MONGODB_URI=mongodb://localhost:27017/study-planner
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5000
   NODE_ENV=development
   ```
   
   **⚠️ Important**: Change `JWT_SECRET` to a secure random string for production!

4. **Start the application:**
   
   **Option A - Run both frontend and backend together (Recommended):**
   ```bash
   npm run dev:all
   ```
   
   **Option B - Run separately:**
   
   Terminal 1 (Backend):
   ```bash
   npm run server
   ```
   
   Terminal 2 (Frontend):
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   
   Frontend: `http://localhost:5173`
   Backend API: `http://localhost:5000`

## 📖 How to Use

### First Time Setup

1. **Register**: Create an account with your name, email, and password
2. **Login**: Sign in with your credentials
3. **Welcome Screen**: Enjoy the 2-second "Welcome Future Writers" greeting
4. **Add Subject**: Click "➕ Add Subject" in the left sidebar
   - Enter subject name (e.g., "Data Structures & Algorithms")
   - Select your course (B.Tech, BCA, MCA, etc.)
   - Choose deadline date
5. **Paste JSON**: Add your study plan in JSON format
6. **Generate**: Click "Generate Study Planner"
7. **Track Progress**: Check off topics as you complete them

### JSON Format

**Format 1 (Simple):**
```json
{
  "Unit 1: Introduction": ["Topic 1", "Topic 2", "Topic 3"],
  "Unit 2: Advanced": ["Topic A", "Topic B"]
}
```

**Format 2 (Nested - Like your syllabus):**
```json
{
  "syllabus": {
    "Unit 1": "Introduction",
    "topics_unit1": ["Basic Terminology", "Algorithm", "Time Complexity"],
    "Unit 2": "Stacks and Queues",
    "topics_unit2": ["Stack operations", "Queue operations"]
  }
}
```

### Example JSON

```json
{
  "syllabus": {
    "Unit 1": "Introduction",
    "topics_unit1": [
      "Basic Terminology",
      "Elementary Data Organization",
      "Built-in Data Types in C",
      "Algorithm",
      "Efficiency of an Algorithm",
      "Time and Space Complexity"
    ],
    "Unit 2": "Stacks and Queues",
    "topics_unit2": [
      "Abstract Data Type",
      "Primitive Stack operations",
      "Array and Linked Implementation of Stack",
      "Queues: Operations on Queue"
    ]
  }
}
```

## 🏗️ Project Structure

```
Study Planner/
├── server/                      # Backend (Node.js + Express)
│   ├── models/
│   │   ├── User.js             # User schema
│   │   └── Subject.js          # Subject schema
│   ├── routes/
│   │   ├── auth.js             # Authentication routes
│   │   └── subjects.js         # Subject CRUD routes
│   ├── middleware/
│   │   └── auth.js             # JWT authentication middleware
│   └── index.js                # Server entry point
├── src/                         # Frontend (React + Vite)
│   ├── api/
│   │   └── axios.js            # API configuration
│   ├── components/
│   │   ├── Login.jsx           # Login form
│   │   ├── Register.jsx        # Registration form
│   │   ├── WelcomeScreen.jsx   # Welcome animation
│   │   ├── SubjectManager.jsx  # Subject sidebar
│   │   ├── AddSubjectForm.jsx  # Add subject modal
│   │   ├── JsonInput.jsx       # JSON input panel
│   │   ├── StudyPlanner.jsx    # Progress tracker
│   │   ├── ChapterCard.jsx     # Chapter component
│   │   ├── TopicItem.jsx       # Topic checkbox
│   │   ├── ProgressBar.jsx     # Progress bar
│   │   └── Icons.jsx           # SVG icons
│   ├── context/
│   │   └── AuthContext.jsx     # Authentication context
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # App entry point
│   └── index.css               # Global styles
├── .env                         # Environment variables
├── package.json                 # Dependencies
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind configuration
└── README.md                    # This file
```

## 🛠️ Technologies Used

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

## 📦 Build for Production

```bash
# Build frontend
npm run build

# The build output will be in the `dist/` folder
```

## 🔒 Security Features

- **Password Hashing**: Passwords encrypted with bcrypt
- **JWT Tokens**: Secure token-based authentication
- **Protected Routes**: API endpoints require authentication
- **Token Expiry**: Tokens expire after 7 days
- **Input Validation**: Form validation on client and server

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify token

### Subjects
- `GET /api/subjects` - Get all subjects (authenticated)
- `POST /api/subjects` - Create subject (authenticated)
- `PUT /api/subjects/:id` - Update subject (authenticated)
- `DELETE /api/subjects/:id` - Delete subject (authenticated)

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env`
- For local MongoDB: `mongodb://localhost:27017/study-planner`
- For MongoDB Atlas: Use connection string from Atlas dashboard

### Port Already in Use
- Frontend (5173) or Backend (5000) port in use
- Kill the process or change port in `.env` (backend) or `vite.config.js` (frontend)

### CORS Errors
- Ensure backend server is running
- Check API_URL in `src/api/axios.js` matches your backend URL

## 🤝 Contributing

Feel free to fork this project and customize it for your needs!

## 📄 License

This project is open source and available under the MIT License.

## 🎉 Enjoy Studying!

Happy learning, Future Writers! 📚✨

