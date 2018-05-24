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

    test('an element with a known key returns the value', () => {
      const expectedText = translations[fileName].BODY.KNOWN_KEY;
      const resultText = component.knownKey.nativeElement.textContent;
      expect(resultText).toEqual(expectedText);
    });

    test('an element with an unknown key returns an empty string', () => {
      const expectedText = '';
      const resultText = component.unknownKey.nativeElement.textContent;
      expect(resultText).toEqual(expectedText);
    });

    test('an element without a key returns an empty string', () => {
      const expectedText = '';
      const resultText = component.noKey.nativeElement.textContent;
      expect(resultText).toEqual(expectedText);
    });

    test('an element with normal text returns an empty string', () => {
      const expectedText = '';
      const resultText = component.regularText.nativeElement.textContent;
      expect(resultText).toEqual(expectedText);
    });

    test('an element with child elements returns an empty string', () => {
      const expectedText = '';
      const resultText = component.childElements.nativeElement.textContent;
      expect(resultText).toEqual(expectedText);
    });

    test('an element with child elements and a known key returns the known key\'s value', () => {
      const expectedText = translations[fileName].BODY.KNOWN_KEY;
      const resultText = component.childElementsKnownKey.nativeElement.textContent;
      expect(resultText).toEqual(expectedText);
    });

  })

});
