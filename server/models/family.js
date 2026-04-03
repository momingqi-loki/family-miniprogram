const mongoose = require('mongoose');

// 家庭模型
const FamilySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Family', FamilySchema);
