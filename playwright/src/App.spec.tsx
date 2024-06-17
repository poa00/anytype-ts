import { test, expect } from '@playwright/experimental-ct-react';
import * as React from 'react';
import { Label } from 'Component';

test.use({ viewport: { width: 500, height: 500 } });


test('Label', async ({ mount }) => {
  const component = await mount(<Label text="Text" />);
  await expect(component).toContainText('Text');
});