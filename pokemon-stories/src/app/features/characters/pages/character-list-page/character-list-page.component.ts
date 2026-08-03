import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { projectId } from '../../../../domain/project/value-objects/project-id';
import type { Character } from '../../../../domain/character/models/character';
import { PsIconComponent } from '../../../../shared/ui/icon/ps-icon.component';
import { CharacterListStore } from '../../store/character-list.store';

@Component({
  selector: 'app-character-list-page',
  standalone: true,
  imports: [RouterLink, PsIconComponent],
  templateUrl: './character-list-page.component.html',
  styleUrl: './character-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CharacterListStore],
})
export class CharacterListPageComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly projectId = projectId(this.route.snapshot.paramMap.get('projectId') ?? '');
  protected readonly store = inject(CharacterListStore);
  protected readonly dialogOpen = signal(false);
  protected readonly name = signal('');
  protected readonly description = signal('');
  protected readonly submitted = signal(false);
  protected readonly characterToArchive = signal<Character | null>(null);

  constructor() {
    void this.store.load(this.projectId);
  }

  protected update(field: 'name' | 'description', event: Event): void {
    const value = (event.target as HTMLInputElement | HTMLTextAreaElement).value;
    field === 'name' ? this.name.set(value) : this.description.set(value);
  }

  protected async create(): Promise<void> {
    this.submitted.set(true);
    if (!this.name().trim()) return;
    if (await this.store.create(this.projectId, this.name(), this.description())) {
      this.dialogOpen.set(false);
      this.name.set('');
      this.description.set('');
      this.submitted.set(false);
    }
  }

  protected initials(name: string): string {
    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toLocaleUpperCase('hu');
  }

  protected async archiveCharacter(): Promise<void> {
    const character = this.characterToArchive();
    if (character && (await this.store.archive(character))) this.characterToArchive.set(null);
  }
}
