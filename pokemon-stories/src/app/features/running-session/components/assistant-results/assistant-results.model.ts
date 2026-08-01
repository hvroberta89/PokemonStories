import type {
  PsIconName,
} from '../../../../shared/ui/public-api';

import type {
  AssistantPromptType,
} from '../assistant-prompt/assistant-prompt.model';

export interface AssistantSuggestionViewModel {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: PsIconName;
}

export interface AssistantResultsViewModel {
  readonly type: AssistantPromptType;
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly suggestions:
    readonly AssistantSuggestionViewModel[];
}

export interface AssistantSuggestionSelection {
  readonly type: AssistantPromptType;
  readonly suggestion:
    AssistantSuggestionViewModel;
}