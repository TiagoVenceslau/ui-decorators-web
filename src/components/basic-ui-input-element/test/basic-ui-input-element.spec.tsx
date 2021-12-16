import { newSpecPage } from '@stencil/core/testing';
import { BasicUiInputElement } from '../basic-ui-input-element';

describe('basic-input-element', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BasicUiInputElement],
      html: `<basic-ui-input-element input-id="id"
                                     input-name="id"
                                     input-prefix="input-"
                                     type="text"
                                     placeholder="place text here"
                                     label="This is a label"
                                     required="true"
                                     maxlength="15"
                                     minlength="5"
                                     pattern="^\w+$"
            ></basic-ui-input-element>`,
    });
    expect(page.root).toEqualHtml(`
      <basic-ui-input-element id="id" input-id="id" input-name="id" input-prefix="input-" label="This is a label" maxlength="15" minlength="5" pattern="^w+$" placeholder="place text here" required="true" type="text">
        <div class="input-wrapper">
          <label htmlfor="input-id">
            This is a label
          </label>
          <input id="input-id" maxlength="15" minlength="5" name="input-id" pattern="^w+$" placeholder="place text here" required="" type="text">
          <br>
        </div>
      </basic-ui-input-element>
    `);
  });
});
