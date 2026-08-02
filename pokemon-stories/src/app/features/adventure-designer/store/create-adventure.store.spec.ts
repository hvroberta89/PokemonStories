import { TestBed } from '@angular/core/testing';

import { ADVENTURE_PLAN_REPOSITORY } from '../../../application/adventure/tokens/adventure-plan.tokens';
import { ID_GENERATOR } from '../../../application/project/tokens/id-generator.token';
import { PROJECT_REPOSITORY } from '../../../application/project/tokens/project.tokens';
import { Project } from '../../../domain/project/models/project';
import { projectId } from '../../../domain/project/value-objects/project-id';
import { InMemoryAdventurePlanRepository } from '../../../infrastructure/adventure/repositories/in-memory-adventure-plan.repository';
import { InMemoryProjectRepository } from '../../../infrastructure/project/repositories/in-memory-project.repository';
import { FixedIdGenerator } from '../../../infrastructure/shared/identifiers/fixed-id.generator';
import { CreateAdventureStore } from './create-adventure.store';

describe('CreateAdventureStore', () => {
  let projects: InMemoryProjectRepository;
  let adventures: InMemoryAdventurePlanRepository;
  let store: CreateAdventureStore;

  beforeEach(async () => {
    projects = new InMemoryProjectRepository();
    adventures = new InMemoryAdventurePlanRepository();
    const projectResult = Project.create({
      id: projectId('project-1'),
      name: 'Kanto kalandok',
    });
    if (!projectResult.isSuccess) throw projectResult.error;
    await projects.save(projectResult.value);

    TestBed.configureTestingModule({
      providers: [
        CreateAdventureStore,
        { provide: PROJECT_REPOSITORY, useValue: projects },
        { provide: ADVENTURE_PLAN_REPOSITORY, useValue: adventures },
        {
          provide: ID_GENERATOR,
          useValue: new FixedIdGenerator('adventure-1'),
        },
      ],
    });
    store = TestBed.inject(CreateAdventureStore);
  });

  it('should create a draft adventure in the selected project', async () => {
    const success = await store.create({
      projectId: projectId('project-1'),
      title: 'Az elveszett tojás',
      premise: 'Különös lábnyomok vezetnek az erdő felé.',
      audiencePresetId: 'children',
      sessionLengthMinutes: 60,
    });

    expect(success).toBe(true);
    expect(adventures.getAll()).toHaveLength(1);
    expect(adventures.getAll()[0].status).toBe('draft');
    expect(adventures.getAll()[0].audienceProfile.ageRange.minimum).toBe(7);
  });

  it('should preserve a meaningful error when the project is missing', async () => {
    const success = await store.create({
      projectId: projectId('missing'),
      title: 'Az elveszett tojás',
      premise: 'Különös lábnyomok vezetnek az erdő felé.',
      audiencePresetId: 'children',
      sessionLengthMinutes: 60,
    });

    expect(success).toBe(false);
    expect(store.errorMessage()).toBe('Ez a projekt már nem érhető el.');
  });
});
