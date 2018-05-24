import { Component, ElementRef, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '../translate.service';
import { TranslateModule } from '../translate.module';
import { LoaderServiceMock, translations } from '../mocks/loader.service.mock';

@Component({
  template: `
    <p #knownKey>{{ 'BODY.KNOWN_KEY' | translate }}</p>
    <p #unknownKey>{{ 'BODY.UNKNOWN_KEY' | translate }}</p>
    <p #noKey>{{ '' | translate }}</p>
  `
})
class TranslatePipeSpecComponent {
  @ViewChild('knownKey') knownKey: ElementRef;
  @ViewChild('unknownKey') unknownKey: ElementRef;
  @ViewChild('noKey') noKey: ElementRef;
}

describe('Translate Pipe', () => {
  let component: TranslatePipeSpecComponent;
  let fixture: ComponentFixture<TranslatePipeSpecComponent>;
  let translateService: TranslateService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [TranslatePipeSpecComponent]
    });
    translateService = TestBed.get(TranslateService);
    translateService.loaderService = LoaderServiceMock;
    fixture = TestBed.createComponent(TranslatePipeSpecComponent);
    component = fixture.componentInstance;
  }));

  test('should exist', () => {
    expect(component).toBeDefined();
  });

  describe('setDefault to default-en', () => {

    const fileName = 'default-en';

    beforeEach(() => {
      translateService.setDefault(fileName);
      fixture.detectChanges();
    });

    test('an element with a known key loads the value', () => {
      const expectedText = translations[fileName].BODY.KNOWN_KEY;
      const resultText = component.knownKey.nativeElement.innerHTML;
      expect(resultText).toEqual(expectedText);
    });

    test('an element with an unknown key loads the original key', () => {
      const expectedText = 'BODY.UNKNOWN_KEY';
      const resultText = component.unknownKey.nativeElement.innerHTML;
      expect(resultText).toEqual(expectedText);
    });

    test('an element without a key loads an empty string', () => {
      const expectedText = '';
      const resultText = component.noKey.nativeElement.innerHTML;
      expect(resultText).toEqual(expectedText);
    });

  })

});
