import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AudienceAgePresetId } from '../../../../domain/audience/presets/audience-age-preset';
import { audienceAgePresets } from '../../../../domain/audience/presets/audience-age-presets';
import { projectId } from '../../../../domain/project/value-objects/project-id';
import { PsIconComponent } from '../../../../shared/ui/icon/ps-icon.component';
import { PsVoiceInputDirective } from '../../../../shared/ui/voice-input/ps-voice-input.directive';
import { CreateAdventureStore } from '../../store/create-adventure.store';

const oaksParcelTemplate = {
  title: 'Oak csomagja - kezdő kalandvázlat',
  premise: 'Kezdő Trainerek egy professzor megbízásából elhoznak egy fontos csomagot a szomszédos városból. Az út során vad Pokémonokkal találkoznak, kipróbálják a befogást, majd egy tolvajcsapat fenyegetése próbára teszi az együttműködésüket.',
  sessionLengthMinutes: 120,
} as const;

@Component({
  selector: 'app-create-adventure-page',
  standalone: true,
  imports: [RouterLink, PsIconComponent, PsVoiceInputDirective],
  templateUrl: './create-adventure-page.component.html',
  styleUrl: './create-adventure-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CreateAdventureStore],
})
export class CreateAdventurePageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly store = inject(CreateAdventureStore);
  protected readonly projectId = projectId(this.route.snapshot.paramMap.get('projectId') ?? '');
  protected readonly audiencePresets = audienceAgePresets;
  protected readonly title = signal('');
  protected readonly premise = signal('');
  protected readonly audiencePresetId = signal<AudienceAgePresetId>('children');
  protected readonly sessionLengthMinutes = signal(60);
  protected readonly submitted = signal(false);
  protected readonly titleError = computed(() =>
    this.submitted() && !this.title().trim() ? 'Adj címet a kalandnak.' : null,
  );
  protected readonly premiseError = computed(() =>
    this.submitted() && !this.premise().trim() ? 'Írd le röviden a kaland alapötletét.' : null,
  );

  protected updateText(field: 'title' | 'premise', event: Event): void {
    const value = (event.target as HTMLInputElement | HTMLTextAreaElement).value;
    field === 'title' ? this.title.set(value) : this.premise.set(value);
    this.store.clearError();
  }

  protected updateAudience(event: Event): void {
    this.audiencePresetId.set((event.target as HTMLSelectElement).value as AudienceAgePresetId);
  }

  protected applyOaksParcelTemplate(): void {
    this.title.set(oaksParcelTemplate.title);
    this.premise.set(oaksParcelTemplate.premise);
    this.sessionLengthMinutes.set(oaksParcelTemplate.sessionLengthMinutes);
    this.submitted.set(false);
    this.store.clearError();
  }

  protected updateLength(event: Event): void {
    this.sessionLengthMinutes.set(Number((event.target as HTMLSelectElement).value));
  }

  protected async submit(): Promise<void> {
    this.submitted.set(true);
    if (this.titleError() || this.premiseError()) return;

    const success = await this.store.create({
      projectId: this.projectId,
      title: this.title(),
      premise: this.premise(),
      audiencePresetId: this.audiencePresetId(),
      sessionLengthMinutes: this.sessionLengthMinutes(),
    });

    if (success) {
      await this.router.navigate([
        '/projects',
        this.projectId,
        'adventures',
        this.store.createdAdventureId(),
        'design',
      ]);
    }
  }
}
