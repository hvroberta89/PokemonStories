import type { AdventurePlanReader } from '../../ports/adventure-plan-reader';
import type { AdventurePlanSummary } from '../models/adventure-plan-summary';
import type { ListAdventurePlansByProjectQuery } from '../list-adventure-plans-by-project/list-adventure-plans-by-project.query';

export class ListArchivedAdventurePlansByProjectHandler {
  constructor(private readonly adventurePlanReader: AdventurePlanReader) {}

  async execute(query: ListAdventurePlansByProjectQuery): Promise<readonly AdventurePlanSummary[]> {
    return (await this.adventurePlanReader.findByProjectId(query.projectId))
      .filter((adventure) => adventure.status === 'archived')
      .map((adventure) => ({
        id: adventure.id,
        projectId: adventure.projectId,
        title: adventure.title,
        premise: adventure.premise,
        status: adventure.status,
        minimumAge: adventure.audienceProfile.ageRange.minimum,
        maximumAge: adventure.audienceProfile.ageRange.maximum,
        sessionLengthMinutes: adventure.audienceProfile.sessionLengthMinutes,
      }))
      .sort((first, second) => first.title.localeCompare(second.title, 'hu'));
  }
}