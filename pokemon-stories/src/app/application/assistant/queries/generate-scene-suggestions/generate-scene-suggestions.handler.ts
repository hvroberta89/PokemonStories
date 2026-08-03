import type {
  AdventureAssistant,
  AdventureSceneSuggestion,
  AdventureSceneSuggestionContext,
} from '../../ports/adventure-assistant';

export class GenerateSceneSuggestionsHandler {
  constructor(private readonly assistant: AdventureAssistant) {}

  async execute(
    context: AdventureSceneSuggestionContext,
  ): Promise<readonly AdventureSceneSuggestion[]> {
    if (
      !context.adventureTitle.trim() ||
      !context.premise.trim() ||
      !context.audienceLabel.trim() ||
      context.sessionLengthMinutes <= 0
    ) {
      throw new Error('A jelenet kontextusa hiányos.');
    }
    if (context.direction.length > 500) throw new Error('A jelenethez adott irány túl hosszú.');
    const suggestions = await this.assistant.generateSceneSuggestions(context);
    if (suggestions.length !== 3 || suggestions.some((suggestion) => !isValid(suggestion))) {
      throw new Error('Az AI válasza nem használható.');
    }
    return suggestions;
  }
}

function isValid(suggestion: AdventureSceneSuggestion): boolean {
  return (
    suggestion.title.trim().length > 0 &&
    suggestion.title.length <= 120 &&
    suggestion.description.trim().length > 0 &&
    suggestion.description.length <= 1_000 &&
    suggestion.goal.trim().length > 0 &&
    suggestion.goal.length <= 200
  );
}