import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { AudienceAgePresetId } from '../../../../domain/audience/presets/audience-age-preset';
import { audienceAgePresets } from '../../../../domain/audience/presets/audience-age-presets';
import { adventurePlanId } from '../../../../domain/adventure/value-objects/adventure-plan-id';
import { projectId } from '../../../../domain/project/value-objects/project-id';
import { PsIconComponent } from '../../../../shared/ui/icon/ps-icon.component';
import { AdventureDesignerStore } from '../../store/adventure-designer.store';

@Component({
  selector: 'app-adventure-designer-page',
  standalone: true,
  imports: [RouterLink, PsIconComponent],
  templateUrl: './adventure-designer-page.component.html',
  styleUrl: './adventure-designer-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AdventureDesignerStore],
})
export class AdventureDesignerPageComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly store = inject(AdventureDesignerStore);
  protected readonly projectId = projectId(this.route.snapshot.paramMap.get('projectId') ?? '');
  protected readonly adventureId = adventurePlanId(
    this.route.snapshot.paramMap.get('adventureId') ?? '',
  );
  protected readonly audiencePresets = audienceAgePresets;
  protected readonly title = signal('');
  protected readonly premise = signal('');
  protected readonly audiencePresetId = signal<AudienceAgePresetId>('children');
  protected readonly sessionLengthMinutes = signal(60);
  protected readonly submitted = signal(false);

  constructor() {
    void this.load();
  }

  protected updateText(field: 'title' | 'premise', event: Event): void {
    const value = (event.target as HTMLInputElement | HTMLTextAreaElement).value;
    field === 'title' ? this.title.set(value) : this.premise.set(value);
  }

  protected updateAudience(event: Event): void {
    this.audiencePresetId.set((event.target as HTMLSelectElement).value as AudienceAgePresetId);
  }

  protected updateLength(event: Event): void {
    this.sessionLengthMinutes.set(Number((event.target as HTMLSelectElement).value));
  }

  protected async save(): Promise<void> {
    this.submitted.set(true);
    if (!this.title().trim() || !this.premise().trim()) return;
    await this.store.saveFoundation(this.projectId, this.adventureId, {
      title: this.title(),
      premise: this.premise(),
      audiencePresetId: this.audiencePresetId(),
      sessionLengthMinutes: this.sessionLengthMinutes(),
    });
  }

  private async load(): Promise<void> {
    await this.store.load(this.projectId, this.adventureId);
    const adventure = this.store.adventure();
    if (!adventure) return;
    this.title.set(adventure.title);
    this.premise.set(adventure.premise);
    this.sessionLengthMinutes.set(adventure.audienceProfile.sessionLengthMinutes);
    const preset = audienceAgePresets.find((item) =>
      item.ageRange.equals(adventure.audienceProfile.ageRange),
    );
    if (preset) this.audiencePresetId.set(preset.id);
  }
}
