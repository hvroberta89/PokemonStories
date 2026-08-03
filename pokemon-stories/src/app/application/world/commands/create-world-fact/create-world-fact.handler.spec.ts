import { projectId } from '../../../../domain/project/value-objects/project-id';
import type { WorldFact } from '../../../../domain/world/models/world-fact';
import { FixedIdGenerator } from '../../../../infrastructure/shared/identifiers/fixed-id.generator';
import type { WorldFactRepository } from '../../ports/world-fact-repository';
import { CreateWorldFactHandler } from './create-world-fact.handler';

class RecordingWorldFactRepository implements WorldFactRepository {
  readonly saved: WorldFact[] = [];

  async save(fact: WorldFact): Promise<void> {
    this.saved.push(fact);
  }

  async findByProject(): Promise<readonly WorldFact[]> {
    return this.saved;
  }
}

describe('CreateWorldFactHandler', () => {
  it('creates a World Fact only for an existing Project', async () => {
    const repository = new RecordingWorldFactRepository();
    const handler = new CreateWorldFactHandler(
      async () => true,
      repository,
      new FixedIdGenerator('world-fact-1'),
    );

    const result = await handler.execute({
      projectId: projectId('project-1'),
      text: 'Az Öreg Híd megjavult.',
    });

    expect(result.isSuccess).toBe(true);
    expect(repository.saved[0]?.value).toMatchObject({
      id: 'world-fact-1',
      category: 'general',
      status: 'active',
    });
  });

  it('does not save an invalid World Fact', async () => {
    const repository = new RecordingWorldFactRepository();
    const handler = new CreateWorldFactHandler(
      async () => true,
      repository,
      new FixedIdGenerator('world-fact-1'),
    );

    const result = await handler.execute({ projectId: projectId('project-1'), text: ' ' });

    expect(result).toEqual({ isSuccess: false, code: 'INVALID' });
    expect(repository.saved).toHaveLength(0);
  });
});
