import { InvalidAdventurePlanError } from '../../../../domain/adventure/errors/invalid-adventure-plan.error';
import { AdventurePlan } from '../../../../domain/adventure/models/adventure-plan';
import { failure, Outcome, success } from '../../../../domain/shared/outcome/outcome';
import { AdventurePlanNotFoundError } from '../../errors/adventure-plan-not-found.error';
import { AdventurePlanRepository } from '../../ports/adventure-plan-repository';
import { ManageAdventureSceneCommand } from './manage-adventure-scene.command';

export class ManageAdventureSceneHandler {
  constructor(private readonly repository: AdventurePlanRepository) {}

  async execute(
    command: ManageAdventureSceneCommand,
  ): Promise<Outcome<AdventurePlan, AdventurePlanNotFoundError | InvalidAdventurePlanError>> {
    const adventure = await this.repository.findById(command.adventurePlanId);
    if (!adventure || adventure.projectId !== command.projectId) {
      return failure(new AdventurePlanNotFoundError(command.adventurePlanId));
    }

    const result = this.apply(adventure, command);
    if (!result.isSuccess) return result;
    await this.repository.save(result.value);
    return success(result.value);
  }

  private apply(
    adventure: AdventurePlan,
    command: ManageAdventureSceneCommand,
  ): Outcome<AdventurePlan, InvalidAdventurePlanError> {
    switch (command.action) {
      case 'update':
        return adventure.updateScene(command.sceneId, command);
      case 'remove':
        return adventure.removeScene(command.sceneId);
      case 'move':
        return adventure.moveScene(command.sceneId, command.direction);
      case 'select-opening':
        return adventure.selectOpeningScene(command.sceneId);
    }
  }
}
