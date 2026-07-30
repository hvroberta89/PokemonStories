import { AdventurePlanReader } from '../../../application/adventure/ports/adventure-plan-reader';
import { AdventurePlanRepository } from '../../../application/adventure/ports/adventure-plan-repository';
import { AdventurePlan } from '../../../domain/adventure/models/adventure-plan';
import { AdventurePlanId } from '../../../domain/adventure/value-objects/adventure-plan-id';
import { ProjectId } from '../../../domain/project/value-objects/project-id';

export class InMemoryAdventurePlanRepository
  implements AdventurePlanRepository, AdventurePlanReader
{
  private readonly adventurePlans = new Map<
    AdventurePlanId,
    AdventurePlan
  >();

  async save(
    adventurePlan: AdventurePlan,
  ): Promise<void> {
    this.adventurePlans.set(
      adventurePlan.id,
      adventurePlan,
    );
  }

  async findById(
    id: AdventurePlanId,
  ): Promise<AdventurePlan | undefined> {
    return this.adventurePlans.get(id);
  }

  async findByProjectId(
    projectId: ProjectId,
  ): Promise<readonly AdventurePlan[]> {
    return Array.from(this.adventurePlans.values()).filter(
      adventurePlan =>
        adventurePlan.projectId === projectId,
    );
  }

  async existsByTitle(
    projectId: ProjectId,
    title: string,
  ): Promise<boolean> {
    const normalizedTitle = this.normalizeTitle(title);

    return Array.from(this.adventurePlans.values()).some(
      adventurePlan =>
        adventurePlan.projectId === projectId &&
        this.normalizeTitle(adventurePlan.title) ===
          normalizedTitle,
    );
  }

  getAll(): readonly AdventurePlan[] {
    return Array.from(this.adventurePlans.values());
  }

  private normalizeTitle(title: string): string {
    return title.trim().toLocaleLowerCase();
  }
}