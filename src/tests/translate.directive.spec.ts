import { Component, ElementRef, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '../translate.service';
import { TranslateModule } from '../translate.module';
import { LoaderServiceMock, translations } from '../mocks/loader.service.mock';

@Component({
  template: `
    <p #knownKey translate>BODY.KNOWN_KEY</p>
    <p #unknownKey translate>BODY.UNKNOWN_KEY</p>
    <p #noKey translate></p>
    <p #regularText translate>Regular Text</p>
    <div #childElements translate><div><p>Child Text</p></div></div>
    <div #childElementsKnownKey translate><div><p>BODY.KNOWN_KEY</p></div></div>
  `
})
class TranslateDirectiveSpecComponent {
  @ViewChild('knownKey') knownKey: ElementRef;
  @ViewChild('unknownKey') unknownKey: ElementRef;
  @ViewChild('noKey') noKey: ElementRef;
  @ViewChild('regularText') regularText: ElementRef;
  @ViewChild('childElements') childElements: ElementRef;
  @ViewChild('childElementsKnownKey') childElementsKnownKey: ElementRef;
}

describe('Translate Directive', () => {
  let component: TranslateDirectiveSpecComponent;
  let fixture: ComponentFixture<TranslateDirectiveSpecComponent>;
  let translateService: TranslateService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [TranslateDirectiveSpecComponent]
    });
    translateService = TestBed.get(TranslateService);
    translateService.loaderService = LoaderServiceMock;
    fixture = TestBed.createComponent(TranslateDirectiveSpecComponent);
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

    test('an element with normal text loads the original text', () => {
      const expectedText = 'Regular Text';
      const resultText = component.regularText.nativeElement.innerHTML;
      expect(resultText).toEqual(expectedText);
    });

    test('an element with child elements returns the child elements', () => {
      const expectedText = '<div><p>Child Text</p></div>';
      const resultText = component.childElements.nativeElement.innerHTML;
      expect(resultText).toEqual(expectedText);
    });

    test('an element with child elements and a known key returns the known key and child elements', () => {
      const expectedText = '<div><p>BODY.KNOWN_KEY</p></div>';
      const resultText = component.childElementsKnownKey.nativeElement.innerHTML;
      expect(resultText).toEqual(expectedText);
    });

  })

});
