import { TestBed } from '@angular/core/testing';

import {
  PROJECT_READER,
  PROJECT_REPOSITORY,
} from '../../../application/project/tokens/project.tokens';
import { InMemoryProjectRepository } from '../../../infrastructure/project/repositories/in-memory-project.repository';
import { SequentialIdGenerator } from '../../../infrastructure/shared/identifiers/sequential-id.generator';
import { ProjectsStore } from './projects.store';
import { ID_GENERATOR } from '../../../application/project/tokens/id-generator.token';
import { projectId } from '../../../domain/project/value-objects/project-id';

describe('ProjectsStore', () => {
  let repository: InMemoryProjectRepository;
  let store: ProjectsStore;

  beforeEach(() => {
    repository = new InMemoryProjectRepository();

    TestBed.configureTestingModule({
      providers: [
        ProjectsStore,
        {
          provide: PROJECT_REPOSITORY,
          useValue: repository,
        },
        {
          provide: PROJECT_READER,
          useValue: repository,
        },
        {
          provide: ID_GENERATOR,
          useValue: new SequentialIdGenerator('project'),
        },
      ],
    });

    store = TestBed.inject(ProjectsStore);
  });

  it('should start with an empty idle state', () => {
    expect(store.projects()).toEqual([]);
    expect(store.loadingStatus()).toBe('idle');
    expect(store.isLoading()).toBe(false);
    expect(store.hasProjects()).toBe(false);
    expect(store.creating()).toBe(false);
    expect(store.errorMessage()).toBeUndefined();
  });

  it('should load projects', async () => {
    await store.create({
      name: 'Kanto kalandok',
    });

    expect(store.projects().length).toBe(1);
    expect(store.projects()[0].name).toBe('Kanto kalandok');
    expect(store.loadingStatus()).toBe('loaded');
    expect(store.hasProjects()).toBe(true);
  });

  it('should create a project', async () => {
    const success = await store.create({
      name: 'Pokémon kalandok',
      description: 'Közös történetek a gyerekekkel.',
    });

    expect(success).toBe(true);
    expect(store.creating()).toBe(false);
    expect(store.projects()).toEqual([
      {
        id: 'project-1',
        name: 'Pokémon kalandok',
        description: 'Közös történetek a gyerekekkel.',
        status: 'active',
      },
    ]);
  });

  it('should expose an error for an invalid project', async () => {
    const success = await store.create({
      name: '   ',
    });

    expect(success).toBe(false);
    expect(store.projects()).toEqual([]);
    expect(store.errorMessage()).toBe('A projekt neve nem lehet üres.');
  });

  it('should allow duplicate project names', async () => {
    await store.create({
      name: 'Kanto kalandok',
    });

    const success = await store.create({
      name: 'KANTO KALANDOK',
    });

    expect(success).toBe(true);
    expect(store.projects().length).toBe(2);
    expect(store.errorMessage()).toBeUndefined();
  });

  it('should clear the current error', async () => {
    await store.create({
      name: '   ',
    });

    store.clearError();

    expect(store.errorMessage()).toBeUndefined();
  });

  it('lists and restores an archived Project', async () => {
    await store.create({ name: 'Kanto kalandok' });
    const project = await repository.findById(projectId('project-1'));
    if (!project) throw new Error('Project should exist.');
    await repository.save(project.archive());

    await store.load();
    expect(store.projects()).toEqual([]);
    expect(store.archivedProjects().map((item) => item.id)).toEqual(['project-1']);

    await store.restore('project-1');
    expect(store.archivedProjects()).toEqual([]);
    expect(store.projects().map((item) => item.id)).toEqual(['project-1']);
  });
});
