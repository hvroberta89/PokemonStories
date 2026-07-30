import { IdGenerator } from '../../../application/shared/ports/id-generator';

export class FixedIdGenerator implements IdGenerator {
  constructor(private readonly id: string) {}

  generate(): string {
    return this.id;
  }
}