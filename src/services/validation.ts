
import Validator from "@tvenceslau/decorator-validation/lib/validation/Validators/Validator";
import {Validators} from "@tvenceslau/decorator-validation/lib/validation";
import {getValidatorRegistry} from "@tvenceslau/decorator-validation/lib/validation";
import {ValidationKeys} from "@tvenceslau/decorator-validation/lib";
import {FormDefinition, InputDefinition} from "../ui/types";

/**
 * Supported Web validationKeys
 */
const webValidationKeys = {
  EQUALITY: 'equality'
}
// Add them to the original Validation Keys
Object.entries(webValidationKeys).forEach(([k, v]) => ValidationKeys[k] = v);

/**
 * Handles equality validation between fields
 *
 * @class EqualityValidator
 * @extends Validator
 *
 * @category Validators
 */
class EqualityValidator extends Validator {
  /**
   * @param {string} errorMessage
   */
  constructor(errorMessage = "This field must be equal to field {0}!") {
    super("equality", errorMessage);
  }

  /**
   * returns the error message, or nothing if is valid
   * @param value the value
   * @param {string} fieldName the pattern to validate
   * @param {string} [message] the error message
   * @param {FormDefinition} form the form object so we can compare the values
   * @return {string | undefined} the errors or nothing
   */
  hasErrors(value, fieldName, message: string, form: FormDefinition): string | undefined {

    const {fields, prefix} = form
    const el: InputDefinition = fields[fieldName]
    if (!el){
      console.log(`Could not find field ${fieldName} to perform equality validation. Assuming valid`);
      return;
    }
    if (fields[fieldName].props.value !== value)
      return this.getMessage(this.message, fieldName);
  }
}
