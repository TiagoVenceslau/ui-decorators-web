import { newSpecPage } from '@stencil/core/testing';
import { IonicUiInputElement } from '../ionic-ui-input-element';

describe('ionic-ui-input-element', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [IonicUiInputElement],
      html: `<ionic-ui-input-element input-id="id"
                                     input-name="id"
                                     input-prefix="input-"
                                     type="text"
                                     placeholder="place text here"
                                     label="This is a label"
                                     required="true"
                                     maxlength="15"
                                     minlength="5"
                                     pattern="^\w+$"
            ></ionic-ui-input-element>`,
    });
    expect(page.root).toEqualHtml(`
      <ionic-ui-input-element id="input-id" input-id="id" input-name="id" input-prefix="input-" label="This is a label" maxlength="15" minlength="5" pattern="^w+$" placeholder="place text here" required="true" type="text">
        <ion-item>
          <ion-label lines="none" position="floating">
            This is a label
          </ion-label>
          <ion-input maxlength="15" minlength="5" name="input-id" pattern="^w+$" placeholder="place text here" required="true" type="text"></ion-input>
        </ion-item>
      </ionic-ui-input-element>
    `);
  });
});
