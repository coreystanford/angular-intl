export interface MultipleTranslationResult {
  [key: string]: string
}

export type TranslationResult = MultipleTranslationResult | string;
