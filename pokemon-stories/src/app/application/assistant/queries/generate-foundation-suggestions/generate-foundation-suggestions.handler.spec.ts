import type { AdventureAssistant } from '../../ports/adventure-assistant';
import { GenerateFoundationSuggestionsHandler } from './generate-foundation-suggestions.handler';

describe('GenerateFoundationSuggestionsHandler', () => {
  const context = {
    idea: 'Egy eltűnt Pokemon tojás nyomai az erdőbe vezetnek.',
    audienceLabel: 'Gyerekek',
    sessionLengthMinutes: 60,
  };

  it('returns exactly three validated Foundation Suggestions', async () => {
    const assistant: AdventureAssistant = {
      generateFoundationSuggestions: vi.fn().mockResolvedValue([
        { title: 'Az eltűnt tojás', premise: 'Egy különleges tojás eltűnik az erdei kutatóbázisról.' },
        { title: 'Lábnyomok a tisztáson', premise: 'A csapat rejtélyes lábnyomokat követ a tisztás felé.' },
        { title: 'Az erdő titka', premise: 'Egy félénk Pokemon segítséget kér az elveszett tojás ügyében.' },
      ]),
      generateSceneSuggestions: vi.fn(),
      generateStorySuggestions: vi.fn(),
    };
    const handler = new GenerateFoundationSuggestionsHandler(assistant);

    const suggestions = await handler.execute(context);

    expect(suggestions).toHaveLength(3);
    expect(assistant.generateFoundationSuggestions).toHaveBeenCalledWith(context);
  });

  it('rejects malformed assistant responses', async () => {
    const handler = new GenerateFoundationSuggestionsHandler({
      generateFoundationSuggestions: async () => [
        { title: 'Egyetlen ötlet', premise: 'Ez nem elég alternatíva.' },
      ],
      generateSceneSuggestions: async () => [],
      generateStorySuggestions: async () => [],
    });

    await expect(handler.execute(context)).rejects.toThrow('Az AI válasza nem használható.');
  });
});