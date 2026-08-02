import { TestBed } from '@angular/core/testing';

import {
  CHARACTER_READER,
  CHARACTER_REPOSITORY,
} from '../../../application/character/tokens/character.tokens';
import { ID_GENERATOR } from '../../../application/project/tokens/id-generator.token';
import { PROJECT_READER } from '../../../application/project/tokens/project.tokens';
import { Project } from '../../../domain/project/models/project';
import { projectId } from '../../../domain/project/value-objects/project-id';
import { InMemoryCharacterRepository } from '../../../infrastructure/character/repositories/in-memory-character.repository';
import { InMemoryProjectRepository } from '../../../infrastructure/project/repositories/in-memory-project.repository';
import { FixedIdGenerator } from '../../../infrastructure/shared/identifiers/fixed-id.generator';
import { CharacterListStore } from './character-list.store';

describe('CharacterListStore', () => {
  it('creates and lists a character inside the project', async () => {
    const projects = new InMemoryProjectRepository();
    const characters = new InMemoryCharacterRepository();
    const project = Project.create({ id: projectId('project-1'), name: 'Kanto kalandok' });
    if (!project.isSuccess) throw project.error;
    await projects.save(project.value);
    TestBed.configureTestingModule({
      providers: [
        CharacterListStore,
        { provide: PROJECT_READER, useValue: projects },
        { provide: CHARACTER_READER, useValue: characters },
        { provide: CHARACTER_REPOSITORY, useValue: characters },
        { provide: ID_GENERATOR, useValue: new FixedIdGenerator('character-1') },
      ],
    });
    const store = TestBed.inject(CharacterListStore);

    await store.load(projectId('project-1'));
    const created = await store.create(projectId('project-1'), 'Emma', 'Kíváncsi felfedező.');

    expect(created).toBe(true);
    expect(store.characters()).toHaveLength(1);
    expect(store.characters()[0]?.name).toBe('Emma');
  });

  it('rejects duplicate names inside one project', async () => {
    const projects = new InMemoryProjectRepository();
    const characters = new InMemoryCharacterRepository();
    const project = Project.create({ id: projectId('project-1'), name: 'Kanto kalandok' });
    if (!project.isSuccess) throw project.error;
    await projects.save(project.value);
    TestBed.configureTestingModule({
      providers: [
        CharacterListStore,
        { provide: PROJECT_READER, useValue: projects },
        { provide: CHARACTER_READER, useValue: characters },
        { provide: CHARACTER_REPOSITORY, useValue: characters },
        { provide: ID_GENERATOR, useValue: new FixedIdGenerator('character-1') },
      ],
    });
    const store = TestBed.inject(CharacterListStore);

    expect(await store.create(projectId('project-1'), 'Emma', '')).toBe(true);
    expect(await store.create(projectId('project-1'), ' emma ', '')).toBe(false);
    expect(store.errorMessage()).toContain('ilyen nevű');
  });
});
