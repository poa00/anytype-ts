import { defineConfig, devices } from '@playwright/experimental-ct-react17';
import { resolve } from 'path';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	testDir: './',
	/* The base directory, relative to the config file, for snapshot files created with toMatchSnapshot and toHaveScreenshot. */
	snapshotDir: './__snapshots__',
	/* Maximum time one test can run for. */
	timeout: 10 * 1000,
	/* Run tests in files in parallel */
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: process.env.CI ? 2 : 0,
	/* Opt out of parallel tests on CI. */
	workers: process.env.CI ? 1 : undefined,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: 'list',
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: 'on-first-retry',

		/* Port to use for Playwright component endpoint. */
		ctPort: 3100,

		ctViteConfig: {
			build: {
				rollupOptions: {
					external: [
						/dist\/lib\/*/,
					]
				}
			},

			resolve: {
				alias: {
					"Component": resolve('./src/ts/component'),
					"Lib": resolve('./src/ts/lib'),
					"Store": resolve('./src/ts/store'),
					"json": resolve('./src/json'),
					"Interface": resolve('./src/ts/interface'),
					"Model": resolve('./src/ts/model'),
					"Docs": resolve('./src/ts/docs'),
					"dist": resolve('./dist'),
				},
			},
		},
	},

	/* Configure projects for major browsers */
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
	],

});