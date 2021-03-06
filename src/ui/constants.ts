import {ValidationKeys} from '@tvenceslau/decorator-validation/lib';
import RequiredValidator from '@tvenceslau/decorator-validation/lib/validation/Validators/RequiredValidator';
import EmailValidator from '@tvenceslau/decorator-validation/lib/validation/Validators/EmailValidator';
import MaxValidator from '@tvenceslau/decorator-validation/lib/validation/Validators/MaxValidator';
import MaxLengthValidator from '@tvenceslau/decorator-validation/lib/validation/Validators/MaxLengthValidator';
import MinValidator from '@tvenceslau/decorator-validation/lib/validation/Validators/MinValidator';
import MinLengthValidator from '@tvenceslau/decorator-validation/lib/validation/Validators/MinLengthValidator';
import URLValidator from "@tvenceslau/decorator-validation/lib/validation/Validators/URLValidator";
import PatternValidator from "@tvenceslau/decorator-validation/lib/validation/Validators/PatternValidator";
import Validator from "@tvenceslau/decorator-validation/lib/validation/Validators/Validator";
import StepValidator from '@tvenceslau/decorator-validation/lib/validation/Validators/StepValidator';
import DateValidator from '@tvenceslau/decorator-validation/lib/validation/Validators/DateValidator';

/**
 * @typedef ValidityStateMatcherType
 * @memberOf ui-decorators-web.ui
 */
export type ValidityStateMatcherType = {"tooShort": string, "typeMismatch": string, "stepMismatch": string, "rangeOverflow": string, /*badInput: undefined, customError: undefined,*/ "tooLong": string, "patternMismatch": string, "rangeUnderflow": string, "valueMissing": string}

/**
 * Does the match between the HTML5's ValidityState and the validators and input element type
 *
 * @enum UIKeys
 *
 * @memberOf ui-decorators-web.ui
 */
export const ValidityStateMatcher: ValidityStateMatcherType = {
    "patternMismatch": "pattern",
    "rangeOverflow": "max",
    "rangeUnderflow": "min",
    "stepMismatch": "step",
    "tooLong": "maxLength",
    "tooShort": "minLength",
    "typeMismatch": "email|URL",
    "valueMissing": "required"
}

/**
 * @enum CSS_SELECTORS
 *
 * @memberOf ui-decorators-web.ui
 */
export const CSS_SELECTORS: {[indexer: string]: string} = {
  INNER_SLOT_ITEMS: 'div[slot={0}] > *, slot-fb[name={0}] > *',
  SLOTS: 'div[slot={0}], slot-fb[name={0}]',
  NAMED_DIV: 'div[name={0}]',
  NAMED_ANY: '*[name={0}]'
}

/**
 * @enum UIKeys
 *
 * @memberOf ui-decorators-web.ui
 */
export const UIKeys = {
    REFLECT: 'model.ui.',
    ELEMENT: 'element',
    NAME: 'name',
    NAME_PREFIX: 'input-',

    TYPE: 'type',
    SUB_TYPE: 'subtype',

    REQUIRED: ValidationKeys.REQUIRED,
    MIN: ValidationKeys.MIN,
    MIN_LENGTH: ValidationKeys.MIN_LENGTH,
    MAX: ValidationKeys.MAX,
    MAX_LENGTH: ValidationKeys.MAX_LENGTH,
    PATTERN: ValidationKeys.PATTERN,
    URL: ValidationKeys.URL,
    STEP: ValidationKeys.STEP,
    DATE: ValidationKeys.DATE,
    EMAIL: ValidationKeys.EMAIL
}

/**
 * @constant ValidatableByType
 *
 * @memberOf ui-decorators-web.ui
 */
export const ValidatableByType: {[indexer: string] : {new(): Validator}} = [
    {validationKey: UIKeys.EMAIL, validator: EmailValidator},
    {validationKey: UIKeys.URL, validator: URLValidator},
    {validationKey: UIKeys.DATE, validator: DateValidator}
].reduce((accum, vd) => {
    // @ts-ignore
    accum[vd.validationKey] = vd.validator
    return accum;
}, {});

/**
 * @constant ValidatableByAttribute
 *
 * @memberOf ui-decorators-web.ui
 */
export const ValidatableByAttribute: {[indexer: string] : {new(): Validator}} = [
    {validationKey: UIKeys.REQUIRED, validator: RequiredValidator},
    {validationKey: UIKeys.MIN, validator: MinValidator},
    {validationKey: UIKeys.MAX, validator: MaxValidator},
    {validationKey: UIKeys.STEP, validator: StepValidator},
    {validationKey: ValidityStateMatcher.tooShort.toLowerCase(), validator: MinLengthValidator},
    {validationKey: ValidityStateMatcher.tooLong.toLowerCase(), validator: MaxLengthValidator},
    {validationKey: UIKeys.PATTERN, validator: PatternValidator},
].reduce((accum, vd) => {
    // @ts-ignore
    accum[vd.validationKey] = vd.validator
    return accum;
}, {});

export function convertAttributeNameToWeb(attName: string){
  switch (attName){
    case UIKeys.MAX_LENGTH:
      return "minLength";
    case UIKeys.MIN_LENGTH:
      return 'minLength';
    default:
      return attName;
  }
}

/**
 * @constant HTML5DateFormat
 *
 * @memberOf ui-decorators-web.ui
 */
export const HTML5DateFormat = 'yyyy-MM-dd';

/**
 * @constant HTML5InputTypes
 *
 * @memberOf ui-decorators-web.ui
 */
export const HTML5InputTypes = {
    TEXT: 'text',
    NUMBER: 'number',
    DATE: ValidationKeys.DATE,
    EMAIL: ValidationKeys.EMAIL,
    URL: ValidationKeys.URL
}
