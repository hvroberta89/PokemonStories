import type { AdventurePlan } from '../../../../domain/adventure/models/adventure-plan';
import type { ProjectSessionReader } from '../../../session/ports/project-session-reader';
import type { AdventurePlanRepository } from '../../ports/adventure-plan-repository';

export type ArchiveAdventureResult =
  | { readonly isSuccess: true; readonly value: AdventurePlan }
  | { readonly isSuccess: false; readonly code: 'ACTIVE_SESSION' };

export class ArchiveAdventureHandler {
  constructor(
    private readonly sessions: ProjectSessionReader,
    private readonly repository: AdventurePlanRepository,
  ) {}

  async execute(adventure: AdventurePlan): Promise<ArchiveAdventureResult> {
    const session = await this.sessions.findByProject(adventure.projectId);
    if (session?.adventureId === adventure.id) {
      return { isSuccess: false, code: 'ACTIVE_SESSION' };
    }
    const archivedAdventure = adventure.archive();
    await this.repository.save(archivedAdventure);
    return { isSuccess: true, value: archivedAdventure };
  }
}