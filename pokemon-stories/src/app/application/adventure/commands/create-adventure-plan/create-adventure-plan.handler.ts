import { AdventurePlan } from '../../../../domain/adventure/models/adventure-plan';
import { adventurePlanId } from '../../../../domain/adventure/value-objects/adventure-plan-id';
import {
  failure,
  success,
} from '../../../../domain/shared/outcome/outcome';
import { ProjectNotFoundError } from '../../../project/errors/project-not-found.error';
import { ProjectRepository } from '../../../project/ports/project-repository';
import { IdGenerator } from '../../../shared/ports/id-generator';
import { AdventureTitleAlreadyExistsError } from '../../errors/adventure-title-already-exists.error';
import { AdventurePlanRepository } from '../../ports/adventure-plan-repository';
import { CreateAdventurePlanCommand } from './create-adventure-plan.command';
import { CreateAdventurePlanResult } from './create-adventure-plan.result';

export class CreateAdventurePlanHandler {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly adventurePlanRepository: AdventurePlanRepository,
    private readonly idGenerator: IdGenerator,
  ) {}

  async execute(
    command: CreateAdventurePlanCommand,
  ): Promise<CreateAdventurePlanResult> {
    const project = await this.projectRepository.findById(
      command.projectId,
    );

    if (project === undefined) {
      return failure(
        new ProjectNotFoundError(command.projectId),
      );
    }

    const adventurePlanResult = AdventurePlan.create({
      id: adventurePlanId(this.idGenerator.generate()),
      projectId: command.projectId,
      title: command.title,
      premise: command.premise,
      audienceProfile: command.audienceProfile,
    });

    if (!adventurePlanResult.isSuccess) {
      return adventurePlanResult;
    }

    const adventurePlan = adventurePlanResult.value;

    const titleAlreadyExists =
      await this.adventurePlanRepository.existsByTitle(
        command.projectId,
        adventurePlan.title,
      );

    if (titleAlreadyExists) {
      return failure(
        new AdventureTitleAlreadyExistsError(
          adventurePlan.title,
        ),
      );
    }

    await this.adventurePlanRepository.save(adventurePlan);

    return success(adventurePlan);
  }
}