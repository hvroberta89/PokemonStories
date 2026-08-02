import { projectId } from '../value-objects/project-id';
import { CreateProjectProps, Project } from './project';

describe('Project', () => {
  it('should create an active project', () => {
    const result = createProject();

    expect(result.isSuccess).toBe(true);

    if (result.isSuccess) {
      expect(result.value.id).toBe('project-1');
      expect(result.value.name).toBe('Pokémon kalandok a gyerekekkel');
      expect(result.value.description).toBe('Közös Pokémon történetek és kalandok.');
      expect(result.value.status).toBe('active');
    }
  });

  it('should trim the name and description', () => {
    const result = createProject({
      name: '  Kanto kezdő kampány  ',
      description: '  Első kalandjaink Kanto világában.  ',
    });

    expect(result.isSuccess).toBe(true);

    if (result.isSuccess) {
      expect(result.value.name).toBe('Kanto kezdő kampány');
      expect(result.value.description).toBe('Első kalandjaink Kanto világában.');
    }
  });

  it('should allow a missing description', () => {
    const result = createProject({
      description: undefined,
    });

    expect(result.isSuccess).toBe(true);

    if (result.isSuccess) {
      expect(result.value.description).toBeUndefined();
    }
  });

  it('should normalize an empty description to undefined', () => {
    const result = createProject({
      description: '   ',
    });

    expect(result.isSuccess).toBe(true);

    if (result.isSuccess) {
      expect(result.value.description).toBeUndefined();
    }
  });

  it('should reject an empty name', () => {
    const result = createProject({
      name: '   ',
    });

    expect(result.isSuccess).toBe(false);

    if (!result.isSuccess) {
      expect(result.error.code).toBe('INVALID_PROJECT');
      expect(result.error.message).toContain('name cannot be empty');
    }
  });

  it('should reject a name longer than 80 characters', () => {
    const result = createProject({
      name: 'a'.repeat(81),
    });

    expect(result.isSuccess).toBe(false);
  });

  it('should reject a description longer than 500 characters', () => {
    const result = createProject({
      description: 'a'.repeat(501),
    });

    expect(result.isSuccess).toBe(false);
  });

  it('should create an immutable project', () => {
    const result = createProject();

    expect(result.isSuccess).toBe(true);

    if (result.isSuccess) {
      expect(Object.isFrozen(result.value)).toBe(true);
    }
  });
});

function createProject(overrides: Partial<CreateProjectProps> = {}) {
  return Project.create({
    id: projectId('project-1'),
    name: 'Pokémon kalandok a gyerekekkel',
    description: 'Közös Pokémon történetek és kalandok.',
    ...overrides,
  });
}
