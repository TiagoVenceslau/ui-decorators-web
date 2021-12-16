import { newSpecPage } from '@stencil/core/testing';
import { IonicUiInputElement } from '../ionic-ui-input-element';

describe('ionic-ui-input-element', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [IonicUiInputElement],
      html: `<ionic-ui-input-element></ionic-ui-input-element>`,
    });
    expect(page.root).toEqualHtml(`
      <ionic-ui-input-element>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ionic-ui-input-element>
    `);
  });
});
