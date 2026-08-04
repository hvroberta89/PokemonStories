import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AiAssistantSettingsStore } from './features/assistant/services/ai-assistant-settings.store';
import { AiAssistantSettingsModalComponent } from './features/assistant/components/ai-assistant-settings-modal/ai-assistant-settings-modal.component';
import { PsIconButtonComponent } from './shared/ui/icon-button/ps-icon-button.component';
import { AuthStore } from './features/auth/services/auth.store';
import { AppFeedbackToastComponent } from './shared/ui/feedback-toast/app-feedback-toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PsIconButtonComponent, AiAssistantSettingsModalComponent, AppFeedbackToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly assistantSettings = inject(AiAssistantSettingsStore);
  protected readonly auth = inject(AuthStore);
  protected readonly settingsOpen = signal(false);

  constructor() {
    effect(() => {
      if (!this.auth.isAuthenticated()) {
        this.settingsOpen.set(false);
      }
    });
  }
}
