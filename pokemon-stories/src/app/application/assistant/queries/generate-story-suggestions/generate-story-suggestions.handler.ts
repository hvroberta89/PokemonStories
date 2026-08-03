import type {
  AdventureAssistant,
  AdventureStorySuggestion,
  AdventureStorySuggestionContext,
} from '../../ports/adventure-assistant';

export class GenerateStorySuggestionsHandler {
  constructor(private readonly assistant: AdventureAssistant) {}

  async execute(
    context: AdventureStorySuggestionContext,
  ): Promise<readonly AdventureStorySuggestion[]> {
    if (
      !context.adventureTitle.trim() ||
      !context.premise.trim() ||
      !context.audienceLabel.trim() ||
      context.sessionLengthMinutes <= 0
    ) {
      throw new Error('A történet kontextusa hiányos.');
    }
    if (context.direction.length > 500) throw new Error('A történethez adott irány túl hosszú.');
    const suggestions = await this.assistant.generateStorySuggestions(context);
    if (suggestions.length !== 3 || suggestions.some((suggestion) => !isValid(suggestion))) {
      throw new Error('Az AI válasza nem használható.');
    }
    return suggestions;
  }
}

function isValid(suggestion: AdventureStorySuggestion): boolean {
  return (
    isText(suggestion.opening) &&
    isText(suggestion.development) &&
    isText(suggestion.climax) &&
    isText(suggestion.resolution)
  );
}

function isText(value: string): boolean {
  return value.trim().length > 0 && value.length <= 1_500;
}