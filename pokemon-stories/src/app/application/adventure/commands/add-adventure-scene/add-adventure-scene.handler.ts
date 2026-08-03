import { AdventurePlan } from '../../../../domain/adventure/models/adventure-plan';
import { InvalidAdventurePlanError } from '../../../../domain/adventure/errors/invalid-adventure-plan.error';
import { adventureSceneId } from '../../../../domain/adventure/value-objects/adventure-scene-id';
import { failure, Outcome, success } from '../../../../domain/shared/outcome/outcome';
import { IdGenerator } from '../../../shared/ports/id-generator';
import { AdventurePlanNotFoundError } from '../../errors/adventure-plan-not-found.error';
import { AdventurePlanRepository } from '../../ports/adventure-plan-repository';
import { AddAdventureSceneCommand } from './add-adventure-scene.command';

export class AddAdventureSceneHandler {
  constructor(
    private readonly repository: AdventurePlanRepository,
    private readonly idGenerator: IdGenerator,
  ) {}

  async execute(
    command: AddAdventureSceneCommand,
  ): Promise<Outcome<AdventurePlan, AdventurePlanNotFoundError | InvalidAdventurePlanError>> {
    const adventure = await this.repository.findById(command.adventurePlanId);

    if (!adventure || adventure.projectId !== command.projectId) {
      return failure(new AdventurePlanNotFoundError(command.adventurePlanId));
    }

    const result = adventure.addScene({
      id: adventureSceneId(this.idGenerator.generate()),
      title: command.title,
      description: command.description,
      goal: command.goal,
      pokemonReferenceId: command.pokemonReferenceId,
    });

    if (!result.isSuccess) return result;
    await this.repository.save(result.value);
    return success(result.value);
  }
}
