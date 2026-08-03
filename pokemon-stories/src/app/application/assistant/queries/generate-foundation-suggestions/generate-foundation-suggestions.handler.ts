import type {
  AdventureAssistant,
  AdventureFoundationContext,
  AdventureFoundationSuggestion,
} from '../../ports/adventure-assistant';

export class GenerateFoundationSuggestionsHandler {
  constructor(private readonly assistant: AdventureAssistant) {}

  async execute(
    context: AdventureFoundationContext,
  ): Promise<readonly AdventureFoundationSuggestion[]> {
    if (!context.idea.trim() || !context.audienceLabel.trim() || context.sessionLengthMinutes <= 0) {
      throw new Error('A Foundation kontextusa hiányos.');
    }
    if (context.idea.length > 1_000) {
      throw new Error('A Foundation ötlet túl hosszú.');
    }
    const suggestions = await this.assistant.generateFoundationSuggestions(context);
    if (suggestions.length !== 3 || suggestions.some((suggestion) => !isValid(suggestion))) {
      throw new Error('Az AI válasza nem használható.');
    }
    return suggestions;
  }
}

function isValid(suggestion: AdventureFoundationSuggestion): boolean {
  return (
    suggestion.title.trim().length > 0 &&
    suggestion.title.length <= 120 &&
    suggestion.premise.trim().length > 0 &&
    suggestion.premise.length <= 1_000
  );
}