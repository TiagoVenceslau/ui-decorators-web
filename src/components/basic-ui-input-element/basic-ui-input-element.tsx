import {Component, Host, h, Method, Prop, Element, Event, EventEmitter} from '@stencil/core';
import {ValidationKeys} from "@tvenceslau/decorator-validation/lib";
import {UIInputElement} from "../../ui/types";
import {UIKeys} from "../../ui";
import {bindNativeInput, HTML5Events, prefixName} from "../../utils";

/**
 * Wrapper around basic HTML5 elements just to prove functionality
 *
 * @component BasicInputElement
 */
@Component({
  tag: 'basic-ui-input-element',
  styleUrl: 'basic-ui-input-element.css',
  shadow: false,
})
export class BasicUiInputElement implements UIInputElement{
  /**
   * Reference to the HTMLElement
   */
  @Element() element;
  /**
   *
   */
  @Prop({attribute: 'input-id'}) inputId: string;
  @Prop({attribute: 'input-name'}) inputName: string;

  @Prop({attribute: 'input-prefix'}) inputPrefix?: string = UIKeys.NAME_PREFIX;

  @Prop() label: string;
  @Prop() type: "text" | "number" | "date" | "email" | "url" = "text";
  @Prop({attribute: "value", mutable: true, reflect: true}) value: string;

  @Prop({attribute: "placeholder"}) placeholder?: string;

  @Prop() required: boolean | "true" | "false" = false;
  @Prop({attribute: "minlength"}) minlength?: number | string;
  @Prop({attribute: "min"}) min?: number | string;
  @Prop({attribute: "max"}) max?: number | string;
  @Prop({attribute: "step"}) step?: number | string;
  @Prop({attribute: "maxlength"}) maxlength?: number | string;
  @Prop({attribute: "pattern"}) pattern?: string;

  // Element Basic UI Events
  @Event()
  changeEvent: EventEmitter;
  @Event()
  inputEvent: EventEmitter;
  @Event()
  invalidEvent: EventEmitter;
  @Event()
  cutEvent: EventEmitter;
  @Event()
  copyEvent: EventEmitter;
  @Event()
  pasteEvent: EventEmitter;
  @Event()
  focusEvent: EventEmitter;
  @Event()
  blurEvent: EventEmitter;

  private nativeElement: HTMLInputElement;

  componentDidRender(){
    this.nativeElement = this.element.querySelector('input');
    bindNativeInput(this.nativeElement, this, ...Object.values(HTML5Events));
  }

  @Method()
  async getNativeElement(): Promise<HTMLInputElement> {
    return this.nativeElement;
  }

  private getInputProps(){
    const props = {};
    if (this.required && (this.required === 'true' || this.required === true))
      props[ValidationKeys.REQUIRED] = "true";
    if (this.minlength)
      props[ValidationKeys.MIN_LENGTH] = this.minlength;
    if (this.maxlength)
      props[ValidationKeys.MAX_LENGTH] = this.maxlength;
    if (this.min)
      props[ValidationKeys.MIN] = this.min;
    if (this.max)
      props[ValidationKeys.MAX] = this.max;
    if (this.step)
      props[ValidationKeys.STEP] = this.step;
    if (this.pattern)
      props[ValidationKeys.PATTERN] = this.pattern;
    if (this.placeholder)
      props['placeholder'] = this.placeholder;
    return props;
  }

  render() {
    return (
      <Host id={this.inputId}>
        <div class="input-wrapper">
          <label htmlfor={prefixName(this.inputId, this.inputPrefix)}>{this.label}</label>
          <input id={prefixName(this.inputId, this.inputPrefix)} name={prefixName(this.inputName, this.inputPrefix)} type={this.type} {...this.getInputProps()} value={this.value}/>
          <br/>
        </div>
      </Host>
    );
  }
}
