/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  collectCoverage: true,
  collectCoverageFrom: ['controllers/**/*.js', 'src/**/*.js', 'utils/**/*.js'],
  coveragePathIgnorePatterns: ['/node_modules/'],
};
