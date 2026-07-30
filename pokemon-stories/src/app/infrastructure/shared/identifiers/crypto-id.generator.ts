import { IdGenerator } from '../../../application/shared/ports/id-generator';

export class CryptoIdGenerator implements IdGenerator {
  generate(): string {
    return crypto.randomUUID();
  }
}