import type { SessionAssistant } from '../../ports/session-assistant';
import { GenerateSessionStoryHandler } from './generate-session-story.handler';

describe('GenerateSessionStoryHandler', () => {
  const context = {
    adventureTitle: 'Az elveszett tojás',
    locationName: 'Virágmező',
    events: ['Megtalálták a régi ösvényt.'],
    rewards: ['Emma megkapta: 1 db Térkép'],
  };

  it('returns a validated editable Session Story draft', async () => {
    const assistant = {
      generate: vi.fn(),
      generateStory: vi.fn().mockResolvedValue('A csapat bátran követte a régi ösvényt.'),
    } satisfies SessionAssistant;
    const handler = new GenerateSessionStoryHandler(assistant);

    await expect(handler.execute(context)).resolves.toBe('A csapat bátran követte a régi ösvényt.');
  });

  it('rejects an empty generated draft', async () => {
    const assistant: SessionAssistant = {
      generate: async () => [],
      generateStory: async () => ' ',
    };
    const handler = new GenerateSessionStoryHandler(assistant);

    await expect(handler.execute(context)).rejects.toThrow(
      'Az AI Session Story válasza nem használható.',
    );
  });
});
