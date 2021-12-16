import {Component, Host, h, Element, Prop, State, Event, Watch, EventEmitter, Listen} from '@stencil/core';
import {FormDefinition, FormResult, UIInputElement, UIInputProps} from "../../ui/types";
import {clearHtmlInput} from "../../utils";
import {stringFormat} from "@tvenceslau/decorator-validation/lib";
import {CSS_SELECTORS} from "../../ui";

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
  @Prop({attribute: 'action'}) action?: string = undefined;
  @Prop({attribute: 'method'}) method?: string = "GET";
  @Prop({attribute: 'input-prefix'}) inputPrefix?: string = undefined;

  @State() form: FormDefinition = undefined;

  private formEl: HTMLFormElement = undefined;

  async componentWillLoad(){
    if (this.formDefinition)
      await this.updateForm(this.formDefinition);
  }

  @Watch('formDefinition')
  async updateForm(newVal: string | FormDefinition) {
    switch(typeof newVal){
      case 'string':
        try {
          this.form = JSON.parse(newVal) as FormDefinition;
        } catch (e){
          this.form = undefined;
        }
        break;
      case 'object':
        if (newVal.fields && newVal.prefix){
          this.form = newVal as FormDefinition;
          break;
        }
      default:
        this.form = undefined;
    }
  }

  @Listen('changeEvent')
  @Listen('inputEvent')
  @Listen('focusEvent')
  @Listen('blurEvent')
  @Listen('copyEvent')
  @Listen('cutEvent')
  @Listen('pasteEvent')
  handleInputEvents(e){
    console.log(e)
  }

  private getInputs(){
    return this.element.querySelectorAll(stringFormat(CSS_SELECTORS.NAMED_SLOT, SLOTS.FIELDS));
  }

  private onReset(evt){
    evt.preventDefault()
    evt.stopImmediatePropagation();
    const inputs = this.getInputs()
    inputs.forEach(input => clearHtmlInput((input as unknown) as UIInputElement));
  }

  private onSubmit(evt, name?: string){
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
      return wrapInSlot(this.form.fields.map(field => this.renderInput(field.element, field.props)));
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
