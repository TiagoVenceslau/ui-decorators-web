import { newSpecPage } from '@stencil/core/testing';
import { FormValidateSubmit } from '../form-validate-submit';

describe('form-validate-submit', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [FormValidateSubmit],
      html: `<form-validate-submit></form-validate-submit>`,
    });
    expect(page.root).toEqualHtml(`
      <form-validate-submit>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </form-validate-submit>
    `);
  });
});
