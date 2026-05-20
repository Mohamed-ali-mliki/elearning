const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
  order: { type: Number, default: 0 }
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  thumbnail: { type: String, default: '' },
  price: { type: Number, required: true, default: 0 },
  formateurId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  chapters: [chapterSchema],
  isApproved: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);