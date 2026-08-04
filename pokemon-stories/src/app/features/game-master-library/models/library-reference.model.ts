export type LibrarySection = 'pokemon' | 'moves' | 'abilities' | 'items' | 'tms' | 'origins' | 'types' | 'rules';
export type LibraryView = LibrarySection | 'favorites' | 'recent';
export type LibraryLocale = 'en' | 'hu';

export interface LibraryReference {
  readonly key: string;
  readonly section: LibrarySection;
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly artworkPath?: string;
  readonly sourceUrl?: string;
  readonly tags: readonly string[];
  readonly detailRows: readonly { readonly label: string; readonly value: string }[];
  readonly detailGroups: readonly LibraryDetailGroup[];
}

export interface LibraryDetailGroup {
  readonly title: string;
  readonly rows: readonly { readonly label: string; readonly value: string }[];
}