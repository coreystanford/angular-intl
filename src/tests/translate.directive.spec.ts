import { Component, ElementRef, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '../translate.service';
import { TranslateModule } from '../translate.module';
import { TranslationLoaderServiceMock } from './translation-loader.service.mock';

@Component({
  template: `
    <p #withKey translate>BODY.WITH_KEY</p>
  `
})
class TranslateDirectiveSpecComponent {
  @ViewChild('withKey') withKey: ElementRef;
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
    translateService.translationLoaderService = TranslationLoaderServiceMock;
    fixture = TestBed.createComponent(TranslateDirectiveSpecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  test('should exist', () => {
    expect(component).toBeDefined();
  });

  describe('Element withKey', () => {
    test('text loads', () => {
      translateService.setDefault('default-en');
      const expectedText = translateService.translations['default-en'].BODY.WITH_KEY;
      const resultText = component.withKey.nativeElement.textContent;
      expect(expectedText).toEqual(resultText);
    });
  })

});
