import express from 'express';
import Assignment from '../models/Assignment.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(authenticateToken);

// Get all assignments for the logged-in user
router.get('/', async (req, res) => {
  try {
    const assignments = await Assignment.find({ userId: req.user.userId })
      .sort({ deadline: 1, createdAt: -1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new assignment
router.post('/', async (req, res) => {
  try {
    const { title, description, deadline } = req.body;
    
    const assignment = new Assignment({
      userId: req.user.userId,
      title,
      description,
      deadline
    });
    
    await assignment.save();
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update an assignment
router.put('/:id', async (req, res) => {
  try {
    const { title, description, deadline, completed } = req.body;
    
    const assignment = await Assignment.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    
    if (title !== undefined) assignment.title = title;
    if (description !== undefined) assignment.description = description;
    if (deadline !== undefined) assignment.deadline = deadline;
    if (completed !== undefined) assignment.completed = completed;
    
    await assignment.save();
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete an assignment
router.delete('/:id', async (req, res) => {
  try {
    const assignment = await Assignment.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    
    res.json({ message: 'Assignment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
