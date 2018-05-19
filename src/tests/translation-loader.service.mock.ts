import { Observable } from 'rxjs/Observable';
import { TranslationLoaderService } from '../translation-loader.service';

const translations = {
  'default-en': {
    'BODY': {
      'WITH_KEY': 'With key text example'
    }
  }
};

export const TranslationLoaderServiceMock: TranslationLoaderService = {
  path: '/assets/language',
  extension: '.json',
  http: null,
  getFile: (key) => Observable.of(translations[key])
};
