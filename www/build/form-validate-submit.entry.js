import { r as registerInstance, h, e as Host } from './index-96683c76.js';

const formValidateSubmitCss = ":host{display:block}";

let FormValidateSubmit = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return (h(Host, null, h("slot", null)));
  }
};
FormValidateSubmit.style = formValidateSubmitCss;

export { FormValidateSubmit as form_validate_submit };
