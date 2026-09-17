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
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2 block">
            Response Type
          </label>
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
                className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                  responseType === opt.value
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-2xs'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Choice options */}
        {responseType === 'choice' && (
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2 block">
              Answer Options
            </label>
            <div className="space-y-2">
              {options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-xs font-mono font-bold text-slate-500">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionChange(i, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + i)}`}
                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 outline-none bg-white"
                  />
                  {options.length > 2 && (
                    <button
                      onClick={() => handleRemoveOption(i)}
                      className="text-slate-400 hover:text-rose-500 transition-colors p-1 cursor-pointer"
                      title="Remove option"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              {options.length < 6 && (
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold cursor-pointer flex items-center gap-1 mt-1"
                >
                  + Add Another Option
                </button>
              )}
            </div>
          </div>
        )}

        {/* Timer */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2 block">
            Time Limit
          </label>
          <div className="flex gap-2">
            {TIMER_OPTIONS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTimer(t)}
                className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-lg border transition-all cursor-pointer ${
                  timer === t
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-2xs'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {t}s
              </button>
            ))}
          </div>
        </div>

        {/* Anonymous toggle */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <div>
            <p className="text-xs font-semibold text-slate-800 uppercase tracking-wider">100% Anonymous Mode</p>
            <p className="text-xs text-slate-500 mt-0.5">Student identities are never shown to the instructor</p>
          </div>
          <button
            type="button"
            onClick={() => setIsAnonymous(!isAnonymous)}
            className={`relative w-10 h-5.5 rounded-full transition-colors cursor-pointer ${
              isAnonymous ? 'bg-indigo-600' : 'bg-slate-300'
            }`}
            role="switch"
            aria-checked={isAnonymous}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow-xs transition-transform ${
                isAnonymous ? 'translate-x-4.5' : ''
              }`}
            />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs font-medium text-rose-600">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
          <Button variant="secondary" size="sm" onClick={handleClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleLaunch}>
            Launch Live Pulse
          </Button>
        </div>
      </div>
    </Modal>
  );
}
