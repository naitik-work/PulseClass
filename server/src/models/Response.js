const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema(
  {
    poll: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Poll',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    answer: {
      type: String,
      required: true,
      trim: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index: one response per student per poll (defense in depth)
responseSchema.index({ poll: 1, student: 1 }, { unique: true });
responseSchema.index({ poll: 1 });

module.exports = mongoose.model('Response', responseSchema);
