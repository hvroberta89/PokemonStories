export interface AdventureFoundationContext {
  readonly idea: string;
  readonly audienceLabel: string;
  readonly sessionLengthMinutes: number;
}

export interface AdventureFoundationSuggestion {
  readonly title: string;
  readonly premise: string;
}

export interface AdventureSceneSuggestionContext {
  readonly adventureTitle: string;
  readonly premise: string;
  readonly audienceLabel: string;
  readonly sessionLengthMinutes: number;
  readonly direction: string;
}

export interface AdventureSceneSuggestion {
  readonly title: string;
  readonly description: string;
  readonly goal: string;
}

export interface AdventureStorySuggestionContext {
  readonly adventureTitle: string;
  readonly premise: string;
  readonly audienceLabel: string;
  readonly sessionLengthMinutes: number;
  readonly direction: string;
}

export interface AdventureStorySuggestion {
  readonly opening: string;
  readonly development: string;
  readonly climax: string;
  readonly resolution: string;
}

export interface AdventureAssistant {
  generateFoundationSuggestions(
    context: AdventureFoundationContext,
  ): Promise<readonly AdventureFoundationSuggestion[]>;

  generateSceneSuggestions(
    context: AdventureSceneSuggestionContext,
  ): Promise<readonly AdventureSceneSuggestion[]>;

  generateStorySuggestions(
    context: AdventureStorySuggestionContext,
  ): Promise<readonly AdventureStorySuggestion[]>;
}