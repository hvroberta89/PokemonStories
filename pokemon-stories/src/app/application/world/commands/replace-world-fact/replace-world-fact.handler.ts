import { WorldFact } from '../../../../domain/world/models/world-fact';
import type { IdGenerator } from '../../../shared/ports/id-generator';
import type { WorldFactRepository } from '../../ports/world-fact-repository';

export class ReplaceWorldFactHandler {
  constructor(
    private readonly repository: WorldFactRepository,
    private readonly ids: IdGenerator,
  ) {}

  async execute(existing: WorldFact, text: string): Promise<WorldFact> {
    const replacement = WorldFact.create({
      id: this.ids.generate(),
      projectId: existing.value.projectId,
      text,
      category: existing.value.category,
    });
    await this.repository.save(existing.supersede());
    await this.repository.save(replacement);
    return replacement;
  }
}
