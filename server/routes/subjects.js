import express from 'express';
import Subject from '../models/Subject.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all subjects for logged-in user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const subjects = await Subject.find({ userId: req.user.userId });
    res.json(subjects);
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({ message: 'Failed to fetch subjects' });
  }
});

// Create new subject
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, course, deadline, studyData } = req.body;

    const subject = new Subject({
      userId: req.user.userId,
      name,
      course,
      deadline,
      studyData: studyData || {},
      completedTopics: {}
    });

    await subject.save();
    res.status(201).json(subject);
  } catch (error) {
    console.error('Create subject error:', error);
    res.status(500).json({ message: 'Failed to create subject' });
  }
});

// Update subject
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const subject = await Subject.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      updates,
      { new: true }
    );

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.json(subject);
  } catch (error) {
    console.error('Update subject error:', error);
    res.status(500).json({ message: 'Failed to update subject' });
  }
});

// Delete subject
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const subject = await Subject.findOneAndDelete({
      _id: id,
      userId: req.user.userId
    });

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    console.error('Delete subject error:', error);
    res.status(500).json({ message: 'Failed to delete subject' });
  }
});

export default router;
