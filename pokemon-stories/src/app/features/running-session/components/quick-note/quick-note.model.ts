export type QuickNoteType =
  | 'general'
  | 'clue'
  | 'npc'
  | 'secret';

export interface QuickNoteDraft {
  readonly type: QuickNoteType;
  readonly content: string;
  readonly referenceId?: string;
  readonly referenceSection?: import('../../../game-master-library/models/library-reference.model').LibrarySection;
  readonly referenceName?: string;
}