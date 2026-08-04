import { computed, inject, Injectable, signal } from '@angular/core';
import type { User } from '@supabase/supabase-js';

import { SUPABASE_CLIENT } from '../../../infrastructure/supabase/supabase-client.token';

export interface SignUpResult {
  readonly requiresEmailConfirmation: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly supabase = inject(SUPABASE_CLIENT);
  private readonly userState = signal<User | null>(null);
  private readonly loadingState = signal(true);

  readonly user = this.userState.asReadonly();
  readonly isLoading = this.loadingState.asReadonly();
  readonly isAuthenticated = computed(() => this.userState() !== null);
  readonly ready: Promise<void>;

  constructor() {
    this.ready = this.restoreSession();
    this.supabase.auth.onAuthStateChange((_event, session) => {
      this.updateSession(session);
    });
  }

  async signIn(email: string, password: string): Promise<void> {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw error;
    }
    this.updateSession(data.session);
  }

  async signUp(email: string, password: string): Promise<SignUpResult> {
    const { data, error } = await this.supabase.auth.signUp({ email, password });
    if (error) {
      throw error;
    }
    return { requiresEmailConfirmation: data.session === null };
  }

  async signOut(): Promise<void> {
    const { error } = await this.supabase.auth.signOut();
    if (error) {
      throw error;
    }
  }

  private async restoreSession(): Promise<void> {
    const { data, error } = await this.supabase.auth.getSession();
    if (error) {
      this.loadingState.set(false);
      throw error;
    }
    this.updateSession(data.session);
  }

  private updateSession(session: { user: User } | null): void {
    this.userState.set(session?.user ?? null);
    this.loadingState.set(false);
  }
}
