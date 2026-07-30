import { projectId } from './project-id';

describe('projectId', () => {
  it('should create a project identifier', () => {
    const id = projectId('project-1');

    expect(id).toBe('project-1');
  });

  it('should trim the identifier', () => {
    const id = projectId('  project-1  ');

    expect(id).toBe('project-1');
  });

  it('should reject an empty identifier', () => {
    expect(() => projectId('   ')).toThrowError(
      'ProjectId cannot be empty.',
    );
  });
});