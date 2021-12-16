import { newE2EPage } from '@stencil/core/testing';

describe('ionic-ui-input-element', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ionic-ui-input-element></ionic-ui-input-element>');

    const element = await page.find('ionic-ui-input-element');
    expect(element).toHaveClass('hydrated');
  });
});
