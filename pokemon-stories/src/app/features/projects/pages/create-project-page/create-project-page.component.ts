import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { PsIconComponent } from '../../../../shared/ui/icon/ps-icon.component';
import { ProjectsStore } from '../../store/projects.store';

@Component({
  selector: 'app-create-project-page',
  standalone: true,
  imports: [PsIconComponent, RouterLink],
  templateUrl: './create-project-page.component.html',
  styleUrl: './create-project-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProjectsStore],
})
export class CreateProjectPageComponent {
  private readonly router = inject(Router);

  protected readonly store = inject(ProjectsStore);
  protected readonly name = signal('');
  protected readonly description = signal('');
  protected readonly submitted = signal(false);

  protected readonly nameError = computed(() => {
    if (!this.submitted()) {
      return undefined;
    }

    const normalizedName = this.name().trim();

    if (normalizedName.length === 0) {
      return 'Adj nevet a projektnek.';
    }

    if (normalizedName.length > 80) {
      return 'A projekt neve legfeljebb 80 karakter lehet.';
    }

    return undefined;
  });

  protected updateName(event: Event): void {
    this.name.set(this.getInputValue(event));
    this.store.clearError();
  }

  protected updateDescription(event: Event): void {
    this.description.set(this.getInputValue(event));
    this.store.clearError();
  }

  protected async createProject(): Promise<void> {
    this.submitted.set(true);

    if (this.nameError() || this.store.creating()) {
      return;
    }

    const success = await this.store.create({
      name: this.name(),
      description: this.description(),
    });

    if (success) {
      await this.router.navigate(['/projects']);
    }
  }

  private getInputValue(event: Event): string {
    return (event.target as HTMLInputElement | HTMLTextAreaElement).value;
  }
}
