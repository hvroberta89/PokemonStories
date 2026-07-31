export type QuickDockAction =
  | 'notes'
  | 'rewards'
  | 'assistant'
  | 'inventory';

export interface QuickDockItemViewModel {
  readonly action: QuickDockAction;
  readonly label: string;
  readonly icon: string;
  readonly badge?: number;
  readonly active?: boolean;
}

export interface QuickDockViewModel {
  readonly quickActionLabel: string;
  readonly items: readonly QuickDockItemViewModel[];
}