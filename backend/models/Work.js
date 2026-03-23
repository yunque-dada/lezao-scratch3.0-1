/**
 * 作品模型
 */
const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  score: {
    type: Number,
    default: 0
  },
  comment: {
    type: String,
    default: ''
  }
}, { timestamps: true });

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  }
}, { timestamps: true });

const workSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  chapter: {
    type: mongoose.Schema.Types.ObjectId
  },
  fileUrl: {
    type: String,
    required: true
  },
  coverUrl: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['submitted', 'graded'],
    default: 'submitted'
  },
  score: {
    type: Number,
    default: 0
  },
  grades: [gradeSchema],
  comments: [commentSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Work', workSchema);
