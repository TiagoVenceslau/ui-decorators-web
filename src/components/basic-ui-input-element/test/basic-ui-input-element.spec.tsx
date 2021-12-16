import { newSpecPage } from '@stencil/core/testing';
import { BasicUiInputElement } from '../basic-ui-input-element';

describe('basic-input-element', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BasicUiInputElement],
      html: `<basic-ui-input-element></basic-ui-input-element>`,
    });
    expect(page.root).toEqualHtml(`
      <basic-ui-input-element>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </basic-ui-input-element>
    `);
  });
});
