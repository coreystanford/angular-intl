import { AfterViewInit, Directive, ElementRef, Input, OnDestroy } from '@angular/core';
import { TranslateService } from './translate.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/takeUntil';

@Directive({
  selector: '[translate]'
})
export class TranslateDirective implements AfterViewInit, OnDestroy {

  public keyPath: string;
  public translateParams;
  public translationLoaded$: Observable<boolean>;
  private unsubscribe = new Subject<void>();

  @Input('translate') set params(params) {
    if (!this.translateService.isEquivalent(this.translateParams, params)) {
      this.translateParams = params;
      if (this.translateParams) {
        this.runOneCheck(this.keyPath, this.translateParams);
      }
    }
  };

  constructor(public element: ElementRef,
              public translateService: TranslateService) {
    this.translationLoaded$ = this.translateService.translationsLoaded
      .takeUntil(this.unsubscribe)
  }

  ngAfterViewInit() {
    this.keyPath = this.element.nativeElement.textContent ? this.element.nativeElement.textContent.trim() : '';
    this.element.nativeElement.textContent = '';
    this.registerKeyChecker(this.keyPath);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private registerKeyChecker(keyPath) {
    this.translationLoaded$
      .subscribe(isLoaded => this.doCheck(isLoaded, keyPath, this.translateParams));
  }

  private runOneCheck(keyPath, params) {
    if (keyPath) {
      this.translationLoaded$
        .take(1)
        .subscribe(isLoaded => this.doCheck(isLoaded, keyPath, params));
    }
  }

  private doCheck(isLoaded, keyPath, params) {
    if (isLoaded) {
      const readValue = keyPath !== '' ? this.translateService.read(keyPath, params) : '';
      this.element.nativeElement.textContent = readValue === keyPath ? '' : readValue;
    }
  }

}
