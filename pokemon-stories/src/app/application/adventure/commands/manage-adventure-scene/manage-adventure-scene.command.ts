import { AdventurePlanId } from '../../../../domain/adventure/value-objects/adventure-plan-id';
import { AdventureSceneId } from '../../../../domain/adventure/value-objects/adventure-scene-id';
import { ProjectId } from '../../../../domain/project/value-objects/project-id';

interface SceneCommandBase {
  readonly projectId: ProjectId;
  readonly adventurePlanId: AdventurePlanId;
  readonly sceneId: AdventureSceneId;
}

export type ManageAdventureSceneCommand =
  | (SceneCommandBase & {
      readonly action: 'update';
      readonly title: string;
      readonly description: string;
      readonly goal: string;
      readonly pokemonReferenceId?: string;
    })
  | (SceneCommandBase & { readonly action: 'remove' })
  | (SceneCommandBase & { readonly action: 'move'; readonly direction: 'up' | 'down' })
  | (SceneCommandBase & { readonly action: 'select-opening' });
