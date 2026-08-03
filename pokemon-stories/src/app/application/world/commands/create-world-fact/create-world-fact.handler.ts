import type { ProjectId } from '../../../../domain/project/value-objects/project-id';
import { WorldFact, type WorldFactCategory } from '../../../../domain/world/models/world-fact';
import type { IdGenerator } from '../../../shared/ports/id-generator';
import type { WorldFactRepository } from '../../ports/world-fact-repository';

export interface CreateWorldFactCommand {
  readonly projectId: ProjectId;
  readonly text: string;
  readonly category?: WorldFactCategory;
}

export type CreateWorldFactResult =
  | { readonly isSuccess: true; readonly value: WorldFact }
  | { readonly isSuccess: false; readonly code: 'PROJECT_NOT_FOUND' | 'INVALID' };

export class CreateWorldFactHandler {
  constructor(
    private readonly projectExists: (projectId: ProjectId) => Promise<boolean>,
    private readonly repository: WorldFactRepository,
    private readonly ids: IdGenerator,
  ) {}

  async execute(command: CreateWorldFactCommand): Promise<CreateWorldFactResult> {
    if (!(await this.projectExists(command.projectId))) {
      return { isSuccess: false, code: 'PROJECT_NOT_FOUND' };
    }

    try {
      const fact = WorldFact.create({
        id: this.ids.generate(),
        projectId: command.projectId,
        text: command.text,
        category: command.category ?? 'general',
      });
      await this.repository.save(fact);
      return { isSuccess: true, value: fact };
    } catch {
      return { isSuccess: false, code: 'INVALID' };
    }
  }
}
