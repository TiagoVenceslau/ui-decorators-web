import { newE2EPage } from '@stencil/core/testing';

describe('ionic-ui-input-element', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    const html = [

      '<ionic-ui-input-element input-id="id" input-name="id" input-prefix="input-" type="text" placeholder="place text here" label="This is a label" required="true" maxlength="15" minlength="5"\ pattern="^\w+$"></ionic-ui-input-element>'
    ]

    await page.setContent(html.join('\n'));

    const element = await page.find('ionic-ui-input-element');
    expect(element).toHaveClass('hydrated');
  });
});
