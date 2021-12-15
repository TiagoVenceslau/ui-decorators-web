import { newE2EPage } from '@stencil/core/testing';

describe('form-validate-submit', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<form-validate-submit></form-validate-submit>');

    const element = await page.find('form-validate-submit');
    expect(element).toHaveClass('hydrated');
  });
});
