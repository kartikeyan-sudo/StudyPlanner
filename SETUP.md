# 🚀 Quick Setup Guide

## Step 1: Install Dependencies
```bash
npm install
```

## Step 2: Start MongoDB

### Windows (Local MongoDB):
```bash
net start MongoDB
```

### macOS/Linux (Local MongoDB):
```bash
sudo systemctl start mongod
```

### Or use MongoDB Atlas (Cloud):
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Update `.env` file with your connection string

## Step 3: Start the Application

### Option 1 - Run everything together (Recommended):
```bash
npm run dev:all
```

### Option 2 - Run separately:

**Terminal 1 (Backend):**
```bash
npm run server
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

## Step 4: Open Browser

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Step 5: Register & Login

1. Click "Register" to create an account
2. Fill in your name, email, and password
3. After registration, you'll see "Welcome Future Writers" for 2 seconds
4. Start adding subjects and tracking your study progress!

## 🎉 You're All Set!

Enjoy your study planning journey! 📚✨

---

## Troubleshooting

**MongoDB not starting?**
- Make sure MongoDB is installed
- Check if port 27017 is available

**Backend not connecting?**
- Check `.env` file
- Verify MongoDB is running
- Check console for errors

**Frontend can't reach backend?**
- Ensure backend is running on port 5000
- Check `src/api/axios.js` for correct API URL
