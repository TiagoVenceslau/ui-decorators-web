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
        <form class="form-validate-submit">
          <slot-fb name="fields"></slot-fb>
          <slot-fb name="buttons">
            <br>
            <button name="reset" type="reset">
              Reset
            </button>
            <button name="submit" type="submit">
              Submit
            </button>
          </slot-fb>
        </form>
      </form-validate-submit>
    `);
  });
});
