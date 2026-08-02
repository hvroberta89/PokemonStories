import { Routes } from '@angular/router';
import { authenticatedGuard } from './features/auth/guards/authenticated.guard';
import { signedOutGuard } from './features/auth/guards/signed-out.guard';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [signedOutGuard],
    loadComponent: () =>
      import('./features/auth/pages/auth-page/auth-page.component').then(
        (module) => module.AuthPageComponent,
      ),
  },
  {
    path: 'projects',
    canActivate: [authenticatedGuard],
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
        path: ':projectId/characters/:characterId',
        loadComponent: () =>
          import('./features/characters/pages/character-detail-page/character-detail-page.component').then(
            (module) => module.CharacterDetailPageComponent,
          ),
      },
      {
        path: ':projectId/characters',
        loadComponent: () =>
          import('./features/characters/pages/character-list-page/character-list-page.component').then(
            (module) => module.CharacterListPageComponent,
          ),
      },
      {
        path: ':projectId/sessions/:sessionId',
        loadComponent: () =>
          import('./features/session-history/pages/session-detail-page/session-detail-page.component').then(
            (module) => module.SessionDetailPageComponent,
          ),
      },
      {
        path: ':projectId/sessions',
        loadComponent: () =>
          import('./features/session-history/pages/session-history-page/session-history-page.component').then(
            (module) => module.SessionHistoryPageComponent,
          ),
      },
      {
        path: ':projectId/adventures',
        loadComponent: () =>
          import('./features/adventures/pages/adventure-list-page/adventure-list-page.component').then(
            (module) => module.AdventureListPageComponent,
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
        path: ':projectId/adventures/:adventureId/design',
        loadComponent: () =>
          import('./features/adventure-designer/pages/adventure-designer-page/adventure-designer-page.component').then(
            (module) => module.AdventureDesignerPageComponent,
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
          import('./features/adventures/pages/adventure-overview-page/adventure-overview-page.component').then(
            (module) => module.AdventureOverviewPageComponent,
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
    canActivate: [authenticatedGuard],
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
