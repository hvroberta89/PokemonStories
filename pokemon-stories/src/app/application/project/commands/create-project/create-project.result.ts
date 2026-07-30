import { InvalidProjectError } from '../../../../domain/project/errors/invalid-project.error';
import { Project } from '../../../../domain/project/models/project';
import { Outcome } from '../../../../domain/shared/outcome/outcome';
import { ProjectNameAlreadyExistsError } from '../../errors/project-name-already-exists.error';

export type CreateProjectError =
  | InvalidProjectError
  | ProjectNameAlreadyExistsError;

export type CreateProjectResult = Outcome<
  Project,
  CreateProjectError
>;