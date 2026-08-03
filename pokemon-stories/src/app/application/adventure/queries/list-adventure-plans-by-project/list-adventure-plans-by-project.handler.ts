import { AdventurePlanReader } from '../../ports/adventure-plan-reader';
import { AdventurePlanSummary } from '../models/adventure-plan-summary';
import { ListAdventurePlansByProjectQuery } from './list-adventure-plans-by-project.query';

export class ListAdventurePlansByProjectHandler {
  constructor(
    private readonly adventurePlanReader: AdventurePlanReader,
  ) {}

  async execute(
    query: ListAdventurePlansByProjectQuery,
  ): Promise<readonly AdventurePlanSummary[]> {
    const adventurePlans =
      await this.adventurePlanReader.findByProjectId(
        query.projectId,
      );

    return adventurePlans
      .filter((adventurePlan) => adventurePlan.status !== 'archived')
        .map(
            (adventurePlan): AdventurePlanSummary => ({
                id: adventurePlan.id,
                projectId: adventurePlan.projectId,
                title: adventurePlan.title,
                premise: adventurePlan.premise,
                status: adventurePlan.status,
                minimumAge:
                    adventurePlan.audienceProfile.ageRange.minimum,
                maximumAge:
                    adventurePlan.audienceProfile.ageRange.maximum,
                sessionLengthMinutes:
                    adventurePlan.audienceProfile.sessionLengthMinutes,
            }),
        )
        .sort((first, second) =>
            first.title.localeCompare(second.title),
        );
  }
}