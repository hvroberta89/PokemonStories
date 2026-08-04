import { Injectable, signal } from '@angular/core';

export type AiAssistantTone = 'playful' | 'mysterious' | 'calm';
export type AiProvider = 'openai' | 'anthropic';

export interface AiAssistantSettings {
  readonly enabled: boolean;
  readonly name: string;
  readonly tone: AiAssistantTone;
  readonly proactive: boolean;
  readonly guidance: string;
  readonly provider: AiProvider;
  readonly model: string;
}

const defaultSettings: AiAssistantSettings = {
  enabled: true,
  name: 'Kalandsegítő',
  tone: 'playful',
  proactive: true,
  guidance: '',
  provider: 'openai',
  model: 'gpt-4.1-mini',
};

@Injectable({ providedIn: 'root' })
export class AiAssistantSettingsStore {
  private readonly storageKey = 'pokemon-stories.ai-assistant-settings';
  private readonly settingsState = signal<AiAssistantSettings>(this.load());
  private readonly apiKeyState = signal('');
  private readonly hasApiKeyState = signal(false);

  readonly settings = this.settingsState.asReadonly();
  readonly hasApiKey = this.hasApiKeyState.asReadonly();

  save(settings: AiAssistantSettings): void {
    const next = {
      ...settings,
      name: settings.name.trim().slice(0, 60) || defaultSettings.name,
      guidance: settings.guidance.trim().slice(0, 500),
    };
    this.settingsState.set(next);
    globalThis.localStorage?.setItem(this.storageKey, JSON.stringify(next));
  }

  setApiKey(apiKey: string): void {
    this.apiKeyState.set(apiKey.trim());
    this.hasApiKeyState.set(apiKey.trim().length > 0);
  }

  clearApiKey(): void {
    this.apiKeyState.set('');
    this.hasApiKeyState.set(false);
  }

  requestConfiguration(): { readonly provider: AiProvider; readonly model: string; readonly apiKey: string } {
    const settings = this.settingsState();
    return { provider: settings.provider, model: settings.model, apiKey: this.apiKeyState() };
  }

  private load(): AiAssistantSettings {
    try {
      const stored = JSON.parse(globalThis.localStorage?.getItem(this.storageKey) ?? 'null') as Partial<AiAssistantSettings> | null;
      if (!stored || typeof stored !== 'object') return defaultSettings;
      return {
        enabled: typeof stored.enabled === 'boolean' ? stored.enabled : defaultSettings.enabled,
        name: typeof stored.name === 'string' ? stored.name : defaultSettings.name,
        tone: isTone(stored.tone) ? stored.tone : defaultSettings.tone,
        proactive: typeof stored.proactive === 'boolean' ? stored.proactive : defaultSettings.proactive,
        guidance: typeof stored.guidance === 'string' ? stored.guidance : defaultSettings.guidance,
        provider: isProvider(stored.provider) ? stored.provider : defaultSettings.provider,
        model: typeof stored.model === 'string' && stored.model.trim() ? stored.model : defaultSettings.model,
      };
    } catch {
      return defaultSettings;
    }
  }
}

function isTone(value: unknown): value is AiAssistantTone {
  return value === 'playful' || value === 'mysterious' || value === 'calm';
}

function isProvider(value: unknown): value is AiProvider {
  return value === 'openai' || value === 'anthropic';
}