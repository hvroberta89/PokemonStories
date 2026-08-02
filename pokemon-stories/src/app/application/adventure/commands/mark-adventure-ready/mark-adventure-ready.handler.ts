import { InvalidAdventurePlanError } from '../../../../domain/adventure/errors/invalid-adventure-plan.error';
import { AdventurePlan } from '../../../../domain/adventure/models/adventure-plan';
import { failure, Outcome, success } from '../../../../domain/shared/outcome/outcome';
import { AdventurePlanNotFoundError } from '../../errors/adventure-plan-not-found.error';
import { AdventurePlanRepository } from '../../ports/adventure-plan-repository';
import { MarkAdventureReadyCommand } from './mark-adventure-ready.command';

export class MarkAdventureReadyHandler {
  constructor(private readonly repository: AdventurePlanRepository) {}

  async execute(
    command: MarkAdventureReadyCommand,
  ): Promise<Outcome<AdventurePlan, AdventurePlanNotFoundError | InvalidAdventurePlanError>> {
    const adventure = await this.repository.findById(command.adventurePlanId);
    if (!adventure || adventure.projectId !== command.projectId) {
      return failure(new AdventurePlanNotFoundError(command.adventurePlanId));
    }
    const result = adventure.markReady();
    if (!result.isSuccess) return result;
    await this.repository.save(result.value);
    return success(result.value);
  }
}
