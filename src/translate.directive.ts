import { AfterViewInit, Directive, ElementRef, Input, OnDestroy } from '@angular/core';
import { TranslateService } from './translate.service';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/takeUntil';
import { Observable } from 'rxjs/Observable';

@Directive({
  selector: '[translate]',
})
export class TranslateDirective implements AfterViewInit, OnDestroy {

  public keyPath: string;
  public translationLoaded$: Observable<boolean>;
  private unsubscribe = new Subject<void>();

  @Input() translateParams: any;

  constructor(public element: ElementRef,
              public translateService: TranslateService) {
    this.translationLoaded$ = this.translateService.translationsLoaded
      .filter(Boolean)
      .takeUntil(this.unsubscribe)
  }

  ngAfterViewInit() {
    this.keyPath = this.element.nativeElement.textContent.trim();
    this.element.nativeElement.textContent = '';
    if (this.keyPath) {
      this.translationLoaded$.subscribe(() => {
        const readValue = this.translateService.read(this.keyPath, this.translateParams);
        this.element.nativeElement.textContent = readValue === this.keyPath ? '' : readValue;
      });
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
