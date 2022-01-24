import {Component, Element, h, Host, Method, Prop} from '@stencil/core';
import {FormDefinition, UIInputElement} from "../../ui/types";
import {bindNativeInput, checkValidity, reportValidity, setCustomValidity, prefixName} from "../../utils";
import {UIKeys} from "../../ui";
import {IonInput} from "@ionic/core/components/ion-input";
import { TextFieldTypes } from '@ionic/core';

/**
 * Wrapper around basic HTML5 elements just to demonstrate integration with other frameworks
 *
 * @implements UInputElement
 * @component IonicUiInputElement
 *
 * @example
 * <ionic-ui-input-element input-id={"id"}
 *                         input-name={"id"}
 *                         input-prefix={"input-"}
 *                         type={"text"}
 *                         placeholder={"place text here"}
 *                         label={"This is a label"}
 *                         required={true}
 *                         maxlength={15}
 *                         minlength={5}
 *                         pattern={"^\w+$"}
 * ></ionic-ui-input-element>
 */
@Component({
  tag: 'ionic-ui-input-element',
  styleUrl: 'ionic-ui-input-element.css',
  shadow: false,
})
export class IonicUiInputElement implements UIInputElement{
  /**
   * Reference to the its {@link HTMLElement}
   */
  @Element() element;
  /**
   * will translate to the form id attribute
   */
  @Prop({attribute: "input-id", mutable: false}) inputId: string;
  /**
   * will translate to the form name attribute
   */
  @Prop({attribute: "input-name", mutable: false}) inputName: string;
  /**
   * Will be used the prefix the fields names and ids to avoid conflicts with naive properties
   */
  @Prop({attribute: 'input-prefix'}) inputPrefix?: string = UIKeys.NAME_PREFIX;
  /**
   * The label text
   */
  @Prop({attribute: "label", mutable: false}) label?: string;
  /**
   * The field type
   */
  @Prop({attribute: "type", mutable: false}) type: TextFieldTypes;
  /**
   * value holding attribute
   */
  @Prop({attribute: "value", mutable: false}) value: string;
  /**
   * Placeholder attribute
   */
  @Prop({attribute: 'placeholder'}) placeholder?: string;
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
  @Prop() required: boolean = false;
  /**
   * defines the minimum accepted length
   */
  @Prop({attribute: "minlength"}) minlength?: number;
  /**
   * defines the minimum accepted value (inclusive)
   */
  @Prop({attribute: "min"}) min?: string;
  /**
   * defines the maximum accepted value (inclusive)
   */
  @Prop({attribute: "max"}) max?: string;
  /**
   * defined the accepted value step
   */
  @Prop({attribute: "step"}) step?: string;
  /**
   * defines the maximum accepted length
   */
  @Prop({attribute: "maxlength"}) maxlength?: number;
  /**
   * defines the accepted REGEXP pattern
   */
  @Prop({attribute: "pattern"}) pattern?: string;

  /**
   * Defines the Ionic label position
   */
  @Prop({attribute: "label-position"}) labelPosition: "fixed" | "floating" | "stacked" = "floating";
  /**
   * defines if the clear button shows
   */
  @Prop({attribute: "clear-input"}) clearInput: boolean;
  /**
   * defines the Ion-item lines
   */
  @Prop({attribute: "lines"}) lines: "inset" | "full" | "none" = "none";

  /**
   * Holds the reference to the inner native {@link HTMLInputElement}
   * @private
   */
  private nativeElement: HTMLInputElement;
  /**
   * Holds the reference to the inner  {@link IonInput}
   * @private
   */
  private ionElement: IonInput;

  /**
   * Stencil lifecycle method - Loads the component
   */
  async componentDidLoad(){
    this.ionElement = this.element.querySelector('ion-input');
    if (this.ionElement)
      this.nativeElement = await this.ionElement.getInputElement();
  }

  /**
   * Retrieves the native {@link HTMLInputElement}
   */
  @Method()
  async getNativeElement(): Promise<HTMLInputElement> {
    return await this.ionElement.getInputElement();
  }

  /**
   * Returns the field value
   */
  @Method()
  async getValue(): Promise<any> {
    console.log(`"reset`);
    return this.ionElement.value;
  }

  /**
   * Resets the field value
   */
  @Method()
  async reset(): Promise<void> {
    this.ionElement.value = '';
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
   * Stencil lifecycle method - Renders the component
   */
  render() {
    return (
      <Host id={prefixName(this.inputId)}>
        <ion-item lines={this.lines}>
          <ion-label position={this.labelPosition}>{this.label}</ion-label>
          <ion-input name={prefixName(this.inputName, this.inputPrefix)}
                     type={this.type}
                     placeholder={this.placeholder}
                     // @ts-ignore
                     subtype={this.subtype}

                     required={this.required}
                     max={this.max}
                     min={this.min}
                     maxlength={this.maxlength}
                     minlength={this.minlength}
                     pattern={this.pattern}
                     step={this.step}

                     value={this.value}
          ></ion-input>
        </ion-item>
      </Host>
    );
  }
}
