import type { AdventureAssistant } from '../../ports/adventure-assistant';
import { GenerateStorySuggestionsHandler } from './generate-story-suggestions.handler';

describe('GenerateStorySuggestionsHandler', () => {
  const context = {
    adventureTitle: 'Az eltűnt tojás',
    premise: 'Egy különleges tojás eltűnik az erdei kutatóbázisról.',
    audienceLabel: 'Gyerekek',
    sessionLengthMinutes: 60,
    direction: 'Legyen játékos rejtély.',
  };

  it('returns exactly three complete Story Suggestions', async () => {
    const assistant: AdventureAssistant = {
      generateFoundationSuggestions: vi.fn(),
      generateSceneSuggestions: vi.fn(),
      generateStorySuggestions: vi.fn().mockResolvedValue([
        { opening: 'A tojás eltűnik.', development: 'Nyomok az erdőbe vezetnek.', climax: 'A csapat megtalálja a rejtekhelyet.', resolution: 'A tojás biztonságba kerül.' },
        { opening: 'Egy Pichu segítséget kér.', development: 'A barátai gyanúsan viselkednek.', climax: 'Kiderül az igazság.', resolution: 'Új barátság születik.' },
        { opening: 'Rejtélyes fény jelenik meg.', development: 'A fény egy titkos ösvényt mutat.', climax: 'A csapat választás elé kerül.', resolution: 'A tojás hazatér.' },
      ]),
    };
    const handler = new GenerateStorySuggestionsHandler(assistant);

    const suggestions = await handler.execute(context);

    expect(suggestions).toHaveLength(3);
    expect(assistant.generateStorySuggestions).toHaveBeenCalledWith(context);
  });

  it('rejects an incomplete Story Suggestion', async () => {
    const handler = new GenerateStorySuggestionsHandler({
      generateFoundationSuggestions: async () => [],
      generateSceneSuggestions: async () => [],
      generateStorySuggestions: async () => [
        { opening: 'Nyitás.', development: 'Kibontakozás.', climax: 'Csúcspont.', resolution: 'Lezárás.' },
        { opening: 'Nyitás.', development: '', climax: 'Csúcspont.', resolution: 'Lezárás.' },
        { opening: 'Nyitás.', development: 'Kibontakozás.', climax: 'Csúcspont.', resolution: 'Lezárás.' },
      ],
    });

    await expect(handler.execute(context)).rejects.toThrow('Az AI válasza nem használható.');
  });
});