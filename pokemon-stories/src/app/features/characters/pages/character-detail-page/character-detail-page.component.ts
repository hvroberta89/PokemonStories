import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { characterId } from '../../../../domain/character/value-objects/character-id';
import { projectId } from '../../../../domain/project/value-objects/project-id';
import { PsIconComponent } from '../../../../shared/ui/icon/ps-icon.component';
import { PsVoiceInputDirective } from '../../../../shared/ui/voice-input/ps-voice-input.directive';
import { CharacterDetailStore } from '../../store/character-detail.store';
import type { RewardType } from '../../../../domain/reward/models/reward-grant';
import type { PsIconName } from '../../../../shared/ui/icon/ps-icon.registry';

@Component({
  selector: 'app-character-detail-page',
  standalone: true,
  imports: [RouterLink, PsIconComponent, PsVoiceInputDirective],
  templateUrl: './character-detail-page.component.html',
  styleUrl: './character-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CharacterDetailStore],
})
export class CharacterDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly projectId = projectId(this.route.snapshot.paramMap.get('projectId') ?? '');
  protected readonly characterId = characterId(
    this.route.snapshot.paramMap.get('characterId') ?? '',
  );
  protected readonly store = inject(CharacterDetailStore);
  protected readonly editing = signal(false);
  protected readonly archiveConfirmOpen = signal(false);
  protected readonly name = signal('');
  protected readonly description = signal('');
  protected readonly personalityNotes = signal('');
  protected readonly goals = signal('');
  protected readonly storyNotes = signal('');
  protected readonly submitted = signal(false);

  constructor() {
    void this.load();
  }

  protected initials(value: string): string {
    return value
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toLocaleUpperCase('hu');
  }

  protected rewardIcon(type: RewardType): PsIconName {
    switch (type) {
      case 'pokemon': return 'pokemon-sticker';
      case 'badge': return 'badge-medal';
      case 'outfit': return 'clothing-shirt';
      case 'achievement': return 'achievement-star';
      case 'quest-item': return 'quest-card';
      case 'card': return 'npc-card';
      case 'narrative': return 'timeline-scroll';
      default: return 'items-potion';
    }
  }

  protected update(
    field: 'name' | 'description' | 'personalityNotes' | 'goals' | 'storyNotes',
    event: Event,
  ): void {
    const value = (event.target as HTMLInputElement | HTMLTextAreaElement).value;
    ({
      name: this.name,
      description: this.description,
      personalityNotes: this.personalityNotes,
      goals: this.goals,
      storyNotes: this.storyNotes,
    })[field].set(value);
  }

  protected async save(): Promise<void> {
    this.submitted.set(true);
    if (!this.name().trim()) return;
    if (
      await this.store.save(this.projectId, this.characterId, {
        name: this.name(),
        description: this.description(),
        personalityNotes: this.personalityNotes(),
        goals: this.goals(),
        storyNotes: this.storyNotes(),
      })
    )
      this.editing.set(false);
  }

  protected async toggleArchive(): Promise<void> {
    if (await this.store.toggleArchive(this.projectId, this.characterId)) {
      this.archiveConfirmOpen.set(false);
    }
  }

  private async load(): Promise<void> {
    await this.store.load(this.projectId, this.characterId);
    const character = this.store.character();
    if (!character) return;
    this.name.set(character.name);
    this.description.set(character.description ?? '');
    this.personalityNotes.set(character.personalityNotes ?? '');
    this.goals.set(character.goals ?? '');
    this.storyNotes.set(character.storyNotes ?? '');
  }
}
