export const CATEGORIES = {
  bugfixes: {
    label: 'Bug Fixes',
    color: '#788c5d',
    keywords: ['fix', 'bug', 'resolve', 'patch'],
  },
  performance: {
    label: 'Performance',
    color: '#d97757',
    keywords: ['perf', 'fast', 'speed', 'optimize', 'reduce', 'reduced'],
  },
  devx: {
    label: 'DevX',
    color: '#9b8bb0',
    keywords: ['dx', 'developer', 'tooling', 'cli', 'improve', 'improved'],
  },
  features: {
    label: 'Features',
    color: '#6a9bcc',
    keywords: ['add', 'new', 'feature', 'support'],
  },
} as const;

export const CHANGELOG_URL = 'https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md';
