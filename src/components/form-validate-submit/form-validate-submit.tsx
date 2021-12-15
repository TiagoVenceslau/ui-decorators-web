import {Component, Host, h, Element, Prop} from '@stencil/core';



@Component({
  tag: 'form-validate-submit',
  styleUrl: 'form-validate-submit.css',
  shadow: false,
})
export class FormValidateSubmit {

  @Element()
  public element: HTMLElement;

  @Prop({attribute: 'form-id'}) formId: string;
  @Prop({attribute: 'action'}) action?: string = undefined;
  @Prop({attribute: 'method'}) method?: string = "GET";

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
