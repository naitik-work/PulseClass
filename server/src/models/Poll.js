const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
      required: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    category: {
      type: String,
      enum: ['understanding', 'pace', 'revision', 'doubt', 'feedback', 'custom'],
      default: 'custom',
    },
    responseType: {
      type: String,
      enum: ['yesno', 'rating', 'choice'],
      required: true,
    },
    options: [
      {
        type: String,
        trim: true,
      },
    ],
    timer: {
      type: Number,
      required: true,
      min: 3,
      max: 120,
      default: 10,
    },
    isAnonymous: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    launchedAt: {
      type: Date,
      default: Date.now,
    },
    closedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
pollSchema.index({ session: 1 });
pollSchema.index({ session: 1, isActive: 1 });

module.exports = mongoose.model('Poll', pollSchema);
