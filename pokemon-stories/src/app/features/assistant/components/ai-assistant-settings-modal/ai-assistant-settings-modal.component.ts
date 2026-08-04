import { ChangeDetectionStrategy, Component, HostListener, inject, output, signal } from '@angular/core';

import { AiAssistantSettingsStore, type AiAssistantTone, type AiProvider } from '../../services/ai-assistant-settings.store';
import { PsIconComponent } from '../../../../shared/ui/icon/ps-icon.component';

@Component({
  selector: 'app-ai-assistant-settings-modal',
  standalone: true,
  imports: [PsIconComponent],
  templateUrl: './ai-assistant-settings-modal.component.html',
  styleUrl: './ai-assistant-settings-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiAssistantSettingsModalComponent {
  private readonly settingsStore = inject(AiAssistantSettingsStore);
  private readonly settings = this.settingsStore.settings();

  readonly closed = output<void>();
  readonly enabled = signal(this.settings.enabled);
  readonly name = signal(this.settings.name);
  readonly tone = signal<AiAssistantTone>(this.settings.tone);
  readonly proactive = signal(this.settings.proactive);
  readonly guidance = signal(this.settings.guidance);
  readonly provider = signal<AiProvider>(this.settings.provider);
  readonly model = signal(this.settings.model);
  readonly apiKey = signal('');
  readonly saved = signal(false);

  @HostListener('document:keydown.escape')
  protected closeOnEscape(): void {
    this.closed.emit();
  }

  protected save(): void {
    this.settingsStore.save({
      enabled: this.enabled(),
      name: this.name(),
      tone: this.tone(),
      proactive: this.proactive(),
      guidance: this.guidance(),
      provider: this.provider(),
      model: this.model(),
    });
    this.settingsStore.setApiKey(this.apiKey());
    this.saved.set(true);
  }

  protected setTone(event: Event): void {
    this.tone.set((event.target as HTMLSelectElement).value as AiAssistantTone);
  }

  protected setProvider(event: Event): void {
    const provider = (event.target as HTMLSelectElement).value as AiProvider;
    this.provider.set(provider);
    this.model.set(defaultModelFor(provider));
  }
}

function defaultModelFor(provider: AiProvider): string {
  return {
    openai: 'gpt-4.1-mini',
    anthropic: 'claude-3-5-haiku-latest',
    google: 'gemini-2.0-flash',
    mistral: 'mistral-small-latest',
    groq: 'llama-3.3-70b-versatile',
    openrouter: 'google/gemini-2.0-flash-001',
    together: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
    perplexity: 'sonar',
  }[provider];
}