import {FormDefinition, UIInputElement, UIInputProps, ValidatorDefinition} from "../ui/types";
import {convertAttributeNameToWeb, UIKeys, ValidatableByAttribute, ValidatableByType} from "../ui";
import {DEFAULT_ERROR_MESSAGES, ValidationKeys} from "@tvenceslau/decorator-validation/lib";
import {getTranslationService} from "../services/locale";

export async function getFormDefinitionFromFields(fields: UIInputElement[]): Promise<FormDefinition> {

  function getValidatorDefinition(field: HTMLInputElement): {[indexer: string]: ValidatorDefinition}{
    const accumulator: {[indexer: string]: ValidatorDefinition} = {};

    const genValidatorDefinition = function(key: string, message?: string, ...args: any[]): void {
      if (key === ValidationKeys.REQUIRED)
        args = [];
      accumulator[key]= {
        args: args,
        message: message
      }
    }

    const fieldType = field[UIKeys.TYPE];
    if (fieldType in ValidatableByType)
      genValidatorDefinition(fieldType, DEFAULT_ERROR_MESSAGES.TYPE);

    const fieldSubType = field[UIKeys.SUB_TYPE];
    if (fieldSubType)
      genValidatorDefinition(fieldSubType);

    for (let key in ValidatableByAttribute){
      const propValue = field[convertAttributeNameToWeb(key)];
      if (propValue !== undefined && propValue !== "")
        genValidatorDefinition(key, getTranslationService().get(convertAttributeNameToWeb(key)), propValue);
    }

    return accumulator;
  }

  function getFieldProps(nativeField: HTMLInputElement){
    const possible = Object.values(ValidationKeys);
    return Object.values(nativeField.attributes).reduce((accum, el) => {
      const attName = el.nodeName;
      if (possible.indexOf(attName) !== -1)
        accum[attName] = el.nodeValue
      return accum;
    }, {}) as UIInputProps
  }

  const fieldPromises = fields.map(async (f) => {
    const native = await f.getNativeElement();
    return {
      name: native.name.replace(f.inputPrefix, ''),
      element: (f as unknown as Element).tagName.toLowerCase(),
      props: getFieldProps(native),
      validation: getValidatorDefinition(native)
    }
  })

  const definitions = await Promise.all(fieldPromises);
  return {
    fields: definitions.reduce((accum, def) => {
      accum[def.name] = {
        element: def.element,
        props: def.props,
        validation: def.validation
      }
      return accum;
    }, {})
  };
}
