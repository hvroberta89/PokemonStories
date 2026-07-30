export type ImprovAssistantAction =
  | 'unexpected-direction'
  | 'quick-npc'
  | 'pokemon-event'
  | 'continue-story';

export interface ImprovAssistantOptionViewModel {
  readonly action: ImprovAssistantAction;
  readonly title: string;
  readonly description: string;
  readonly icon: string;
}

export interface ImprovAssistantViewModel {
  readonly title: string;
  readonly description: string;
  readonly options:
    readonly ImprovAssistantOptionViewModel[];
}