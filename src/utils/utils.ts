import 'reflect-metadata';
import {getValidatorRegistry, ValidatorDefinition} from '@tvenceslau/decorator-validation/lib/validation';
import Validator from '@tvenceslau/decorator-validation/lib/validation/Validators/Validator';
import {hasBeenBoundProp, UIKeys, ValidatableByAttribute, ValidatableByType} from "../ui";
import {UIInputElement} from "../ui/types";
import {EventEmitter} from "@stencil/core";
import {ValidationKeys} from "@tvenceslau/decorator-validation/lib";
import {Components} from "../components";
import FormValidateSubmit = Components.FormValidateSubmit;


export enum HTML5Events {
  INVALID = "Invalid",
  CHANGE = "Change",
  INPUT = "Input",
  CUT = "Cut",
  COPY = "Copy",
  PASTE = "Paste",
  FOCUS = "Focus",
  BLUR = "Blur"
}

/**
 * Adds the {@link UIKeys.NAME_PREFIX} to the name
 * @param {string} name
 * @param {string} [prefix]
 */
export function prefixName(name: string, prefix: string = UIKeys.NAME_PREFIX){
  return prefix + name;
}

/**
 * Selects the appropriate implementation of the event handler according to {@link HTML5Events}
 * @param element
 * @param event
 */
export function getEventHandler(element: UIInputElement, event: HTML5Events){

  const defaultEventHandler = function(this: UIInputElement, e): void{
    const evtName = event.toLowerCase() + "Event";
    if (!this[evtName])
      throw new Error(`Could not find ${event.toLowerCase()} event in ${this.constructor.name} webcomponent`);
    const eventEmitter: EventEmitter = this[evtName];
    eventEmitter.emit(e);
  }

  switch (event){
    default:
      return defaultEventHandler.bind(element);
  }
}

/**
 * For each 'Event' provided, the the native element has a 'on''event' and the element has a 'handle'Event'Event
 * Call this for each of the {@link HTML5Events} that the component you are using does not already provide (unless its a native component, them select them all)
 *
 * it will also bind the
 *
 * @param {HTMLInputElement} nativeInput the native input element
 * @param {HTMLElement} inputElement the custom web component
 * @param {HTML5Events} event
 *
 * @function bindNativeElement
 */
export function bindNativeInput(nativeInput: HTMLInputElement, inputElement: UIInputElement, ...event: HTML5Events[]){
  if (inputElement[hasBeenBoundProp])
    return;
  event = event.length ? event : Object.values(HTML5Events);
  event.forEach(evt => {
    const nativeMethodKey = 'on' + evt.toLowerCase();
    const methodKey = 'handle' + evt + "Event";
    Object.defineProperty(inputElement, methodKey, {
      enumerable: false,
      writable: false,
      configurable: false,
      value: getEventHandler(inputElement, evt)
    })
    if (inputElement[methodKey])
      nativeInput[nativeMethodKey] = inputElement[methodKey].bind(inputElement);
  });

  nativeInput.checkValidity = checkValidity(inputElement, nativeInput);
  nativeInput.reportValidity = reportValidity(inputElement, nativeInput);
  nativeInput.setCustomValidity = setCustomValidity(inputElement, nativeInput);

  Object.defineProperty(inputElement, hasBeenBoundProp, {
    writable: false,
    configurable: false,
    value: true
  })
}

export function buildFormDefinition(form: FormValidateSubmit, inputs: UIInputElement[]): void {
  // const definition: FormDefinition = {
  //   prefix: form.prefix || UIKeys.NAME_PREFIX,
  //   fields = form.getInputs
  // }
}

export function checkValidity(inputElement, nativeElement) {
  return function(){
    return nativeElement.checkValidity();
  }
}

export function reportValidity(inputElement, nativeElement) {
  return function(){
    return nativeElement.reportValidity();
  }
}

export function setCustomValidity(inputElement, nativeElement) {
  return async function(errors: string){
    return nativeElement.setCustomValidity(errors);
  }
}

export function getInputProps(element: HTMLInputElement){
  const props = {};
  // @ts-ignore
  if (element.required && (element.required === 'true' || element.required === true))
    props[ValidationKeys.REQUIRED] = "true";
  if (element["minlength"])
    props[ValidationKeys.MIN_LENGTH] = element["minlength"];
  if (element["maxlength"])
    props[ValidationKeys.MAX_LENGTH] = element["maxlength"];
  if (element.min)
    props[ValidationKeys.MIN] = element.min;
  if (element.max)
    props[ValidationKeys.MAX] = element.max;
  if (element.step)
    props[ValidationKeys.STEP] = element.step;
  if (element.pattern)
    props[ValidationKeys.PATTERN] = element.pattern;
  if (element.placeholder)
    props['placeholder'] = element.placeholder;
  if(element['subtype'])
    props['subtype'] = element['subtype'];
  return props;
}

/**
 * @param {UIInputElement} el
 *
 * @function clearHtmlInput
 *
 * @memberOf ui-decorators-web.utils
 */
export function clearHtmlInput(el: UIInputElement){
  el.value = '';
}

/**
 * Gets the validator definition from a UInput element
 * @param {UIInputElement} input
 * @return {ValidatorDefinition[]} a list with all the {@link ValidatorDefinition}s for all properties of the element
 *
 * @function getValidatorDefinition
 *
 * @memberOf ui-decorators-web.utils
 */
function getValidatorDefinition(input: UIInputElement) : ValidatorDefinition[]{
  const genValidatorDefinition = function(key: string, validator: {new(): Validator}) : ValidatorDefinition{
    return {
      validationKey: key,
      validator: validator
    }
  }

  const result: ValidatorDefinition[] = [];
  const fieldType = input[UIKeys.TYPE];
  if (fieldType in ValidatableByType)
    result.push(genValidatorDefinition(fieldType, ValidatableByType[fieldType]));

  for (let key in ValidatableByAttribute){
    const propValue = input[key];
    if (propValue !== undefined && propValue !== "")
      result.push(genValidatorDefinition(key, ValidatableByAttribute[key]));
  }

  return result;
}

/**
 * Registers the needed validators from an UInputElement in the Validator Registry
 * and return the definition
 *
 * @param {UIInputElement} element
 *
 * @function registerInputValidators
 * @return {ValidatorDefinition[]}
 *
 * @memberOf ui-decorators-web.utils
 */
export function registerInputValidators(element: UIInputElement): ValidatorDefinition[] {
  const validatorDef = getValidatorDefinition(element);
  getValidatorRegistry().register(...validatorDef);
  return validatorDef;
}

/**
 * @param {UIInputElement} element
 *
 * @function getInputValidators
 *
 * @memberOf ui-decorators-web.utils
 */
export function getInputValidators(element: UIInputElement){
  return getValidatorDefinition(element).reduce((accum: {[indexer: string]: Validator | undefined}, vd) => {
    accum[vd.validationKey] = getValidatorRegistry().get(vd.validationKey);
    return accum;
  }, {});
}


