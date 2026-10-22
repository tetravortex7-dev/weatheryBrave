export interface IClock {
  now(): Date;
  epochMs(): number;
}
