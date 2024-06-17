import { test, expect } from '@playwright/experimental-ct-react';
import * as React from 'react';
import { Label } from '../src/ts/component';

test.use({ viewport: { width: 500, height: 500 } });

test('should work', async ({ mount }) => {
  const component = await mount(<Label text="123" />);
  await expect(component).toContainText('123');
});