import type {
  PsIconName,
} from '../../../../shared/ui/public-api';

export type AssistantPromptType =
  | 'event'
  | 'clue'
  | 'character';

export interface AssistantPromptViewModel {
  readonly type: AssistantPromptType;
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly placeholder: string;
  readonly icon: PsIconName;
  readonly submitLabel: string;
}

export interface AssistantPromptDraft {
  readonly type: AssistantPromptType;
  readonly context: string;
}