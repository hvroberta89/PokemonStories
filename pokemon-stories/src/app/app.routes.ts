import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'projects',
    loadComponent: () =>
      import(
        './features/projects/pages/projects-page/projects-page.component'
      ).then(module => module.ProjectsPageComponent),
  },
  {
    path: 'running-session',
    loadComponent: () =>
      import(
        './features/running-session/pages/running-session-page/running-session-page.component'
      ).then(module => module.RunningSessionPageComponent),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'running-session',
  },
  {
    path: '**',
    redirectTo: 'running-session',
  },
];
