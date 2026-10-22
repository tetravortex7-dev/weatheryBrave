export type SearchDisposition = 'CURRENT_TAB' | 'NEW_TAB';

export interface ISearchProvider {
  search(query: string, disposition?: SearchDisposition): void;
}
