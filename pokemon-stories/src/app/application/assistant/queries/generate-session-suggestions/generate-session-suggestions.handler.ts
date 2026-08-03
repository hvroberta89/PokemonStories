import type {
  SessionAssistant,
  SessionAssistantAction,
  SessionAssistantContext,
  SessionAssistantSuggestion,
} from '../../ports/session-assistant';

export class GenerateSessionSuggestionsHandler {
  constructor(private readonly assistant: SessionAssistant) {}

  async execute(
    action: SessionAssistantAction,
    context: SessionAssistantContext,
  ): Promise<readonly SessionAssistantSuggestion[]> {
    if (!context.adventureTitle.trim() || !context.locationName.trim() || !context.goal.trim()) {
      throw new Error('A Session kontextusa hiányos.');
    }
    if (context.userContext.length > 280 || context.recentEvents.length > 5) {
      throw new Error('Az AI kérés kontextusa túl hosszú.');
    }
    const suggestions = await this.assistant.generate(action, context);
    if (suggestions.length !== 3 || suggestions.some((suggestion) => !isValid(suggestion))) {
      throw new Error('Az AI válasza nem használható.');
    }
    return suggestions;
  }
}

function isValid(suggestion: SessionAssistantSuggestion): boolean {
  return (
    suggestion.title.trim().length > 0 &&
    suggestion.title.length <= 120 &&
    suggestion.description.trim().length > 0 &&
    suggestion.description.length <= 500
  );
}
