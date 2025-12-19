export const CATEGORIES = {
  features: {
    label: 'Features',
    color: '#6a9bcc',
    keywords: ['add', 'new', 'feature', 'support'],
  },
  bugfixes: {
    label: 'Bug Fixes',
    color: '#788c5d',
    keywords: ['fix', 'bug', 'resolve', 'patch'],
  },
  performance: {
    label: 'Performance',
    color: '#d97757',
    keywords: ['perf', 'fast', 'speed', 'optimize'],
  },
  devx: {
    label: 'DevX',
    color: '#9b8bb0',
    keywords: ['dx', 'developer', 'tooling', 'cli'],
  },
} as const;

export const CHANGELOG_URL = 'https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md';
