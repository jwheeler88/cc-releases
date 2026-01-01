export const CATEGORIES = {
  bugfixes: {
    label: 'Bug Fixes',
    color: '#d97757',
    keywords: ['fix', 'bug', 'resolve', 'patch'],
  },
  performance: {
    label: 'Performance',
    color: '#6a9bcc',
    keywords: ['perf', 'performance', 'fast', 'faster', 'speed', 'optimize', 'reduce', 'reduced', 'efficient', 'efficiency', 'memory', 'latency'],
  },
  devx: {
    label: 'DevX',
    color: '#9b8bb0',
    keywords: ['dx', 'developer', 'tooling', 'cli', 'improve', 'improved', 'changed', 'removed', 'moved', 'deprecated'],
  },
  features: {
    label: 'Features',
    color: '#788c5d',
    keywords: ['add', 'new', 'feature', 'support'],
  },
} as const;

export const CHANGELOG_URL = 'https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md';

export const GITHUB_COMMITS_API = 'https://api.github.com/repos/anthropics/claude-code/commits';
