import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'projects',
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./features/projects/pages/projects-page/projects-page.component').then(
            (module) => module.ProjectsPageComponent,
          ),
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./features/projects/pages/create-project-page/create-project-page.component').then(
            (module) => module.CreateProjectPageComponent,
          ),
      },
      {
        path: ':projectId/adventures/new',
        loadComponent: () =>
          import('./features/adventure-designer/pages/create-adventure-page/create-adventure-page.component').then(
            (module) => module.CreateAdventurePageComponent,
          ),
      },
      {
        path: ':projectId/adventures/:adventureId/prepare',
        loadComponent: () =>
          import('./features/session-preparation/pages/session-preparation-page/session-preparation-page.component').then(
            (module) => module.SessionPreparationPageComponent,
          ),
      },
      {
        path: ':projectId/adventures/:adventureId',
        loadComponent: () =>
          import('./features/adventure-designer/pages/adventure-designer-page/adventure-designer-page.component').then(
            (module) => module.AdventureDesignerPageComponent,
          ),
      },
      {
        path: ':projectId',
        loadComponent: () =>
          import('./features/project-dashboard/pages/project-dashboard-page/project-dashboard-page.component').then(
            (module) => module.ProjectDashboardPageComponent,
          ),
      },
    ],
  },
  {
    path: 'running-session',
    loadComponent: () =>
      import('./features/running-session/pages/running-session-page/running-session-page.component').then(
        (module) => module.RunningSessionPageComponent,
      ),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'projects',
  },
  {
    path: '**',
    redirectTo: 'projects',
  },
];
