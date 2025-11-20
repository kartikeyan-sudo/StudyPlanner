import express from 'express';
import StudyRoom from '../models/StudyRoom.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all study rooms (public - anyone can see)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const studyRooms = await StudyRoom.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(studyRooms);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch study rooms' });
  }
});

// Create a new study room
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, roomName, meetLink } = req.body;
    
    const studyRoom = new StudyRoom({
      userId: req.user.userId,
      name,
      roomName,
      meetLink
    });

    await studyRoom.save();
    const populated = await StudyRoom.findById(studyRoom._id).populate('userId', 'name email');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create study room' });
  }
});

// Delete a study room (only creator can delete)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const studyRoom = await StudyRoom.findById(req.params.id);
    
    if (!studyRoom) {
      return res.status(404).json({ message: 'Study room not found' });
    }

    // Only the creator can delete their room
    if (studyRoom.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this room' });
    }

    await StudyRoom.findByIdAndDelete(req.params.id);
    res.json({ message: 'Study room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete study room' });
  }
});

export default router;
