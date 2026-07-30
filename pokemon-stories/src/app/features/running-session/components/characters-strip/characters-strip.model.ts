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