import type {
  PsIconName,
} from '../../../../shared/ui/public-api';

export type StoryMood =
  | 'exploration'
  | 'mystery'
  | 'danger'
  | 'peaceful';

export interface StoryCardViewModel {
  readonly locationName: string;
  readonly locationIcon: PsIconName;
  readonly narration: readonly string[];
  readonly imageUrl: string;
  readonly imageAlt: string;
  readonly mood: StoryMood;
  readonly currentPage: number;
  readonly pageCount: number;
}