import { projectId } from '../../project/value-objects/project-id';
import { characterId } from '../value-objects/character-id';
import { Character } from './character';

describe('Character', () => {
  it('normalizes a valid project character', () => {
    const result = Character.create({
      id: characterId('character-1'),
      projectId: projectId('project-1'),
      name: '  Emma  ',
      description: '  Kíváncsi felfedező.  ',
    });

    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.name).toBe('Emma');
      expect(result.value.description).toBe('Kíváncsi felfedező.');
      expect(result.value.status).toBe('active');
    }
  });

  it('requires a name', () => {
    const result = Character.create({
      id: characterId('character-1'),
      projectId: projectId('project-1'),
      name: ' ',
    });

    expect(result.isSuccess).toBe(false);
  });

  it('updates story fields and preserves them while archiving', () => {
    const created = Character.create({
      id: characterId('character-1'),
      projectId: projectId('project-1'),
      name: 'Emma',
    });
    if (!created.isSuccess) throw created.error;
    const updated = created.value.update({
      name: 'Emma',
      personalityNotes: 'Kíváncsi és bátor.',
      goals: 'Szeretné megtalálni az elveszett tojást.',
      storyNotes: 'Fél a sötét barlangoktól.',
    });
    if (!updated.isSuccess) throw updated.error;

    const archived = updated.value.archive();

    expect(archived.status).toBe('archived');
    expect(archived.goals).toContain('tojást');
    expect(archived.restore().status).toBe('active');
  });

  it('restores a persisted archived character', () => {
    const result = Character.restore({
      id: characterId('character-1'),
      projectId: projectId('project-1'),
      name: 'Emma',
      personalityNotes: 'Kíváncsi és bátor.',
      goals: 'Pokémon-kutató szeretne lenni.',
      status: 'archived',
    });

    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.status).toBe('archived');
      expect(result.value.personalityNotes).toContain('bátor');
    }
  });
});
