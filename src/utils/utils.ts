import 'reflect-metadata';
import {getValidatorRegistry, ValidatorDefinition} from '@tvenceslau/decorator-validation/lib/validation';
import Validator from '@tvenceslau/decorator-validation/lib/validation/Validators/Validator';
import {UIKeys, ValidatableByAttribute, ValidatableByType, ValidityStateMatcher, ValidityStateMatcherType} from "../ui";
import {FormDefinition, InputDefinition, UIInputElement} from "../ui/types";
import {ValidationKeys} from "@tvenceslau/decorator-validation/lib";
import {getBrowserErrorMessage} from "../ui/render";

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

  const defaultEventHandler = function(this: UIInputElement, e): void{
    //do nothing
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
    await this.setCustomValidity('');
  }

  const changeEventHandler = async function(this: UIInputElement, e): Promise<void> {
    form.fields[this.inputName].props.value = e.target.value;
  }

  switch (event){
    case HTML5Events.CHANGE:
      return changeEventHandler.bind(element);
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
    nativeInput[nativeMethodKey] = getEventHandler(inputElement, evt, form);
  });
}

/**
 * Calls check validity on the native field
 *
 * @param {UIInputElement} inputElement the custom web component
 * @param {HTMLInputElement} nativeElement the native input element
 *
 * @function checkValidity
 *
 * @memberOf ui-decorators-web.utils
 */
export function checkValidity(inputElement, nativeElement) {
  return nativeElement.checkValidity.call(nativeElement);
}

/**
 * Calls check validity on the native field
 *
 * @param {UIInputElement} inputElement the custom web component
 * @param {HTMLInputElement} nativeElement the native input element
 *
 * @function reportValidity
 *
 * @memberOf ui-decorators-web.utils
 */
export function reportValidity(inputElement, nativeElement) {
  return nativeElement.reportValidity.call(nativeElement);
}

/**
 * Calls check validity on the native field
 *
 * @param {UIInputElement} inputElement the custom web component
 * @param {HTMLInputElement} nativeElement the native input element
 * @param {string} errors
 *
 * @function setCustomValidity
 *
 * @memberOf ui-decorators-web.utils
 */
export function setCustomValidity(inputElement, nativeElement, errors) {
  return nativeElement.setCustomValidity.call(nativeElement, errors);
}

/**
 * Calls check validity on the native field
 *
 * @param {HTMLInputElement} element the native input element
 * @returns {InputDefinition}
 *
 * @function getInputProps
 *
 * @memberOf ui-decorators-web.utils
 */
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
 *
 * @param {HTMLInputElement} element
 * @param {{}} inputDef
 * @param {FormDefinition} form
 * @param report
 *
 * @function performValidations
 *
 * @memberOf ui-decorators-web.utils
 */
export function performValidations(element: HTMLInputElement, inputDef: InputDefinition, form: FormDefinition, report = false){
  let customValidity: ValidityStateMatcherType = matchValidityState(element.validity) as ValidityStateMatcherType;
  console.log(`Custom validity matching for ${element.name}: ${customValidity}`);

  const validatorRegistry = getValidatorRegistry();

  const performCustomValidations = function(): string[] {
    return Object.keys(inputDef.validation).reduce((accum, key) => {
      const error = validatorRegistry.get(key).hasErrors(inputDef.props.value, ...inputDef.validation[key].args, inputDef.validation[key].message, form);
      if (error)
        accum.push(error);
      return accum;
    }, []);
  }

  const errors = performCustomValidations();

  if (errors.length)
    element.setCustomValidity(getBrowserErrorMessage(errors));

  if (report)
    element.reportValidity();
  return element.validity
}
