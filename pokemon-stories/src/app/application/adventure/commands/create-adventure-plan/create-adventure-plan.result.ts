import { InvalidAdventurePlanError } from '../../../../domain/adventure/errors/invalid-adventure-plan.error';
import { AdventurePlan } from '../../../../domain/adventure/models/adventure-plan';
import { Outcome } from '../../../../domain/shared/outcome/outcome';
import { ProjectNotFoundError } from '../../../project/errors/project-not-found.error';
import { AdventureTitleAlreadyExistsError } from '../../errors/adventure-title-already-exists.error';

export type CreateAdventurePlanError =
  | InvalidAdventurePlanError
  | ProjectNotFoundError
  | AdventureTitleAlreadyExistsError;

export type CreateAdventurePlanResult = Outcome<
  AdventurePlan,
  CreateAdventurePlanError
>;