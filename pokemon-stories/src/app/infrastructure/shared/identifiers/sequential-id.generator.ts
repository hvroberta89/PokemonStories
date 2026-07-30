import { IdGenerator } from '../../../application/shared/ports/id-generator';

export class SequentialIdGenerator implements IdGenerator {
  private currentValue = 0;

  constructor(
    private readonly prefix: string = 'id',
  ) {}

  generate(): string {
    this.currentValue += 1;

    return `${this.prefix}-${this.currentValue}`;
  }
}