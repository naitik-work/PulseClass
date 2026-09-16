/**
 * Quick Pulse Library — Curated FAQ templates for instant classroom feedback.
 * Each template has an id, question, category, responseType, defaultTimer, and shortcut.
 *
 * Categories:
 *   understanding — Concept comprehension checks
 *   pace         — Speed and pacing questions
 *   revision     — Recap and review prompts
 *   doubt        — Clarification needs
 *   feedback     — Session quality feedback
 */

const pulseTemplates = [
  // --- Understanding ---
  {
    id: 'understand-1',
    question: 'Should I move ahead?',
    category: 'understanding',
    responseType: 'yesno',
    defaultTimer: 10,
    shortcut: '1',
  },
  {
    id: 'understand-2',
    question: 'Do you understand this concept?',
    category: 'understanding',
    responseType: 'yesno',
    defaultTimer: 10,
    shortcut: '2',
  },
  {
    id: 'understand-3',
    question: 'Was that explanation clear?',
    category: 'understanding',
    responseType: 'yesno',
    defaultTimer: 10,
    shortcut: '3',
  },
  {
    id: 'understand-4',
    question: 'Do you need one more example?',
    category: 'understanding',
    responseType: 'yesno',
    defaultTimer: 10,
    shortcut: '4',
  },

  // --- Pace ---
  {
    id: 'pace-1',
    question: 'Am I going too fast?',
    category: 'pace',
    responseType: 'yesno',
    defaultTimer: 10,
    shortcut: '5',
  },
  {
    id: 'pace-2',
    question: 'Should we slow down?',
    category: 'pace',
    responseType: 'yesno',
    defaultTimer: 10,
    shortcut: null,
  },
  {
    id: 'pace-3',
    question: 'Ready for the next topic?',
    category: 'pace',
    responseType: 'yesno',
    defaultTimer: 10,
    shortcut: null,
  },

  // --- Revision ---
  {
    id: 'revision-1',
    question: 'Should we revise this?',
    category: 'revision',
    responseType: 'yesno',
    defaultTimer: 10,
    shortcut: '6',
  },
  {
    id: 'revision-2',
    question: 'Do you want a quick recap?',
    category: 'revision',
    responseType: 'yesno',
    defaultTimer: 10,
    shortcut: null,
  },
  {
    id: 'revision-3',
    question: 'Should we revisit the previous concept?',
    category: 'revision',
    responseType: 'yesno',
    defaultTimer: 10,
    shortcut: null,
  },

  // --- Doubt ---
  {
    id: 'doubt-1',
    question: 'Does anyone need clarification?',
    category: 'doubt',
    responseType: 'yesno',
    defaultTimer: 15,
    shortcut: '7',
  },
  {
    id: 'doubt-2',
    question: 'Is there anything confusing?',
    category: 'doubt',
    responseType: 'yesno',
    defaultTimer: 15,
    shortcut: null,
  },
  {
    id: 'doubt-3',
    question: 'Should I explain that differently?',
    category: 'doubt',
    responseType: 'yesno',
    defaultTimer: 10,
    shortcut: null,
  },

  // --- Feedback ---
  {
    id: 'feedback-1',
    question: 'Was this explanation helpful?',
    category: 'feedback',
    responseType: 'yesno',
    defaultTimer: 10,
    shortcut: '8',
  },
  {
    id: 'feedback-2',
    question: 'Would another example help?',
    category: 'feedback',
    responseType: 'yesno',
    defaultTimer: 10,
    shortcut: null,
  },
  {
    id: 'feedback-3',
    question: 'Was the pace comfortable?',
    category: 'feedback',
    responseType: 'yesno',
    defaultTimer: 10,
    shortcut: null,
  },
  {
    id: 'feedback-4',
    question: 'How would you rate this session so far?',
    category: 'feedback',
    responseType: 'rating',
    defaultTimer: 15,
    shortcut: '9',
  },
];

const pulseCategories = [
  { id: 'understanding', label: 'Understanding', icon: '💡' },
  { id: 'pace', label: 'Pace', icon: '⚡' },
  { id: 'revision', label: 'Revision', icon: '🔄' },
  { id: 'doubt', label: 'Doubt', icon: '❓' },
  { id: 'feedback', label: 'Feedback', icon: '📊' },
];

module.exports = { pulseTemplates, pulseCategories };
