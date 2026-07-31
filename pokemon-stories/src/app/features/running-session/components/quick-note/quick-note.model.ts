export type QuickNoteType =
  | 'general'
  | 'clue'
  | 'npc'
  | 'secret';

export interface QuickNoteDraft {
  readonly type: QuickNoteType;
  readonly content: string;
}