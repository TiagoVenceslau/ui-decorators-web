import {Component, Host, h, Element, Prop, State, Event, Watch, EventEmitter, Listen, Method} from '@stencil/core';
import {FormDefinition, FormResult, InputDefinition, UIInputElement, UIInputProps} from "../../ui/types";
import {bindNativeInput, performValidations, registerInputValidators} from "../../utils";
import {stringFormat} from "@tvenceslau/decorator-validation/lib";
import {CSS_SELECTORS} from "../../ui";
import {getFormDefinitionFromFields} from "../../utils/form";
import {ValidatorRegistry} from "@tvenceslau/decorator-validation/lib/validation/ValidatorRegistry";

enum SLOTS {
  BUTTONS = "buttons",
  FIELDS = "fields"
}

/**
 * Wrapper Form Component that handles all custom validation for {@link UIInputElement} components.
 *  - binds all {@link UIInputElement}'s native inputs via {@link bindNativeInput}
 *    - this means all {@link HTML5Events} will be mapped to a default implementation, or if you '
 *      provide your own implementation by defining a 'handleXXXEvent(e)' method. This is useful when using custom
 *      components that already have some events mapped
 *  - Intercepts the field errors and translates them (if 'customValidations' is enabled);
 *  - When custom validation is enabled also validates according to all custom validation currently in the {@link ValidatorRegistry}
 *
 *  Does not use shadow dom.
 *
 * @component
 * @example
 * return (
 *  <form-validate-submit form-id={"formid"}>
 *    <basic-ui-input-element input-id={"id"}
 *                            input-name={"id"}
 *                            input-prefix={"input-"}
 *                            type={"text"}
 *                            placeholder={"place text here"}
 *                            label={"This is a label"}
 *                            required={"true"}
 *                            maxlength={"15"}
 *                            minlength={"5"}
 *                            pattern={"^w+$"}
 *    ></basic-ui-input-element>
 *  </form-validate-submit>
 * )
 */
@Component({
  tag: 'form-validate-submit',
  styleUrl: 'form-validate-submit.css',
  shadow: false,
})
export class FormValidateSubmit {
  @Element()
  public element: HTMLElement;

  /**
   * Event with the form data is raised if no form {@link action} is defined
   */
  @Event()
  submitEvent: EventEmitter<FormResult>;
  /**
   * Event is raised when the form is reset
   */
  @Event()
  resetEvent: EventEmitter;

  @Prop({attribute: 'form-definition'}) formDefinition?: string | FormDefinition;

  @Prop({attribute: 'form-id'}) formId: string;
  /**
   * Standard HTML Form action 'url to call'. When defined the form will perform the request with the normal form data.
   * Otherwise will raise a {@link submitEvent}
   */
  @Prop({attribute: 'form-action'}) action?: string;
  /**
   * HTML VERB. defaults to POST
   */
  @Prop({attribute: 'form-method'}) method?: "GET" | "POST" | "PUT" = "POST";
  /**
   * To avoid conflicts it's better to prefix id and names
   */
  @Prop({attribute: 'input-prefix'}) inputPrefix?: string;
  /**
   * Enables/disables custom validators and custom error messages
   */
  @Prop({attribute: 'custom-validation'}) customValidation: boolean = true;
  /**
   * Triggers field validation whenever it's value changes
   */
  @Prop({attribute: 'validate-on-change'}) validateOnChange: boolean = false;

  private formCache: FormDefinition = undefined;
  private formEl: HTMLFormElement = undefined;

  @State() form: FormDefinition = undefined;


  /**
   * Lifecycle method
   *
   * Loads/parses the provided form-definition on load
   */
  async componentWillLoad(){
    if (this.formDefinition)
      await this.updateFormCache(this.formDefinition);
    this.formEl = this.element.querySelector(`form[id="${this.formId}"]`);
  }

  /**
   * Lifecycle method
   *
   * After component has loaded, updates the form definition if required and bind the button event
   */
  async componentDidLoad(){
    const inputs = this.getInputs();
    if (!this.formCache)
      this.formCache = await getFormDefinitionFromFields(inputs);
    this.formCache.prefix = this.inputPrefix;
    this.formCache.customValidation = true;
    const self = this;
    const bindingPromises = inputs.map(async (i) => await i.bindNativeEvents(self.formCache));
    await Promise.all(bindingPromises);
    inputs.forEach(registerInputValidators);
  }

  @Watch('formDefinition')
  async updateFormCache(newVal: string | FormDefinition) {
    switch(typeof newVal){
      case 'string':
        try {
          this.formCache = JSON.parse(newVal) as FormDefinition;
        } catch (e){
          this.formCache = undefined;
        }
        break;
      case 'object':
        if (newVal.fields){
          this.formCache = newVal as FormDefinition;
          break;
        }
      default:
        this.formCache = undefined;
    }

    this.form = JSON.parse(JSON.stringify(this.formCache));
  }

  @Listen('changeEvent')
  async handleInputEvents(e){
    e.preventDefault();
    e.stopImmediatePropagation();
    const input: UIInputElement = e.target;
    const value = await input.getValue();
    this.formCache.fields[input.inputName].props.value = value;
    console.log(`Value for field ${input.inputName} was updated to ${value}`);
  }

  private getInputs(): UIInputElement[] {
    // @ts-ignore
    return Array.from(this.element.querySelectorAll(stringFormat(CSS_SELECTORS.INNER_SLOT_ITEMS, SLOTS.FIELDS))) as UIInputElement[];
  }

  private async onReset(evt){
    evt.preventDefault()
    evt.stopImmediatePropagation();
    console.log(evt);
    const inputs = this.getInputs()
    await Promise.all(inputs.map(async (input) => await input.reset()));
  }

  private onSubmit(evt, name?: string){
    if (!this.formEl.checkValidity())
      return this.formEl.reportValidity();

    if (this.action !== undefined)
      return;

    evt.preventDefault();
    evt.stopImmediatePropagation();

    const output: {[indexer: string]: any} = Object.entries(this.formCache.fields).reduce((accum, [key, fieldDef]) => {
      accum[key] = fieldDef.props ? fieldDef.props.value : undefined;
      return accum;
    }, {})

    console.log(`Form submitted. Result: `, output);
    this.submitEvent.emit({
      action: name,
      result: output
    });
  }

  private getButtons(){
    return (
      <slot name={SLOTS.BUTTONS}>
        <br/>
        <button type="reset" name="reset">Reset</button>
        <button type="submit" name="submit">Submit</button>
      </slot>
    )
  }

  private renderInput(tag: string, inputProps: UIInputProps){
    const Tag = tag;
    return (
      <Tag {...inputProps}></Tag>
    )
  }

  private getForm(){
    const wrapInSlot = function(content?){
      return (
        <slot name={SLOTS.FIELDS}>
          {content || ''}
        </slot>
      );
    }

    if (this.form)
      return wrapInSlot(Object.values(this.form.fields).map(field => this.renderInput(field.element, field.props)));
    return wrapInSlot();
  }

  private getFormProps(){
    if (!this.action)
      return {};
    return {
      action: this.action,
      method: this.method
    }
  }

  render() {
    return (
      <Host>
        <form id={this.formId} class="form-validate-submit"
              {...this.getFormProps()}
              onSubmit={this.onSubmit.bind(this)}
              onReset={this.onReset.bind(this)}>
          {this.getForm()}
          {this.getButtons()}
        </form>
      </Host>
    );
  }
}
