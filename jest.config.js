module.exports = {
  verbose: true,
  transform: {'^.+\\.ts?$': 'ts-jest'},
  testEnvironment: 'node',
  testRegex: '/test.*\\.(test|spec)\\.(ts|tsx)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverage: true,
  coverageDirectory: "./workdocs/coverage",
  coverageReporters: [
    "json-summary"
  ]
};
