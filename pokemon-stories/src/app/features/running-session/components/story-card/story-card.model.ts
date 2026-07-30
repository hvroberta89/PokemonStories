export type StoryMood =
  | 'exploration'
  | 'battle'
  | 'mystery'
  | 'reward'
  | 'campfire';

export interface StoryCardViewModel {
  readonly locationName: string;
  readonly narration: string;
  readonly imageUrl: string;
  readonly imageAlt: string;
  readonly mood: StoryMood;
}
