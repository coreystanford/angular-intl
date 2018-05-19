import { TranslateService } from '../translate.service';
import { TranslationLoaderServiceMock } from './translation-loader.service.mock';
import { async, TestBed } from '@angular/core/testing';
import { TranslateModule } from '../translate.module';

describe('Translate Service', () => {
  let translateService: TranslateService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()]
    });
    translateService = TestBed.get(TranslateService);
    translateService.translationLoaderService = TranslationLoaderServiceMock;
  }));

  test('should exist', () => expect(translateService).toBeDefined())

});
