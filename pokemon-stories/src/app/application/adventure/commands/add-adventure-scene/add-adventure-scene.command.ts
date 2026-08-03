import { AdventurePlanId } from '../../../../domain/adventure/value-objects/adventure-plan-id';
import { ProjectId } from '../../../../domain/project/value-objects/project-id';

export interface AddAdventureSceneCommand {
  readonly projectId: ProjectId;
  readonly adventurePlanId: AdventurePlanId;
  readonly title: string;
  readonly description: string;
  readonly goal: string;
  readonly pokemonReferenceId?: string;
}
