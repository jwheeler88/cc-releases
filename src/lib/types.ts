export type Category = 'features' | 'bugfixes' | 'performance' | 'devx';

export type Theme = 'light' | 'dark';

export interface ReleaseEntry {
  content: string;
  category: Category;
}

export interface Release {
  version: string;
  date: string;
  entries: ReleaseEntry[];
}
