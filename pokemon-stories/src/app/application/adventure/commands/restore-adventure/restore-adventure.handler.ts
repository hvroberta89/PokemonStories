import type { AdventurePlan } from '../../../../domain/adventure/models/adventure-plan';
import type { AdventurePlanRepository } from '../../ports/adventure-plan-repository';

export class RestoreAdventureHandler {
  constructor(private readonly repository: AdventurePlanRepository) {}

  async execute(adventure: AdventurePlan): Promise<AdventurePlan> {
    const restoredAdventure = adventure.restoreForEditing();
    await this.repository.save(restoredAdventure);
    return restoredAdventure;
  }
}