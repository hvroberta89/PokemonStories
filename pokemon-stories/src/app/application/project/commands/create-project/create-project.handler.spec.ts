import { InMemoryProjectRepository } from '../../../../infrastructure/project/repositories/in-memory-project.repository';
import { FixedIdGenerator } from '../../../../infrastructure/shared/identifiers/fixed-id.generator';
import { CreateProjectHandler } from './create-project.handler';

describe('CreateProjectHandler', () => {
  let repository: InMemoryProjectRepository;
  let handler: CreateProjectHandler;

  beforeEach(() => {
    repository = new InMemoryProjectRepository();

    handler = new CreateProjectHandler(
      repository,
      new FixedIdGenerator('project-1'),
    );
  });

  it('should create and save a project', async () => {
    const result = await handler.execute({
      name: 'Pokémon kalandok',
      description: 'Közös történetek a gyerekekkel.',
    });

    expect(result.isSuccess).toBe(true);

    if (result.isSuccess) {
      expect(result.value.id).toBe('project-1');
      expect(result.value.name).toBe('Pokémon kalandok');
      expect(result.value.status).toBe('active');
    }

    expect(repository.getAll().length).toBe(1);
  });

  it('should create the project with a generated identifier', async () => {
    handler = new CreateProjectHandler(
      repository,
      new FixedIdGenerator('generated-project-id'),
    );

    const result = await handler.execute({
      name: 'Kanto kalandok',
    });

    expect(result.isSuccess).toBe(true);

    if (result.isSuccess) {
      expect(result.value.id).toBe('generated-project-id');
    }
  });

  it('should return a domain error for an invalid project', async () => {
    const result = await handler.execute({
      name: '   ',
    });

    expect(result.isSuccess).toBe(false);

    if (!result.isSuccess) {
      expect(result.error.code).toBe('INVALID_PROJECT');
    }

    expect(repository.getAll().length).toBe(0);
  });

  it('should reject a duplicate project name', async () => {
    const firstResult = await handler.execute({
      name: 'Kanto kalandok',
    });

    expect(firstResult.isSuccess).toBe(true);

    const secondResult = await handler.execute({
      name: 'Kanto kalandok',
    });

    expect(secondResult.isSuccess).toBe(false);

    if (!secondResult.isSuccess) {
      expect(secondResult.error.code).toBe(
        'PROJECT_NAME_ALREADY_EXISTS',
      );
    }

    expect(repository.getAll().length).toBe(1);
  });

  it('should treat names case-insensitively', async () => {
    await handler.execute({
      name: 'Kanto kalandok',
    });

    const result = await handler.execute({
      name: 'KANTO KALANDOK',
    });

    expect(result.isSuccess).toBe(false);

    if (!result.isSuccess) {
      expect(result.error.code).toBe(
        'PROJECT_NAME_ALREADY_EXISTS',
      );
    }
  });

  it('should ignore surrounding whitespace when checking names', async () => {
    await handler.execute({
      name: 'Kanto kalandok',
    });

    const result = await handler.execute({
      name: '  Kanto kalandok  ',
    });

    expect(result.isSuccess).toBe(false);
  });

  it('should not save a project when creation fails', async () => {
    const result = await handler.execute({
      name: 'a'.repeat(101),
    });

    expect(result.isSuccess).toBe(false);
    expect(repository.getAll().length).toBe(0);
  });
});