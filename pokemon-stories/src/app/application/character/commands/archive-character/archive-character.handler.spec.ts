import { Character } from '../../../../domain/character/models/character';
import { characterId } from '../../../../domain/character/value-objects/character-id';
import { projectId } from '../../../../domain/project/value-objects/project-id';
import type { ProjectSessionReader } from '../../../session/ports/project-session-reader';
import type { CharacterRepository } from '../../ports/character-repository';
import { ArchiveCharacterHandler } from './archive-character.handler';

class RecordingCharacterRepository implements CharacterRepository {
  readonly saved: Character[] = [];
  async save(character: Character): Promise<void> {
    this.saved.push(character);
  }
  async findById(): Promise<Character | undefined> {
    return undefined;
  }
  async findByProjectId(): Promise<readonly Character[]> {
    return this.saved;
  }
  async existsByName(): Promise<boolean> {
    return false;
  }
}

describe('ArchiveCharacterHandler', () => {
  const character = Character.create({
    id: characterId('character-1'),
    projectId: projectId('project-1'),
    name: 'Emma',
  });

  it('archives a Character when the Project has no active Session', async () => {
    if (!character.isSuccess) throw character.error;
    const repository = new RecordingCharacterRepository();
    const sessions: ProjectSessionReader = {
      findByProject: async () => null,
      listCompletedByProject: async () => [],
      findCompletedById: async () => null,
    };

    const result = await new ArchiveCharacterHandler(sessions, repository).execute(character.value);

    expect(result).toMatchObject({ isSuccess: true, value: { status: 'archived' } });
    expect(repository.saved[0]?.name).toBe('Emma');
  });

  it('does not archive while the Project has an active Session', async () => {
    if (!character.isSuccess) throw character.error;
    const repository = new RecordingCharacterRepository();
    const sessions: ProjectSessionReader = {
      findByProject: async () => ({
        sessionId: 'session-1',
        projectId: projectId('project-1'),
        adventureId: 'adventure-1',
        adventureTitle: 'Erdei kaland',
        currentSceneTitle: 'Tisztás',
        currentGoal: 'Keresés',
        startedAt: '2026-08-03T10:00:00.000Z',
        status: 'running',
      }),
      listCompletedByProject: async () => [],
      findCompletedById: async () => null,
    };

    const result = await new ArchiveCharacterHandler(sessions, repository).execute(character.value);

    expect(result).toEqual({ isSuccess: false, code: 'ACTIVE_SESSION' });
    expect(repository.saved).toHaveLength(0);
  });
});
