const mongoose = require('mongoose');

// 节日模型
const HolidaySchema = new mongoose.Schema({
  familyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Family',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    enum: ['birthday', 'anniversary', 'reunion', 'festival'],
    required: true
  },
  remindDays: {
    type: Number,
    default: 7
  },
  suggestions: {
    type: String,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Holiday', HolidaySchema);
