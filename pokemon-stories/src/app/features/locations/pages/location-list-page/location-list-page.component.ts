import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import type { LocationType } from '../../../../domain/location/models/location';
import { projectId } from '../../../../domain/project/value-objects/project-id';
import { PsIconComponent } from '../../../../shared/ui/icon/ps-icon.component';
import { PsVoiceInputDirective } from '../../../../shared/ui/voice-input/ps-voice-input.directive';
import { LocationListStore } from '../../store/location-list.store';

@Component({
  selector: 'app-location-list-page',
  standalone: true,
  imports: [RouterLink, PsIconComponent, PsVoiceInputDirective],
  templateUrl: './location-list-page.component.html',
  styleUrl: './location-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LocationListStore],
})
export class LocationListPageComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly projectId = projectId(this.route.snapshot.paramMap.get('projectId') ?? '');
  protected readonly store = inject(LocationListStore);
  protected readonly dialogOpen = signal(false);
  protected readonly name = signal('');
  protected readonly description = signal('');
  protected readonly type = signal<LocationType>('custom');

  constructor() {
    void this.store.load(this.projectId);
  }

  protected update(field: 'name' | 'description', event: Event): void {
    const value = (event.target as HTMLInputElement | HTMLTextAreaElement).value;
    field === 'name' ? this.name.set(value) : this.description.set(value);
  }

  protected updateType(event: Event): void {
    this.type.set((event.target as HTMLSelectElement).value as LocationType);
  }

  protected async create(): Promise<void> {
    if (await this.store.create(this.projectId, this.name(), this.description(), this.type())) {
      this.dialogOpen.set(false);
      this.name.set('');
      this.description.set('');
      this.type.set('custom');
    }
  }
}
