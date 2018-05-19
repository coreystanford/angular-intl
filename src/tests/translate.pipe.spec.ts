import { Component, ElementRef, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '../translate.service';
import { TranslateModule } from '../translate.module';
import { TranslationLoaderServiceMock } from './translation-loader.service.mock';

@Component({
  template: `
    <p #withKey>{{ 'BODY.WITH_KEY' | translate }}</p>
  `
})
class TranslatePipeSpecComponent {
  @ViewChild('withKey') withKey: ElementRef;
}

describe('Translate Directive', () => {
  let component: TranslatePipeSpecComponent;
  let fixture: ComponentFixture<TranslatePipeSpecComponent>;
  let translateService: TranslateService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [TranslatePipeSpecComponent]
    });
    translateService = TestBed.get(TranslateService);
    translateService.translationLoaderService = TranslationLoaderServiceMock;
    fixture = TestBed.createComponent(TranslatePipeSpecComponent);
    component = fixture.componentInstance;
  }));

  test('should exist', () => {
    expect(component).toBeDefined();
  });

  describe('Element withKey', () => {

    beforeEach(() => {
      translateService.setDefault('default-en');
      fixture.detectChanges();
    });

    test('text loads', () => {
      const expectedText = translateService.translations['default-en'].BODY.WITH_KEY;
      const resultText = component.withKey.nativeElement.innerHTML;
      expect(expectedText).toEqual(resultText);
    });
  })

});
