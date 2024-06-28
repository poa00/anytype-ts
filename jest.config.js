/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: 'ts-jest/presets/js-with-ts',
	testEnvironment: 'jsdom',
	transform: {
      "^.+\\.(ts|tsx)?$": "ts-jest",
      "^.+\\.(js|jsx)$": "babel-jest"
    },
	moduleNameMapper: {
		'^json$': '<rootDir>/src/json/index.ts',
		'json/(.*)$': '<rootDir>/src/json/$1.ts',

		Lib: '<rootDir>/src/ts/lib/index.ts',
		Store: '<rootDir>/src/ts/store/index.ts',
		Docs: '<rootDir>/src/ts/docs/index.ts',
		Component: '<rootDir>/src/ts/component/index.ts',
		Model: '<rootDir>/src/ts/model/index.ts',
		Interface: '<rootDir>/src/ts/interface/index.ts',

		'dist/lib/(.*)$': '<rootDir>/dist/lib/$1.js',
	} 
};