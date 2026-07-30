import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';

import { ProjectsStore } from '../../store/projects.store';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  templateUrl: './projects-page.component.html',
  styleUrl: './projects-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProjectsStore],
})
export class ProjectsPageComponent implements OnInit {
  protected readonly store = inject(ProjectsStore);

  ngOnInit(): void {
    void this.store.load();
  }
}