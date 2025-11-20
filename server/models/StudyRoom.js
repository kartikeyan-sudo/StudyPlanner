import mongoose from 'mongoose';

const studyRoomSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  roomName: {
    type: String,
    required: true,
    trim: true
  },
  meetLink: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const StudyRoom = mongoose.model('StudyRoom', studyRoomSchema);

export default StudyRoom;
