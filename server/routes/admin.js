import express from 'express';
import User from '../models/User.js';
import Subject from '../models/Subject.js';
import Assignment from '../models/Assignment.js';
import StudyRoom from '../models/StudyRoom.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to verify admin
const verifyAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

// Get all users
router.get('/users', verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    // Return users with password visible for admin
    const usersWithPassword = users.map(user => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password, // Hashed password
      isAdmin: user.isAdmin,
      isBlocked: user.isBlocked,
      createdAt: user.createdAt
    }));
    res.json(usersWithPassword);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user
router.delete('/users/:id', verifyAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isAdmin) {
      return res.status(400).json({ message: 'Cannot delete admin users' });
    }

    // Also delete user's subjects, assignments, etc.
    await Subject.deleteMany({ userId: req.params.id });
    await Assignment.deleteMany({ userId: req.params.id });
    await user.deleteOne();

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Block/Unblock user
router.patch('/users/:id/block', verifyAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isAdmin) {
      return res.status(400).json({ message: 'Cannot block admin users' });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({ 
      message: user.isBlocked ? 'User blocked successfully' : 'User unblocked successfully',
      isBlocked: user.isBlocked
    });
  } catch (error) {
    console.error('Error blocking/unblocking user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all subjects (across all users)
router.get('/subjects', verifyAdmin, async (req, res) => {
  try {
    const subjects = await Subject.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all assignments (across all users)
router.get('/assignments', verifyAdmin, async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all study rooms
router.get('/studyrooms', verifyAdmin, async (req, res) => {
  try {
    const studyRooms = await StudyRoom.find().sort({ createdAt: -1 });
    res.json(studyRooms);
  } catch (error) {
    console.error('Error fetching study rooms:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
