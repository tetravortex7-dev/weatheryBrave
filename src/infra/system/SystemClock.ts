import { type IClock } from '../../core/ports/IClock';

export class SystemClock implements IClock {
  public now(): Date {
    return new Date();
  }

  public epochMs(): number {
    return Date.now();
  }
}
