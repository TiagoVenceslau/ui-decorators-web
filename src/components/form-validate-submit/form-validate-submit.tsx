import {Component, Host, h, Element, Prop, State, Event, Watch, EventEmitter, Listen, Method} from '@stencil/core';
import {FormDefinition, FormResult, InputDefinition, UIInputElement, UIInputProps} from "../../ui/types";
import {bindNativeInput, registerInputValidators} from "../../utils";
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
   * @event submitEvent
   */
  @Event()
  submitEvent: EventEmitter<FormResult>;
  /**
   * Event is raised when the form is reset
   *
   * @event resetEvent
   */
  @Event()
  resetEvent: EventEmitter;

  /**
   * The form definition according to {@link FormDefinition} in string or object format.
   * If none is provided, the HTML content will be displayed
   */
  @Prop({attribute: 'form-definition'}) formDefinition?: string | FormDefinition;

  /**
   * Translates to the inner form's id attribute
   */
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

  /**
   * Cached {@link FormDefinition}. Stores the updated values of the form (updated on fields change event)
   * and the {@link InputDefinition}s
   *
   * used as a buffer to {@state form} to prevent double rendering
   * @private
   */
  private formCache: FormDefinition = undefined;
  /**
   * Stores a reference to the inner {@link HTMLFormElement}
   * @private
   */
  private formEl: HTMLFormElement = undefined;
  /**
   * Holds the rendered data, when a form definition is used
   */
  @State() form: FormDefinition = undefined;


  /**
   * Lifecycle method
   *
   * Loads/parses the provided form-definition on load
   */
  async componentWillLoad(){
    if (this.formDefinition)
      await this.updateFormCache(this.formDefinition);
  }

  /**
   * Stencil lifecycle method - Loads the component
   *
   * After component has loaded, updates the form definition if required and bind the button event
   */
  async componentDidLoad(){
    this.formEl = this.element.querySelector(`form[id="${this.formId}"]`);
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

  /**
   * Updates the formCache and render upon change of the {@link FormDefinition} after parsing it from JSON if required
   * @param {string | FormDefinition} newVal
   */
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

  /**
   * Retrieves all {@link UIInputElement}s
   * @private
   */
  private getInputs(): UIInputElement[] {
    // @ts-ignore
    return Array.from(this.element.querySelectorAll(stringFormat(CSS_SELECTORS.INNER_SLOT_ITEMS, SLOTS.FIELDS))) as UIInputElement[];
  }

  /**
   * Resets the form
   *
   * @param {any} evt
   * @private
   */
  private async onReset(evt){
    evt.preventDefault()
    evt.stopImmediatePropagation();
    console.log(evt);
    const inputs = this.getInputs()
    await Promise.all(inputs.map(async (input) => await input.reset()));
  }

  /**
   * Handles form submission, eith via request or event
   *
   * @param {any} evt
   * @param {string} [name] name of the emitter of the event
   * @private
   */
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

  /**
   * Renders the {@link SLOTS.BUTTONS} slot
   * @private
   */
  private getButtons(){
    return (
      <slot name={SLOTS.BUTTONS}>
        <br/>
        <button type="reset" name="reset">Reset</button>
        <button type="submit" name="submit">Submit</button>
      </slot>
    )
  }

  /**
   * Renders an input according to it's tag and atributes
   * @param {string} tag element html tag name
   * @param {UIInputProps} inputProps
   * @private
   */
  private renderInput(tag: string, inputProps: UIInputProps){
    const Tag = tag;
    return (
      <Tag {...inputProps}></Tag>
    )
  }

  /**
   * Renders the {@link SLOTS.FIELDS} slot
   * @private
   */
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

  /**
   * Retrieves the form props to send in the response
   * @private
   */
  private getFormProps(){
    if (!this.action)
      return {};
    return {
      action: this.action,
      method: this.method
    }
  }

  /**
   * Stencil lifecycle method - Renders the component
   */
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
