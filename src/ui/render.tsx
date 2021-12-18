import {setRenderStrategy, UIModel} from "@tvenceslau/ui-decorators/lib";
import {UIElementDefinition, UIPropertyDecoratorDefinition} from "./types";
import {formatDate, getPropertyDecorators, ValidationKeys} from "@tvenceslau/decorator-validation/lib";
import {HTML5DateFormat, UIKeys, ValidatableByAttribute} from "./constants";
import {h} from "@stencil/core";
import {detect} from "detect-browser";

/**
 * @typedef ValidationKeys
 * @memberOf ui-decorators-web.ui
 */
type ValidationsByKey = {
  [indexer: string]: {
    [indexer: string]: UIElementDefinition
  }[]
}

/**
 * @function formatByType
 *
 * @memberOf ui-decorators-web.ui
 */
const formatByType = function(type, value){
  switch (type) {
    case UIKeys.DATE:
      return formatDate(new Date(value), HTML5DateFormat);
    default:
      return value;
  }
}

/**
 * HTML5 Render Strategy
 *
 * @param {T} model the model to render in HTML5
 * @param {string} [mode]
 *
 * @function render
 *
 * @memberOf ui-decorators-web.ui
 */
export function render<T extends UIModel>(model: T, mode?: string){
  const validationProperties: UIPropertyDecoratorDefinition[] = [];
  const uiProperties: UIPropertyDecoratorDefinition[] = [];
  for (let prop in model)
    if (model.hasOwnProperty(prop)){
      const reflectProps = getPropertyDecorators(UIKeys.REFLECT, model, prop);
      const validProps = getPropertyDecorators(ValidationKeys.REFLECT, model, prop);
      if (reflectProps.decorators.length)
        uiProperties.push(reflectProps);
      if (validProps.decorators.length)
        validationProperties.push(validProps);
    }

  const validationsByType: ValidationsByKey = validationProperties.reduce((accum, vp) => {
    accum[vp.prop] = vp.decorators.reduce((ac, decorator) => {
      // @ts-ignore
      if (decorator.key in ValidatableByType && decorator.props.types && decorator.props.types.length)
      { // @ts-ignore
        ac[decorator.key] = jsTypesToHTMLType(decorator.props.types[0]); // always use the first defined type
      }
      return ac;
    }, {});
    return accum;
  }, {});

  const parseValueByKey = function(key, value, prop){
    if (!value)
      return value;

    switch(key){
      case ValidationKeys.PATTERN:
        const regexp = new RegExp(`^/(.+)/[gimuy]*$`, 'g');
        const match = regexp.exec(value);
        return match ? match[1] : match;
      case ValidationKeys.MIN:
      case ValidationKeys.MAX:
        if (prop in validationsByType)
          return formatByType(Object.keys(validationsByType[prop])[0], value);
      default:
        return value;
    }
  }

  const validationsByKey: ValidationsByKey = validationProperties.reduce((accum, vp) => {
    accum[vp.prop] = vp.decorators.reduce((ac, decorator) => {
      if (decorator.key in ValidatableByAttribute)
      { // @ts-ignore
        ac[decorator.key] = parseValueByKey(decorator.key, decorator.props.value, vp.prop) || 'true';
      }
      return ac;
    }, {});
    return accum;
  }, {});

  const html = uiProperties.map(uip => {
    const elementDecorator = uip.decorators.find(d => d.key === UIKeys.ELEMENT);
    if (!elementDecorator)
      return console.error(`Missing '@uielement' decorator in property ${uip.prop.toString()}`);
    const Tag = elementDecorator.props.tag
    let value = model[uip.prop.toString()];
    if (value && uip.prop in validationsByType)
      value = formatByType(Object.keys(validationsByType[uip.prop.toString()])[0], value);
    return (
      <Tag id={uip.prop.toString()} name={uip.prop.toString()} {...elementDecorator.props.props} {...(validationsByKey[uip.prop.toString()] || {})} value={value ? value.toString() : ''}></Tag>
  )
  });

  return html;
}

setRenderStrategy(render);

/**
 * Function type to trasnform the several errors messages in a single one each browser can represent properly
 * (due to the current error popups styling impossibilities presented by browsers)
 *
 * @typedef BrowserErrorWriter
 * @memberOf ui-decorators-web.ui
 */
export type BrowserErrorWriter = (errors: string[]) => string;

/**
 * {@link BrowserErrorWriter} for chrome (and the default one)
 * @param {string[]} errors
 *
 * @function chromeErrorWriter
 *
 * @see BrowserErrorWriter
 *
 * @memberOf ui-decorators-web.ui
 */
const chromeErrorWriter = (errors: string[]) => errors.join('\n');

/**
 * {@link BrowserErrorWriter} for firefox
 * @param {string[]} errors
 *
 * @function firefoxErrorWriter
 *
 * @see BrowserErrorWriter
 *
 * @memberOf ui-decorators-web.ui
 */
const firefoxErrorWriter = (errors: string[]) => errors.join(' | ');

/**
 * Uses the tiny 'detect-browser' package to customize the message appearance by browser
 * @param {string[]} errors
 *
 * @function getBrowserErrorMessage
 *
 * @see BrowserErrorWriter
 *
 * @memberOf ui-decorators-web.ui
 */
export function getBrowserErrorMessage(errors: string[]){
  const browser = detect();
  switch (browser && browser.name) {
    case 'firefox':
      return firefoxErrorWriter(errors);
    default:
      return chromeErrorWriter(errors);
  }
}



