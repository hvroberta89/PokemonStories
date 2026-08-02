import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { PsIconComponent } from '../../../../shared/ui/icon/ps-icon.component';
import { AuthStore } from '../../services/auth.store';

type AuthMode = 'sign-in' | 'sign-up';

@Component({
  selector: 'app-auth-page',
  imports: [ReactiveFormsModule, PsIconComponent],
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthPageComponent {
  private readonly auth = inject(AuthStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly mode = signal<AuthMode>('sign-in');
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly confirmationEmail = signal<string | null>(null);
  readonly isSignUp = computed(() => this.mode() === 'sign-up');

  readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)],
    }),
  });

  setMode(mode: AuthMode): void {
    this.mode.set(mode);
    this.errorMessage.set(null);
    this.confirmationEmail.set(null);
  }

  async submit(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    const { email, password } = this.form.getRawValue();

    try {
      if (this.isSignUp()) {
        const result = await this.auth.signUp(email, password);
        if (result.requiresEmailConfirmation) {
          this.confirmationEmail.set(email);
          return;
        }
      } else {
        await this.auth.signIn(email, password);
      }

      await this.router.navigateByUrl(this.safeReturnUrl());
    } catch (error) {
      this.errorMessage.set(this.describeError(error));
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private safeReturnUrl(): string {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    return returnUrl?.startsWith('/') && !returnUrl.startsWith('//') ? returnUrl : '/projects';
  }

  private describeError(error: unknown): string {
    if (error instanceof Error && error.message.toLowerCase().includes('invalid login')) {
      return 'Az e-mail-cím vagy a jelszó nem megfelelő.';
    }
    if (error instanceof Error && error.message.toLowerCase().includes('already registered')) {
      return 'Ehhez az e-mail-címhez már tartozik fiók.';
    }
    return 'Most nem sikerült kapcsolódni. Kérlek, próbáld újra.';
  }
}
