import { type LocationConfig } from '../models/Location';
import { type Result } from '../models/Result';

export interface IGeocodingProvider {
  searchCity(query: string): Promise<Result<readonly LocationConfig[], string>>;
}
