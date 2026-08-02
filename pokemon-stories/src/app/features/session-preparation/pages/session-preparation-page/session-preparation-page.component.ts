import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { adventurePlanId } from '../../../../domain/adventure/value-objects/adventure-plan-id';
import { projectId } from '../../../../domain/project/value-objects/project-id';
import { PsIconComponent } from '../../../../shared/ui/icon/ps-icon.component';
import { RunningSessionStore } from '../../../running-session/services/running-session.store';
import { SessionPreparationStore } from '../../store/session-preparation.store';
import { CharacterId } from '../../../../domain/character/value-objects/character-id';

@Component({
  selector: 'app-session-preparation-page',
  standalone: true,
  imports: [RouterLink, PsIconComponent],
  templateUrl: './session-preparation-page.component.html',
  styleUrl: './session-preparation-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SessionPreparationStore],
})
export class SessionPreparationPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly runningSession = inject(RunningSessionStore);
  protected readonly store = inject(SessionPreparationStore);
  protected readonly projectId = projectId(this.route.snapshot.paramMap.get('projectId') ?? '');
  protected readonly adventureId = adventurePlanId(
    this.route.snapshot.paramMap.get('adventureId') ?? '',
  );
  protected readonly narrativeReviewed = signal(false);
  protected readonly practicalsReviewed = signal(false);
  protected readonly selectedCharacterIds = signal<readonly CharacterId[]>([]);
  protected readonly rememberTeam = signal(true);
  protected readonly reviewCount = computed(
    () => Number(this.narrativeReviewed()) + Number(this.practicalsReviewed()),
  );
  protected readonly openingScene = computed(() => {
    const scenes = this.store.adventure()?.scenes ?? [];
    return scenes.find((scene) => scene.isOpening) ?? scenes[0];
  });
  protected readonly selectedCharacters = computed(() =>
    this.store
      .characters()
      .filter((character) => this.selectedCharacterIds().includes(character.id)),
  );

  constructor() {
    void this.load();
  }

  protected toggleNarrative(event: Event): void {
    this.narrativeReviewed.set((event.target as HTMLInputElement).checked);
  }

  protected togglePracticals(event: Event): void {
    this.practicalsReviewed.set((event.target as HTMLInputElement).checked);
  }

  protected retry(): void {
    void this.store.load(this.projectId, this.adventureId);
  }

  protected toggleCharacter(id: CharacterId): void {
    this.selectedCharacterIds.update((ids) =>
      ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id],
    );
  }

  protected async startSession(): Promise<void> {
    const adventure = this.store.adventure();
    if (!adventure) return;
    if (
      this.rememberTeam() &&
      !(await this.store.rememberTeam(
        this.projectId,
        this.adventureId,
        this.selectedCharacterIds(),
      ))
    ) {
      return;
    }
    this.runningSession.startFromAdventure(adventure, this.selectedCharacters());
    void this.router.navigate(['/running-session']);
  }

  protected initials(name: string): string {
    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toLocaleUpperCase('hu');
  }

  private async load(): Promise<void> {
    await this.store.load(this.projectId, this.adventureId);
    this.selectedCharacterIds.set(this.store.adventure()?.expectedCharacterIds ?? []);
  }
}
