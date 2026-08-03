import { projectId } from '../../../../domain/project/value-objects/project-id';
import { WorldFact } from '../../../../domain/world/models/world-fact';
import { FixedIdGenerator } from '../../../../infrastructure/shared/identifiers/fixed-id.generator';
import type { WorldFactRepository } from '../../ports/world-fact-repository';
import { ReplaceWorldFactHandler } from './replace-world-fact.handler';

class RecordingWorldFactRepository implements WorldFactRepository {
  readonly saved: WorldFact[] = [];
  async save(fact: WorldFact): Promise<void> {
    this.saved.push(fact);
  }
  async findByProject(): Promise<readonly WorldFact[]> {
    return this.saved;
  }
}

describe('ReplaceWorldFactHandler', () => {
  it('supersedes the previous fact and creates a new active fact', async () => {
    const repository = new RecordingWorldFactRepository();
    const previous = WorldFact.create({
      id: 'fact-1',
      projectId: projectId('project-1'),
      text: 'Az Öreg Híd sérült.',
      category: 'location',
    });

    const replacement = await new ReplaceWorldFactHandler(
      repository,
      new FixedIdGenerator('fact-2'),
    ).execute(previous, 'Az Öreg Híd megjavult.');

    expect(repository.saved[0]?.value).toMatchObject({ id: 'fact-1', status: 'superseded' });
    expect(replacement.value).toMatchObject({
      id: 'fact-2',
      text: 'Az Öreg Híd megjavult.',
      category: 'location',
      status: 'active',
    });
  });
});
