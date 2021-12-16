import { E2EPage, newE2EPage } from '@stencil/core/testing';



describe('ionic-ui-input-element', () => {

  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage();
    try {
      await page.addScriptTag({url: 'https://cdn.jsdelivr.net/npm/@tvenceslau/decorator-validation@v1.7.5/dist/esm/index.bundle.min.esm.js', type: 'module'});
      await page.addScriptTag({url: 'https://cdn.jsdelivr.net/npm/@tvenceslau/ui-decorators@v0.0.4/dist/esm/index.bundle.min.esm.js', type: 'module'});
      await page.addScriptTag({url: 'https://cdn.jsdelivr.net/npm/@ionic/core/dist/ionic/ionic.esm.js', type: 'module'});
      await page.addStyleTag({url: 'https://cdn.jsdelivr.net/npm/@ionic/core/css/ionic.bundle.css'})
    } catch (e) {
      console.log(e)
    }
  })

  it('renders', async () => {
    await page.setContent('<ionic-ui-input-element input-id="id" input-name="id" input-prefix="input-" type="text" placeholder="place text here" label="This is a label" required="true" maxlength="15" minlength="5"\ pattern="^\w+$"></ionic-ui-input-element>');

    const element = await page.find('ionic-ui-input-element');
    expect(element).toHaveClass('hydrated');
  });
});
