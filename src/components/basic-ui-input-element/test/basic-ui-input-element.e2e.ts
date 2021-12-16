import {E2EPage, newE2EPage} from '@stencil/core/testing';
const path = require('path');

describe('basic-input-element', () => {

  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<basic-ui-input-element></basic-ui-input-element>');

    const element = await page.find('basic-ui-input-element');
    expect(element).toHaveClass('hydrated');
  });
});
