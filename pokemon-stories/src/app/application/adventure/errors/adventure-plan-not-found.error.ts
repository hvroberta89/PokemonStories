import { AdventurePlanId } from '../../../domain/adventure/value-objects/adventure-plan-id';
import { DomainError } from '../../../domain/shared/errors/domain-error';

export class AdventurePlanNotFoundError extends DomainError {
  constructor(id: AdventurePlanId) {
    super('ADVENTURE_PLAN_NOT_FOUND', `Adventure "${id}" was not found.`);
  }
}
