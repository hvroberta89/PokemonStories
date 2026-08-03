import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { projectId } from '../../../../domain/project/value-objects/project-id';
import { PsIconComponent } from '../../../../shared/ui/icon/ps-icon.component';
import { NpcListStore } from '../../store/npc-list.store';

@Component({
  selector: 'app-npc-list-page',
  standalone: true,
  imports: [RouterLink, PsIconComponent],
  templateUrl: './npc-list-page.component.html',
  styleUrl: './npc-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NpcListStore],
})
export class NpcListPageComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly projectId = projectId(this.route.snapshot.paramMap.get('projectId') ?? '');
  protected readonly store = inject(NpcListStore);
  protected readonly dialogOpen = signal(false);
  protected readonly name = signal('');
  protected readonly role = signal('');
  protected readonly description = signal('');

  constructor() {
    void this.store.load(this.projectId);
  }

  protected update(field: 'name' | 'role' | 'description', event: Event): void {
    const value = (event.target as HTMLInputElement | HTMLTextAreaElement).value;
    if (field === 'name') this.name.set(value);
    else if (field === 'role') this.role.set(value);
    else this.description.set(value);
  }

  protected async create(): Promise<void> {
    if (await this.store.create(this.projectId, this.name(), this.role(), this.description())) {
      this.dialogOpen.set(false);
      this.name.set('');
      this.role.set('');
      this.description.set('');
    }
  }
}
