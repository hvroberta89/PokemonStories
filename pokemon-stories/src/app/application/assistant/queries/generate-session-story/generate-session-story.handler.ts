import type { SessionAssistant, SessionStoryContext } from '../../ports/session-assistant';

export class GenerateSessionStoryHandler {
  constructor(private readonly assistant: SessionAssistant) {}

  async execute(context: SessionStoryContext): Promise<string> {
    if (!context.adventureTitle.trim() || !context.locationName.trim()) {
      throw new Error('A Session Story kontextusa hiányos.');
    }
    if (context.events.length > 30 || context.rewards.length > 30) {
      throw new Error('A Session Story kontextusa túl hosszú.');
    }
    const story = (await this.assistant.generateStory(context)).trim();
    if (!story || story.length > 2_000) {
      throw new Error('Az AI Session Story válasza nem használható.');
    }
    return story;
  }
}
