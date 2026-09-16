const { pulseTemplates, pulseCategories } = require('../src/data/pulseTemplates');
const { calculateDistribution } = require('../src/utils/helpers');

describe('Quick Pulse Library & Distribution Calculations', () => {
  describe('pulseCategories', () => {
    it('contains all 5 core pedagogical categories', () => {
      const categoryIds = pulseCategories.map((c) => c.id);
      expect(categoryIds).toEqual(
        expect.arrayContaining(['understanding', 'pace', 'revision', 'doubt', 'feedback'])
      );
    });

    it('every category has id, label, and emoji icon', () => {
      pulseCategories.forEach((cat) => {
        expect(cat.id).toBeTruthy();
        expect(cat.label).toBeTruthy();
        expect(cat.icon).toBeTruthy();
      });
    });
  });

  describe('pulseTemplates', () => {
    it('contains at least 15 curated templates', () => {
      expect(pulseTemplates.length).toBeGreaterThanOrEqual(15);
    });

    it('each template has valid schema fields', () => {
      const validCategories = pulseCategories.map((c) => c.id);
      const validTypes = ['yesno', 'rating', 'choice'];

      pulseTemplates.forEach((t) => {
        expect(t.id).toBeTruthy();
        expect(t.question).toBeTruthy();
        expect(validCategories).toContain(t.category);
        expect(validTypes).toContain(t.responseType);
        expect(t.defaultTimer).toBeGreaterThanOrEqual(3);
        expect(t.defaultTimer).toBeLessThanOrEqual(120);
      });
    });

    it('number shortcuts 1-9 are assigned uniquely', () => {
      const shortcuts = pulseTemplates.map((t) => t.shortcut).filter(Boolean);
      const uniqueShortcuts = new Set(shortcuts);
      expect(shortcuts.length).toBe(uniqueShortcuts.size);
      shortcuts.forEach((sc) => {
        expect(['1', '2', '3', '4', '5', '6', '7', '8', '9']).toContain(sc);
      });
    });
  });

  describe('calculateDistribution', () => {
    it('correctly aggregates yesno poll responses', () => {
      const poll = { responseType: 'yesno' };
      const responses = [
        { answer: 'Yes' },
        { answer: 'Yes' },
        { answer: 'Yes' },
        { answer: 'No' },
      ];

      const dist = calculateDistribution(poll, responses);
      expect(dist).toEqual({ Yes: 3, No: 1 });
    });

    it('initializes zero counts for all rating values 1 to 5', () => {
      const poll = { responseType: 'rating' };
      const responses = [
        { answer: '5' },
        { answer: '5' },
        { answer: '4' },
      ];

      const dist = calculateDistribution(poll, responses);
      expect(dist).toEqual({
        '1': 0,
        '2': 0,
        '3': 0,
        '4': 1,
        '5': 2,
      });
    });

    it('correctly counts custom choice options', () => {
      const poll = {
        responseType: 'choice',
        options: ['Option A', 'Option B', 'Option C'],
      };
      const responses = [
        { answer: 'Option A' },
        { answer: 'Option C' },
        { answer: 'Option A' },
      ];

      const dist = calculateDistribution(poll, responses);
      expect(dist).toEqual({
        'Option A': 2,
        'Option B': 0,
        'Option C': 1,
      });
    });

    it('handles zero responses cleanly', () => {
      const poll = { responseType: 'yesno' };
      const dist = calculateDistribution(poll, []);
      expect(dist).toEqual({ Yes: 0, No: 0 });
    });
  });
});
