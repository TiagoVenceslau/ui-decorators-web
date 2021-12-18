import 'reflect-metadata';
import {getValidatorRegistry, ValidatorDefinition} from '@tvenceslau/decorator-validation/lib/validation';
import Validator from '@tvenceslau/decorator-validation/lib/validation/Validators/Validator';
import {UIKeys, ValidatableByAttribute, ValidatableByType, ValidityStateMatcher, ValidityStateMatcherType} from "../ui";
import {FormDefinition, InputDefinition, UIInputElement} from "../ui/types";
import {EventEmitter} from "@stencil/core";
import {stringFormat, ValidationKeys} from "@tvenceslau/decorator-validation/lib";
import {getTranslationService} from "../services/locale";

/**
 * @enum HTML5Events
 */
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
 *
 * @function prefixName
 *
 * @memberOf ui-decorators-web.utils
 */
export function prefixName(name: string, prefix: string = UIKeys.NAME_PREFIX){
  return prefix + name;
}

/**
 * Selects the appropriate implementation of the event handler according to {@link HTML5Events}
 * @param {UIInputElement} element
 * @param {string} event on of {@link HTML5Events}
 * @param {FormDefinition} form
 *
 * @function getEventHandler
 *
 * @memberOf ui-decorators-web.utils
 */
export function getEventHandler(element: UIInputElement, event: HTML5Events, form: FormDefinition){
  const evtName = event.toLowerCase() + "Event";
  if (!element[evtName])
    throw new Error(`Could not find ${event.toLowerCase()} event in ${element.constructor.name} webcomponent`);
  const eventEmitter: EventEmitter = element[evtName];

  const defaultEventHandler = function(this: UIInputElement, e): void{
    eventEmitter.emit(e);
  }

  const invalidEventHandler = function(this: UIInputElement, e): void {
    if (!form.customValidation)
      return;

    const name = e.target.name.substring(this.inputPrefix.length);
    const inputDef: InputDefinition = form.fields[name];
    const nativeInput = e.target;
    performValidations(nativeInput, inputDef, form);
  }

  const inputEventHandler = async function(this: UIInputElement, e): Promise<void> {
    e.preventDefault();
    e.stopImmediatePropagation();
    await this.setCustomValidity('');
    eventEmitter.emit(e);
  }

  switch (event){
    case HTML5Events.INPUT:
      return inputEventHandler.bind(element);
    case HTML5Events.INVALID:
      return invalidEventHandler.bind(element);
    default:
      return defaultEventHandler.bind(element);
  }
}

/**
 * For each of {@link HTML5Events}, the the native element has a 'on''event' and the element has a 'handle'Event'Event
 * Call this for each of the {@link HTML5Events} that the component you are using does not already provide (unless its a native component, them select them all)
 *
 * it will also bind the
 *
 * @param {HTMLInputElement} nativeInput the native input element
 * @param {HTMLElement} inputElement the custom web component
 * @param {FormDefinition} form
 *
 * @function bindNativeElement
 *
 * @memberOf ui-decorators-web.utils
 */
export function bindNativeInput(nativeInput: HTMLInputElement, inputElement: UIInputElement, form: FormDefinition){
  Object.values(HTML5Events).forEach(evt => {
    const nativeMethodKey = 'on' + evt.toLowerCase();
    const methodKey = 'handle' + evt + "Event";
    if (!inputElement[methodKey])
      Object.defineProperty(inputElement, methodKey, {
        enumerable: false,
        writable: false,
        configurable: false,
        value: getEventHandler(inputElement, evt, form)
      })
    nativeInput[nativeMethodKey] = inputElement[methodKey].bind(inputElement);
  });
}

export function checkValidity(inputElement, nativeElement) {
  return nativeElement.checkValidity.call(nativeElement);
}

export function reportValidity(inputElement, nativeElement) {
  return nativeElement.reportValidity.call(nativeElement);
}

export function setCustomValidity(inputElement, nativeElement, errors) {
  return nativeElement.setCustomValidity.call(nativeElement, errors);
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

/**
 * Does the matching between the fields validity params and the field's properties (type/subtype)
 *
 * @param {ValidityState | ValidityStateMatcherType | string} validityState
 * @return {string | undefined}
 *
 * @function matchValidityState
 *
 * @memberOf ui-decorators-web.utils
 */
export const matchValidityState = function(validityState: ValidityState | ValidityStateMatcherType | string = ValidityStateMatcher): string | undefined | ValidityStateMatcherType{
  if (typeof validityState === 'string'){
    if (!(validityState in ValidityStateMatcher))
      return;
    return ValidityStateMatcher[validityState];
  } else {
    const result: any = {};
    let prop: string;
    for(prop in validityState)
      if (ValidityStateMatcher.hasOwnProperty(prop))
        result[ValidityStateMatcher[prop]] = validityState[prop];

    return result;
  }
}

/**
 * Creates a concatenated translated Error message to display the user
 *
 * @param {FormDefinition} form
 * @param {{}} invalids
 * @param {any} value
 * @return {string} the error message
 *
 * @function createErrorMessage
 *
 * @memberOf ui-decorators-web.utils
 */
const createErrorMessage = function(form: FormDefinition, invalids: {[indexer: string]: string}, value: any){
  const ts = getTranslationService();
  return Object.keys(invalids).map(key => stringFormat(ts.get(key), value)).join('\n');
}

/**
 * Sets the default HTML5 errors messages to what was defined by the user
 *
 * @param {ValidityStateMatcherType} customValidity
 * @param {FormDefinition} form
 * @param {any} value
 * @return {string | undefined}
 *
 * @function checkMessageTranslations
 *
 * @memberOf ui-decorators-web.utils
 */
const checkMessageTranslations = function(customValidity: ValidityStateMatcherType, form: FormDefinition, value: any): string | undefined{
  const invalids: {[indexer: string]: string} = Object.keys(customValidity).reduce((accum: {}, key: string) => {
    if (customValidity[key]){
      accum = accum || {};
      accum[key] = customValidity[key];
    }
    return accum;
  }, undefined)
  if (invalids)
    return createErrorMessage(form, invalids, value);
  console.log(`Field is valid`);
}

/**
 *
 * @param {HTMLInputElement} element
 * @param {{[indexer: string]: {}}} inputDef
 * @param {FormDefinition} form
 * @param report
 *
 * @function performValidations
 *
 * @memberOf ui-decorators-web.utils
 */
export function performValidations(element: HTMLInputElement, inputDef: InputDefinition, form: FormDefinition, report = false){
  let hasErrors = !element.validity.valid;
  let customValidity: ValidityStateMatcherType = matchValidityState(element.validity) as ValidityStateMatcherType;
  console.log(`Custom validity matching for ${element.name}: ${customValidity}`);

  const validatorRegistry = getValidatorRegistry();

  const performCustomValidations = function(customValidity): ValidityStateMatcherType{
    return Object.keys(inputDef.validation).reduce((accum, key) => {
      const error = validatorRegistry.get(key).hasErrors(inputDef.props.value, inputDef.validation[key].message, ...inputDef.validation[key].args, form);
      accum[key] = !!error;
      return accum;
    }, customValidity);
  }

  if (form.customValidation){
    customValidity = performCustomValidations(customValidity);
    console.log(`Custom validity updated with custom validators for ${element.name}: ${customValidity}`);
  }

  const errors = checkMessageTranslations(customValidity, form, inputDef.props.value);
  if (errors){
    console.log(`Custom Errors found: ${errors}`);
    hasErrors = true;
    element.setCustomValidity(errors);
  }

  if (report)
    element.reportValidity();
  return element.validity
}
