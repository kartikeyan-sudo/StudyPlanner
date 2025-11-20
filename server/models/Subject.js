import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
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
  course: {
    type: String,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  studyData: {
    type: Object,
    default: {}
  },
  completedTopics: {
    type: Object,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Subject', subjectSchema);
