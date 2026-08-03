import type { AdventureAssistant } from '../../ports/adventure-assistant';
import { GenerateSceneSuggestionsHandler } from './generate-scene-suggestions.handler';

describe('GenerateSceneSuggestionsHandler', () => {
  const context = {
    adventureTitle: 'Az eltűnt tojás',
    premise: 'Egy különleges tojás eltűnik az erdei kutatóbázisról.',
    audienceLabel: 'Gyerekek',
    sessionLengthMinutes: 60,
    direction: 'Legyen ez a nyitójelenet.',
  };

  it('returns exactly three validated Scene Suggestions', async () => {
    const assistant: AdventureAssistant = {
      generateFoundationSuggestions: vi.fn(),
      generateSceneSuggestions: vi.fn().mockResolvedValue([
        { title: 'Reggel a bázison', description: 'A csapat a kutatóbázisnál találkozik.', goal: 'Tudjátok meg, hová tűnt a tojás.' },
        { title: 'A felborult kosár', description: 'Egy kosár mellett különös nyomok látszanak.', goal: 'Kövessétek a friss nyomokat.' },
        { title: 'Segítségkérés az erdőből', description: 'Egy félénk Pokemon hangja hallatszik.', goal: 'Találjátok meg a hang forrását.' },
      ]),
      generateStorySuggestions: vi.fn(),
    };
    const handler = new GenerateSceneSuggestionsHandler(assistant);

    const suggestions = await handler.execute(context);

    expect(suggestions).toHaveLength(3);
    expect(assistant.generateSceneSuggestions).toHaveBeenCalledWith(context);
  });

  it('rejects Scene Suggestions without an actionable goal', async () => {
    const handler = new GenerateSceneSuggestionsHandler({
      generateFoundationSuggestions: async () => [],
      generateSceneSuggestions: async () => [
        { title: 'Első', description: 'Leírás.', goal: 'Cél.' },
        { title: 'Második', description: 'Leírás.', goal: '' },
        { title: 'Harmadik', description: 'Leírás.', goal: 'Cél.' },
      ],
      generateStorySuggestions: async () => [],
    });

    await expect(handler.execute(context)).rejects.toThrow('Az AI válasza nem használható.');
  });
});