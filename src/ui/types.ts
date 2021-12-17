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

  /**
   * HTML5 input events
   */
  changeEvent?;
  inputEvent?;
  invalidEvent?;

  cutEvent?;
  copyEvent?;
  pasteEvent?;

  /**
   * Will be bound via {@link bindNativeInput} during the 'componentWillLoad' lifecyle
   * @param e
   */
  handleChangeEvent?(e): void;
  handleInputEvent?(e): void;
  handleInvalidEvent?(e): void;
  handleCutEvent?(e): void;
  handleCopyEvent?(e): void;
  handlePasteEvent?(e): void;
  handleBlurEvent?(e): void;
  handleFocusEvent?(e): void;

  /**
   * HTML5 validation props
   */
  readonly validity?: ValidityState;
  readonly validationMessage?: string;

  /**
   * HTML5 validation methods. Will be bound via {@link bindNativeInput} during the 'componentWillLoad' lifecyle
   */
  checkValidity?();
  reportValidity?();
  setCustomValidity?(errors: string);

  /**
   * Must return the native Element
   */
  getNativeElement(): Promise<HTMLInputElement>;
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
  fields: InputDefinition[]
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
