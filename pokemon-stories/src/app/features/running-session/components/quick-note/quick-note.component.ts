import {
  ChangeDetectionStrategy,
  Component,
  signal,
  output,
} from '@angular/core';
import {
  FormsModule,
} from '@angular/forms';

import {
  PsIconComponent,
} from '../../../../shared/ui/icon/ps-icon.component';
import {
  QuickNoteDraft,
  QuickNoteType,
} from './quick-note.model';

@Component({
  selector: 'app-quick-note',
  standalone: true,
  imports: [
    FormsModule,
    PsIconComponent,
  ],
  templateUrl:
    './quick-note.component.html',
  styleUrl:
    './quick-note.component.scss',
  changeDetection:
    ChangeDetectionStrategy.OnPush,
})
export class QuickNoteComponent {
  readonly saved =
    output<QuickNoteDraft>();

  readonly dismissed =
    output<void>();

  protected readonly selectedType =
    signal<QuickNoteType>('general');

  protected readonly content =
    signal('');

  protected readonly noteTypes:
    readonly {
      type: QuickNoteType;
      label: string;
    }[] = [
      {
        type: 'general',
        label: 'Általános',
      },
      {
        type: 'clue',
        label: 'Nyom',
      },
      {
        type: 'npc',
        label: 'Szereplő',
      },
      {
        type: 'secret',
        label: 'Titok',
      },
    ];

  protected selectType(
    type: QuickNoteType,
  ): void {
    this.selectedType.set(type);
  }

  protected updateContent(
    value: string,
  ): void {
    this.content.set(value);
  }

  protected save(): void {
    const content =
      this.content().trim();

    if (!content) {
      return;
    }

    this.saved.emit({
      type: this.selectedType(),
      content,
    });
  }

  protected dismiss(): void {
    this.dismissed.emit();
  }
}