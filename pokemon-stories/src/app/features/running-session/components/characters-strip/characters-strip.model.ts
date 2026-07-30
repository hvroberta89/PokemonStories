export type CharacterStatus =
  | 'ready'
  | 'thinking'
  | 'injured'
  | 'away';

export interface CharacterStripItemViewModel {
  readonly id: string;
  readonly name: string;
  readonly avatarUrl?: string;
  readonly initials: string;
  readonly status: CharacterStatus;
  readonly statusLabel: string;
}

export interface CharactersStripViewModel {
  readonly title: string;
  readonly countLabel: string;
  readonly addLabel: string;
  readonly characters:
    readonly CharacterStripItemViewModel[];
}