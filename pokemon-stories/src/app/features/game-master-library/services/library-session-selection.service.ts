import { Injectable, signal } from '@angular/core';
import { LibraryReference } from '../models/library-reference.model';

export type SessionPokemonRole = 'friendly' | 'wild' | 'enemy' | 'companion';
export interface SessionLibrarySelection { readonly reference: LibraryReference; readonly role: SessionPokemonRole; }

@Injectable({ providedIn: 'root' })
export class LibrarySessionSelectionService {
  private readonly state = signal<SessionLibrarySelection | null>(null);
  select(value: SessionLibrarySelection): void { this.state.set(value); }
  consume(): SessionLibrarySelection | null { const value = this.state(); this.state.set(null); return value; }
}