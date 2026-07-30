export type QuickDockAction =
  | 'characters'
  | 'notes'
  | 'dice'
  | 'settings';

export interface QuickDockItem {
  readonly action: QuickDockAction;
  readonly label: string;
  readonly icon: string;
}