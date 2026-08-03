export type LibrarySection = 'pokemon' | 'moves' | 'abilities' | 'items' | 'tms';
export type LibraryView = LibrarySection | 'favorites' | 'recent';
export type LibraryLocale = 'en' | 'hu';

export interface LibraryReference {
  readonly key: string;
  readonly section: LibrarySection;
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly artworkPath?: string;
  readonly tags: readonly string[];
  readonly detailRows: readonly { readonly label: string; readonly value: string }[];
}