import type {
  PsIconName,
} from '../../../../shared/ui/icon/ps-icon.registry';

export type AssistantQuickActionId =
  | 'reward'
  | 'event'
  | 'clue'
  | 'character';

export interface AssistantQuickActionViewModel {
  readonly id: AssistantQuickActionId;
  readonly label: string;
  readonly icon: PsIconName;
}

export interface AdventureAssistantViewModel {
  readonly location: string;
  readonly objective: string;
  readonly hints: readonly string[];
  readonly likelyQuestions: readonly string[];
  readonly quickActions:
    readonly AssistantQuickActionViewModel[];
}