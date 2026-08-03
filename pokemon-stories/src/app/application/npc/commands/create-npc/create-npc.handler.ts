import { Npc } from '../../../../domain/npc/models/npc';
import { npcId } from '../../../../domain/npc/value-objects/npc-id';
import type { ProjectId } from '../../../../domain/project/value-objects/project-id';
import type { IdGenerator } from '../../../shared/ports/id-generator';
import type { NpcRepository } from '../../ports/npc-repository';

export interface CreateNpcCommand {
  readonly projectId: ProjectId;
  readonly name: string;
  readonly role: string;
  readonly description?: string;
}

export type CreateNpcResult =
  | { readonly isSuccess: true; readonly value: Npc }
  | { readonly isSuccess: false; readonly code: 'PROJECT_NOT_FOUND' | 'INVALID' };

export class CreateNpcHandler {
  constructor(
    private readonly projectExists: (projectId: ProjectId) => Promise<boolean>,
    private readonly repository: NpcRepository,
    private readonly ids: IdGenerator,
  ) {}

  async execute(command: CreateNpcCommand): Promise<CreateNpcResult> {
    if (!(await this.projectExists(command.projectId))) {
      return { isSuccess: false, code: 'PROJECT_NOT_FOUND' };
    }
    try {
      const npc = Npc.create({
        id: npcId(this.ids.generate()),
        projectId: command.projectId,
        name: command.name,
        role: command.role,
        description: command.description,
      });
      await this.repository.save(npc);
      return { isSuccess: true, value: npc };
    } catch {
      return { isSuccess: false, code: 'INVALID' };
    }
  }
}
