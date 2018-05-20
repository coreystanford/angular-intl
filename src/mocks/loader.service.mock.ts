import { Observable } from 'rxjs/Observable';
import { LoaderService } from '../loader.service';

import 'rxjs/add/observable/of';

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
  getFile: (key) => Observable.of(translations[key])
};
