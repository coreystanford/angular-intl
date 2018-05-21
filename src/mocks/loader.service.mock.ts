import { of } from 'rxjs';
import { LoaderService } from '../loader.service';

export const translations = {
  'default-en': {
    'BODY': {
      'KNOWN_KEY': 'Known key example'
    }
  }
};

export const LoaderServiceMock: LoaderService = {
  path: '/assets/language',
  extension: '.json',
  http: null,
  config: null,
  getFile: (key) => of(translations[key])
};
