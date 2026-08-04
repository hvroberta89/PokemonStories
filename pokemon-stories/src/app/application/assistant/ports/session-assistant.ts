export type SessionAssistantAction = 'event' | 'clue' | 'character' | 'reward';

export interface SessionAssistantContext {
  readonly adventureTitle: string;
  readonly locationName: string;
  readonly goal: string;
  readonly recentEvents: readonly string[];
  readonly userContext: string;
}

export interface SessionAssistantSuggestion {
  readonly title: string;
  readonly description: string;
}

export interface SessionStoryContext {
  readonly adventureTitle: string;
  readonly locationName: string;
  readonly events: readonly string[];
  readonly rewards: readonly string[];
}

export interface SessionAssistant {
  generate(
    action: SessionAssistantAction,
    context: SessionAssistantContext,
  ): Promise<readonly SessionAssistantSuggestion[]>;

  generateStory(context: SessionStoryContext): Promise<string>;
}
