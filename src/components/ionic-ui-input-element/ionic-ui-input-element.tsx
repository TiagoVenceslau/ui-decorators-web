import {Component, Element, Event, EventEmitter, h, Host, Method, Prop} from '@stencil/core';
import {UIInputElement} from "../../ui/types";
import {bindNativeInput, HTML5Events, prefixName} from "../../utils";
import {UIKeys} from "../../ui";
import {IonInput} from "@ionic/core/components/ion-input";

@Component({
  tag: 'ionic-ui-input-element',
  styleUrl: 'ionic-ui-input-element.css',
  shadow: false,
})
export class IonicUiInputElement implements UIInputElement{

  @Element() element;

  // Element properties
  @Prop({attribute: "input-id", mutable: false}) inputId: string;
  @Prop({attribute: "input-name", mutable: false}) inputName: string;
  @Prop({attribute: 'input-prefix'}) inputPrefix?: string = UIKeys.NAME_PREFIX;
  @Prop({attribute: "disabled"}) disabled?: boolean;
  @Prop({attribute: 'placeholder'}) placeholder?: string;
  @Prop({attribute: "type", mutable: false}) type: string;
  @Prop({attribute: "value", mutable: false}) value: string;
  @Prop({attribute: "subtype", mutable: false}) subtype?: string;

  @Prop({attribute: "label", mutable: false}) label?: string;

  // Element Validation Properties
  @Prop({attribute: "required"}) required?: boolean | "true" | "false";
  @Prop({attribute: "max"}) max?: string | number;
  @Prop({attribute: "min"}) min?: string | number;
  @Prop({attribute: "maxlength"}) maxlength?: string | number;
  @Prop({attribute: "minlength"}) minlength?: string | number;
  @Prop({attribute: "pattern"}) pattern?: string;
  @Prop({attribute: "step"}) step?: string | number;

  // Element Basic UI Events
  @Event()
  changeEvent: EventEmitter;
  @Event()
  inputEvent: EventEmitter;
  @Event()
  focusEvent: EventEmitter;
  @Event()
  invalidEvent: EventEmitter;
  @Event()
  cutEvent: EventEmitter;
  @Event()
  copyEvent: EventEmitter;
  @Event()
  pasteEvent: EventEmitter;

  // Ionic custom properties
  @Prop({attribute: "label-position"}) labelPosition: "fixed" | "floating" | "stacked" = "floating";
  @Prop({attribute: "clear-input"}) clearInput: boolean;
  @Prop({attribute: "lines"}) lines: "inset" | "full" | "none" = "none";

  // Element Validation status
  readonly validationMessage: string;
  readonly validity: ValidityState;

  private nativeElement: HTMLInputElement;
  private ionElement: IonInput;

  async componentDidRender(){
    this.ionElement = this.element.querySelector('ion-input');
    if (this.ionElement){
      this.nativeElement = await this.ionElement.getInputElement();
      bindNativeInput(this.nativeElement, this, HTML5Events.INVALID, HTML5Events.COPY, HTML5Events.CUT, HTML5Events.PASTE);
    }
  }

  @Method()
  async getNativeElement(): Promise<HTMLInputElement> {
    return await this.ionElement.getInputElement();
  }

  handleChangeEvent(e){
    e.preventDefault();
    e.stopImmediatePropagation();
    this.changeEvent.emit(e);
  }

  handleFocusEvent(e){
    e.preventDefault();
    e.stopImmediatePropagation();
    this.focusEvent.emit(e);
  }

  handleBlurEvent(e){
    e.preventDefault();
    e.stopImmediatePropagation();
    this.focusEvent.emit(e);
  }

  handleInputEvent(e){
    e.preventDefault();
    e.stopImmediatePropagation();
    this.inputEvent.emit(e)
  }

  render() {
    return (
      <Host id={prefixName(this.inputId)}>
        <ion-item>
          <ion-label position={this.labelPosition} lines={this.lines}>{this.label}</ion-label>
          <ion-input name={prefixName(this.inputName, this.inputPrefix)}
                     type={this.type}
                     placeholder={this.placeholder}

                     subtype={this.subtype}

                     required={this.required}
                     max={this.max}
                     min={this.min}
                     maxlength={this.maxlength}
                     minlength={this.minlength}
                     pattern={this.pattern}
                     step={this.step}

                     value={this.value}

                     onIonChange={this.handleChangeEvent.bind(this)}
                     onIonFocus={this.handleFocusEvent.bind(this)}
                     onIonInput={this.handleInputEvent.bind(this)}
                     onIonBlur={this.handleBlurEvent.bind(this)}
          ></ion-input>
        </ion-item>
      </Host>
    );
  }
}
