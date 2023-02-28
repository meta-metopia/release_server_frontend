export interface Pagination<T> {
  items: T[];
  page: number;
  per: number;
  total: number;
  total_pages: number;
}

export interface Release {
  name: string;
  version: string;
  date: string;
  assets: string[];
}
