import {Component, Host, h, Element, Prop, State, Event, Watch, EventEmitter, Listen, Method} from '@stencil/core';
import {FormDefinition, FormResult, UIInputElement, UIInputProps} from "../../ui/types";
import {clearHtmlInput} from "../../utils";
import {stringFormat} from "@tvenceslau/decorator-validation/lib";
import {CSS_SELECTORS} from "../../ui";
import {getFormDefinitionFromFields} from "../../utils/form";

enum SLOTS {
  BUTTONS = "buttons",
  FIELDS = "fields"
}

/**
 * Wrapper Form Component that handles all custom validation for components
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
   * Through this event action requests are made
   */
  @Event()
  submitEvent: EventEmitter<FormResult>;
  /**
   * Through this event action requests are made
   */
  @Event()
  resetEvent: EventEmitter;

  @Prop({attribute: 'form-definition'}) formDefinition?: string | FormDefinition;

  @Prop({attribute: 'form-id'}) formId: string;
  @Prop({attribute: 'action'}) action?: string;
  @Prop({attribute: 'method'}) method?: string = "GET";
  @Prop({attribute: 'input-prefix'}) inputPrefix?: string;

  private formCache: FormDefinition = undefined;

  private form:  FormDefinition = undefined;

  private formEl: HTMLFormElement = undefined;
  private needsReRender = true;

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
   * Lifecycle method
   *
   * After component has loaded, updates the form definition if required and bind the button event
   */
  async componentDidLoad(){
    if (!this.formCache)
      this.formCache = await getFormDefinitionFromFields(this.getInputs());
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
    console.log(evt);
    if (!name)
      name = evt.target.name;

    if (!this.formEl.checkValidity())
      return this.formEl.reportValidity();

    if (this.action !== undefined)
      return;

    evt.preventDefault();
    evt.stopImmediatePropagation();

    // const fields = this.form && !this.isModel ? this.form.fields : this.getInputs();
    //
    // const output = {};
    // fields.forEach(field => {
    //   const value = this.form && !this.isModel ? field.props.value : field.value;
    //   if (value)
    //     output[field.name] = value;
    // });
    //
    // console.log(`Form submitted. Result: `, output);
    // this.submit.emit({
    //   action: name,
    //   form: output
    // });
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
