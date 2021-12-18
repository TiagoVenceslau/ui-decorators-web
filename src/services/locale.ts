import {DEFAULT_ERROR_MESSAGES} from "@tvenceslau/decorator-validation/lib";

export interface TranslationService {
  get(key: string): string;
}

export class TranslationServiceImp implements TranslationService{
  get(key: string): string {
    return DEFAULT_ERROR_MESSAGES[key.replace(/([A-Z])/g, '_$1').toUpperCase()];
  }
}

let currentTranslationService: TranslationService;

export function getTranslationService(): TranslationService {
  if (!currentTranslationService)
    currentTranslationService = new TranslationServiceImp();
  return currentTranslationService;
}

export function setTranslationService(translationService: TranslationService): void {
  currentTranslationService = translationService;
}
