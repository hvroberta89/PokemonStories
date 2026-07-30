import { InjectionToken } from '@angular/core';
import { IdGenerator } from '../../shared/ports/id-generator';

export const ID_GENERATOR =
  new InjectionToken<IdGenerator>('ID_GENERATOR');