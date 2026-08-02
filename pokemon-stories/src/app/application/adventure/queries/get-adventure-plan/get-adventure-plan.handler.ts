import { AdventurePlan } from '../../../../domain/adventure/models/adventure-plan';
import { AdventurePlanReader } from '../../ports/adventure-plan-reader';
import { GetAdventurePlanQuery } from './get-adventure-plan.query';

export class GetAdventurePlanHandler {
  constructor(private readonly reader: AdventurePlanReader) {}

  async execute(query: GetAdventurePlanQuery): Promise<AdventurePlan | undefined> {
    const adventure = await this.reader.findById(query.adventurePlanId);
    return adventure?.projectId === query.projectId ? adventure : undefined;
  }
}
