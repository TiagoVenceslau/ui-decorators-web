import { E2EPage, newE2EPage } from '@stencil/core/testing';

// const path = require('path');
//
// describe('ionic-ui-input-element', () => {
//
//   let page: E2EPage;
//
//   beforeEach(async () => {
//     page = await newE2EPage();
//     try {
//       await page.addScriptTag({path: path.join(__dirname, '../../../../www/lib/decorator-validation.esm.js'), type: 'module'});
//       await page.addScriptTag({path: path.join(__dirname, '../../../../www/lib/ui-decorators.esm.js'), type: 'module'});
//       await page.addScriptTag({path: path.join(__dirname, '../../../../www/lib/ionic/ionic.js'), type: 'module'});
//       await page.addStyleTag({path: path.join(__dirname, '../../../../www/lib/ionic/css/ionic.bundle.css')});
//       await page.addScriptTag({path: path.join(__dirname, '../../../../www/build/ui-decorators-web.esm.js'), type: 'module'});
//     } catch (e) {
//       console.log(e)
//     }
//   })
//
//   it('renders', async () => {
//     expect(page.isJavaScriptEnabled()).toBeTruthy();
//
//     const html = '<ionic-ui-input-element input-id="id" input-name="id" input-prefix="input-" type="text" placeholder="place text here" label="This is a label" required="true" maxlength="15" minlength="5" pattern="^\w+$"></ionic-ui-input-element>';
//
//     await page.setContent(html);
//
//     const element = await page.find('ionic-ui-input-element');
//
//     expect(element).toBeDefined();
//     expect(element).toHaveClass('hydrated');
//
//     const ionItem = await element.find('ion-item');
//
//     expect (ionItem).toBeDefined();
//   });
// });
