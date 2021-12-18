import {Component, Host, h, Method, Prop, Element} from '@stencil/core';
import {ValidationKeys} from "@tvenceslau/decorator-validation/lib";
import {FormDefinition, UIInputElement} from "../../ui/types";
import {UIKeys} from "../../ui";
import {bindNativeInput, checkValidity, reportValidity, setCustomValidity, prefixName} from "../../utils";

/**
 * Wrapper around basic HTML5 elements just to demonstrate functionality
 *
 * @implements UIInputElement
 * @component BasicInputElement
 *
 * @example
 * <basic-ui-input-element input-id={"id"}
 *                         input-name={"id"}
 *                         input-prefix={"input-"}
 *                         type={"text"}
 *                         placeholder={"place text here"}
 *                         label={"This is a label"}
 *                         required={"true"}
 *                         maxlength={"15"}
 *                         minlength={"5"}
 *                         pattern={"^\w+$"}
 * ></basic-ui-input-element>
 */
@Component({
  tag: 'basic-ui-input-element',
  styleUrl: 'basic-ui-input-element.css',
  shadow: false,
})
export class BasicUiInputElement implements UIInputElement{
  /**
   * Reference to the its {@link HTMLElement}
   */
  @Element() element;
  /**
   * will translate to the form id attribute
   */
  @Prop({attribute: 'input-id'}) inputId: string;
  /**
   * will translate to the form name attribute
   */
  @Prop({attribute: 'input-name'}) inputName: string;
  /**
   * Will be used the prefix the fields names and ids to avoid conflicts with naive properties
   */
  @Prop({attribute: 'input-prefix'}) inputPrefix?: string = UIKeys.NAME_PREFIX;
  /**
   * The label text
   */
  @Prop() label: string;
  /**
   * The field type
   */
  @Prop() type: "text" | "number" | "date" | "email" | "url" = "text";
  /**
   * value holding attribute
   */
  @Prop({attribute: "value", mutable: true, reflect: true}) value: string;
  /**
   * Placeholder attribute
   */
  @Prop({attribute: "placeholder"}) placeholder?: string;
  /**
   * Subtype attribute. used for custom validation
   */
  @Prop({attribute: "subtype", mutable: false}) subtype?: string;
  /**
   * sets the field as disabled
   */
  @Prop({attribute: "disabled"}) disabled?: boolean;


  /**
   * Sets the field as required when set to true
   */
  @Prop() required: boolean | "true" | "false" = false;
  /**
   * defines the minimum accepted length
   */
  @Prop({attribute: "minlength"}) minlength?: number | string;
  /**
   * defines the minimum accepted value (inclusive)
   */
  @Prop({attribute: "min"}) min?: number | string;
  /**
   * defines the maximum accepted value (inclusive)
   */
  @Prop({attribute: "max"}) max?: number | string;
  /**
   * defined the accepted value step
   */
  @Prop({attribute: "step"}) step?: number | string;
  /**
   * defines the maximum accepted length
   */
  @Prop({attribute: "maxlength"}) maxlength?: number | string;
  /**
   * defines the accepted REGEXP pattern
   */
  @Prop({attribute: "pattern"}) pattern?: string;

  /**
   * Holds the reference to the inner native {@link HTMLInputElement}
   * @private
   */
  private nativeElement: HTMLInputElement;

  /**
   * Stencil lifecycle method - Loads the component
   */
  componentDidLoad(){
    this.nativeElement = this.element.querySelector('input');
  }

  /**
   * Retrieves the native {@link HTMLInputElement}
   */
  @Method()
  async getNativeElement(): Promise<HTMLInputElement> {
    return this.nativeElement;
  }

  /**
   * Returns the field value
   */
  @Method()
  async getValue(): Promise<any> {
    return this.nativeElement.value;
  }

  /**
   * Resets the field value
   */
  @Method()
  async reset(): Promise<void> {
    this.nativeElement.value = '';
  }

  /**
   * @see UIInputElement#checkValidity
   * @see HTMLInputElement#checkValidity
   */
  @Method()
  async checkValidity() {
    return checkValidity(this, this.nativeElement);
  }

  /**
   * @see UIInputElement#reportValidity
   * @see HTMLInputElement#reportValidity
   */
  @Method()
  async reportValidity() {
    return reportValidity(this, this.nativeElement);
  }

  /**
   * @see UIInputElement#setCustomValidity
   * @see HTMLInputElement#setCustomValidity
   */
  @Method()
  async setCustomValidity(errors: string) {
    return setCustomValidity(this, this.nativeElement, errors);
  }

  /**
   *
   * @param {FormDefinition} form
   * @see UIInputElement#bindNativeEvents
   */
  @Method()
  async bindNativeEvents(form: FormDefinition) {
    bindNativeInput(this.nativeElement, this, form);
  }

  /**
   * Retrieves the input props
   * @private
   */
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

  /**
   * Stencil lifecycle method - Renders the component
   */
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
