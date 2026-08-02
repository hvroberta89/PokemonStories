export interface AdventureStory {
  readonly opening?: string;
  readonly development?: string;
  readonly climax?: string;
  readonly resolution?: string;
}

export type UpdateAdventureStoryProps = AdventureStory;
