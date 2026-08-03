import { Injectable, signal } from '@angular/core';
import { LibraryReference } from '../models/library-reference.model';

@Injectable({ providedIn: 'root' })
export class LibraryAdventureSelectionService {
  private readonly selectionState = signal<LibraryReference | null>(null);
  select(reference: LibraryReference): void { this.selectionState.set(reference); }
  consume(): LibraryReference | null { const reference = this.selectionState(); this.selectionState.set(null); return reference; }
}