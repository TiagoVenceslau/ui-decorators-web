import {DEFAULT_ERROR_MESSAGES} from "@tvenceslau/decorator-validation/lib";

/**
 * @interface TranslationService
 */
export interface TranslationService {
  /**
   * Retrieves a localized string by eky
   * @param {string} key
   * @return {string}
   */
  get(key: string): string;
}

/**
 * A simple translation service implementation
 *
 * @class TranslationServiceImp
 * @implements TranslationService
 */
export class TranslationServiceImp implements TranslationService {
  get(key: string): string {
    return DEFAULT_ERROR_MESSAGES[key.replace(/([A-Z])/g, '_$1').toUpperCase()];
  }
}

let currentTranslationService: TranslationService;

/**
 * Retrieves the action {@link TranslationService}
 *
 * @memberOf ui-decorators-web.services
 */
export function getTranslationService(): TranslationService {
  if (!currentTranslationService)
    currentTranslationService = new TranslationServiceImp();
  return currentTranslationService;
}

/**
 * sets the acting {@link TranslationService}
 *
 * @memberOf ui-decorators-web.services
 */
export function setTranslationService(translationService: TranslationService): void {
  currentTranslationService = translationService;
}
