export interface UIInputProps {
  /**
   * The id of the wrapper component
   * Should be replicated to the inner component with an id prefix
   */
  inputId?: string;
  /**
   * The name of the 'form' submitting element. should be prefixed to avoid conflicts
   */
  inputName: string;
  /**
   * Value of the input field
   */
  value?: string;

  /**
   * type of the input field
   */
  type?: string;

  /**
   * To enable custom validators
   */
  subtype?: string;

  /**
   *
   */
  placeholder?: string;
  disabled?: boolean;

  /**
   * HTML5 validation Attributes
   */
  required?: boolean | "true" | "false";
  minlength?: string | number;
  maxlength?: string | number;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  pattern?: string;
}

export interface UIInputElement extends UIInputProps {
  inputPrefix?: string;

  /**
   * HTML5 validation methods. Will be bound via {@link bindNativeInput} during the 'componentWillLoad' lifecyle
   *
   * @function checkValidity
   *
   * <strong>must be defined as:</strong>
   *
   * @example
   * @method()
   * async checkValidity() {
   *  return checkValidity(this, this.nativeElement);
   * }
   */
  checkValidity();
  /**
   * HTML5 validation methods. Will be bound via {@link bindNativeInput} during the 'componentWillLoad' lifecyle
   *
   * @function reportValidity
   *
   * <strong>must be defined as:</strong>
   *
   * @example
   * @method()
   * async reportValidity() {
   *  return reportValidity(this, this.nativeElement);
   * }
   */
  reportValidity();
  /**
   * HTML5 validation methods. Will be bound via {@link bindNativeInput} during the 'componentWillLoad' lifecyle
   *
   * @param {string} errors
   *
   * @function reportValidity
   *
   * <strong>must be defined as:</strong>
   *
   * @example
   * @method()
   * async setCustomValidity(errors) {
   *  return setCustomValidity(this, this.nativeElement, errors);
   * }
   */
  setCustomValidity(errors: string);

  /**
   * Must return the native Element
   */
  getNativeElement(): Promise<HTMLInputElement>;
  /**
   * Must return value, in whatever format it has
   */
  getValue(): Promise<any>;
  /**
   * Must clear the value
   */
  reset(): Promise<void>;

  /**
   *
   * @function bindNativeEvents
   *
   * Must call:
   *
   * @example
   * async bindNativeEvents(form: FormDefinition) {
   *  return bindNativeInput(this.nativeElement, this, form);
   * }
   */
  bindNativeEvents(form: FormDefinition): Promise<void>;
}

export type InputDefinition = {
  element?: string,
  props: UIInputProps,
  validation?: {
    [indexer: string]: ValidatorDefinition,
  }
}

export type ValidatorDefinition = {
  args?: any[],
  message: string
}

export type FormDefinition = {
  prefix?: string,
  customValidation?: boolean,
  fields: {[indexer: string]: InputDefinition}
}

export type UIPropertyDecoratorDefinition = {
  prop: string | symbol,
  decorators: UIDecoratorDefinition[]
}

export type UIDecoratorDefinition = {
  key: string,
  props: UIElementDefinition
}

export type UIElementDefinition = {
  tag: string,
  props: {[indexer: string]: string,}
  ,
}

export type FormResult = {
  action: string,
  result?: {[indexer: string]: any}
};
