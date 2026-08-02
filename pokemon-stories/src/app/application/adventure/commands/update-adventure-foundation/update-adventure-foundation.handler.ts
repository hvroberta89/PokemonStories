import { InvalidAdventurePlanError } from '../../../../domain/adventure/errors/invalid-adventure-plan.error';
import { AdventurePlan } from '../../../../domain/adventure/models/adventure-plan';
import { failure, Outcome, success } from '../../../../domain/shared/outcome/outcome';
import { AdventurePlanNotFoundError } from '../../errors/adventure-plan-not-found.error';
import { AdventureTitleAlreadyExistsError } from '../../errors/adventure-title-already-exists.error';
import { AdventurePlanRepository } from '../../ports/adventure-plan-repository';
import { UpdateAdventureFoundationCommand } from './update-adventure-foundation.command';

type UpdateAdventureFoundationError =
  AdventurePlanNotFoundError | AdventureTitleAlreadyExistsError | InvalidAdventurePlanError;

export class UpdateAdventureFoundationHandler {
  constructor(private readonly repository: AdventurePlanRepository) {}

  async execute(
    command: UpdateAdventureFoundationCommand,
  ): Promise<Outcome<AdventurePlan, UpdateAdventureFoundationError>> {
    const current = await this.repository.findById(command.adventurePlanId);

    if (!current || current.projectId !== command.projectId) {
      return failure(new AdventurePlanNotFoundError(command.adventurePlanId));
    }

    const normalizedTitle = command.title.trim();
    const titleChanged = normalizedTitle.toLocaleLowerCase() !== current.title.toLocaleLowerCase();

    if (titleChanged && (await this.repository.existsByTitle(command.projectId, normalizedTitle))) {
      return failure(new AdventureTitleAlreadyExistsError(normalizedTitle));
    }

    const updated = current.updateFoundation(command);
    if (!updated.isSuccess) return updated;

    await this.repository.save(updated.value);
    return success(updated.value);
  }
}
