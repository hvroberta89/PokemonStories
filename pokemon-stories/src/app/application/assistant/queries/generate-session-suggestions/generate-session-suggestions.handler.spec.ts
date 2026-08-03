import type { SessionAssistant } from '../../ports/session-assistant';
import { GenerateSessionSuggestionsHandler } from './generate-session-suggestions.handler';

describe('GenerateSessionSuggestionsHandler', () => {
  it('returns exactly three validated Suggestions from the assistant', async () => {
    const assistant: SessionAssistant = {
      generate: vi.fn().mockResolvedValue([
        { title: 'Első ötlet', description: 'Rövid, használható esemény.' },
        { title: 'Második ötlet', description: 'Egy másik irány.' },
        { title: 'Harmadik ötlet', description: 'Egy váratlan fordulat.' },
      ]),
      generateStory: vi.fn(),
    };
    const handler = new GenerateSessionSuggestionsHandler(assistant);

    const suggestions = await handler.execute('event', {
      adventureTitle: 'Az elveszett tojás',
      locationName: 'Virágmező',
      goal: 'Találjátok meg a tojást.',
      recentEvents: ['A csapat megtalálta az ösvényt.'],
      userContext: 'Legyen játékos.',
    });

    expect(suggestions).toHaveLength(3);
    expect(assistant.generate).toHaveBeenCalledOnce();
  });

  it('rejects a malformed assistant response', async () => {
    const handler = new GenerateSessionSuggestionsHandler({
      generate: async () => [{ title: 'Egyetlen ötlet', description: 'Kevés.' }],
      generateStory: async () => '',
    });

    await expect(
      handler.execute('clue', {
        adventureTitle: 'Az elveszett tojás',
        locationName: 'Virágmező',
        goal: 'Találjátok meg a tojást.',
        recentEvents: [],
        userContext: '',
      }),
    ).rejects.toThrow('Az AI válasza nem használható.');
  });
});
