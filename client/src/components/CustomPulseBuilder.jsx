import { useState } from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Input from './ui/Input';

const TIMER_OPTIONS = [3, 5, 10, 15, 30];

export default function CustomPulseBuilder({ isOpen, onClose, onLaunch }) {
  const [question, setQuestion] = useState('');
  const [responseType, setResponseType] = useState('yesno');
  const [options, setOptions] = useState(['', '']);
  const [timer, setTimer] = useState(10);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [error, setError] = useState('');

  const resetForm = () => {
    setQuestion('');
    setResponseType('yesno');
    setOptions(['', '']);
    setTimer(10);
    setIsAnonymous(true);
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleLaunch = () => {
    if (!question.trim()) {
      setError('Question is required');
      return;
    }

    if (responseType === 'choice') {
      const validOptions = options.filter((o) => o.trim());
      if (validOptions.length < 2) {
        setError('At least 2 options are required');
        return;
      }
    }

    setError('');

    const pulseData = {
      question: question.trim(),
      responseType,
      options: responseType === 'choice' ? options.filter((o) => o.trim()) : undefined,
      timer,
      isAnonymous,
      category: 'custom',
    };

    onLaunch(pulseData);
    handleClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Custom Pulse" size="md">
      <div className="space-y-5">
        {/* Question */}
        <Input
          id="pulse-question"
          label="Question"
          placeholder="What should we revise before moving ahead?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          autoFocus
        />

        {/* Response Type */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Response Type</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'yesno', label: 'Yes / No' },
              { value: 'rating', label: 'Rating 1–5' },
              { value: 'choice', label: 'Single Choice' },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setResponseType(opt.value)}
                className={`px-3 py-2 text-sm rounded-lg border transition-all
                  ${responseType === opt.value
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 font-medium'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }
                `}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Choice options */}
        {responseType === 'choice' && (
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Options</label>
            <div className="space-y-2">
              {options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-5">{String.fromCharCode(65 + i)}</span>
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionChange(i, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + i)}`}
                    className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                  {options.length > 2 && (
                    <button
                      onClick={() => handleRemoveOption(i)}
                      className="text-gray-400 hover:text-red-500 transition-colors text-sm"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              {options.length < 6 && (
                <button
                  onClick={handleAddOption}
                  className="text-sm text-indigo-500 hover:text-indigo-600 font-medium"
                >
                  + Add option
                </button>
              )}
            </div>
          </div>
        )}

        {/* Timer */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Timer</label>
          <div className="flex gap-2">
            {TIMER_OPTIONS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTimer(t)}
                className={`px-3 py-1.5 text-sm rounded-lg border transition-all
                  ${timer === t
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 font-medium'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }
                `}
              >
                {t}s
              </button>
            ))}
          </div>
        </div>

        {/* Anonymous toggle */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">Anonymous Responses</p>
            <p className="text-xs text-gray-400">Student identities hidden from instructor</p>
          </div>
          <button
            type="button"
            onClick={() => setIsAnonymous(!isAnonymous)}
            className={`relative w-10 h-6 rounded-full transition-colors ${
              isAnonymous ? 'bg-indigo-500' : 'bg-gray-300'
            }`}
            role="switch"
            aria-checked={isAnonymous}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                isAnonymous ? 'translate-x-4' : ''
              }`}
            />
          </button>
        </div>

        {/* Error */}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleLaunch}>Launch Pulse</Button>
        </div>
      </div>
    </Modal>
  );
}
