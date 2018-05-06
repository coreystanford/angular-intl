import { AfterViewInit, Directive, ElementRef, Input, OnDestroy } from '@angular/core';
import { TranslateService } from './translate.service';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { takeUntil } from 'rxjs/internal/operators';

// tslint:disable
@Directive({
  selector: '[translate]',
})
export class TranslateDirective implements AfterViewInit, OnDestroy {

  @Input() translateParams: any;
  private unsubscribe = new Subject<void>();

  constructor(private element: ElementRef,
              private translateService: TranslateService) {
  }

  ngAfterViewInit() {
    const keyPath = this.element.nativeElement.textContent.trim();
    if (keyPath) {
      this.translateService.translationsLoaded.pipe(
        filter(Boolean),
        takeUntil(this.unsubscribe)
      ).subscribe(() => this.element.nativeElement.textContent = this.translateService.read(keyPath, this.translateParams));
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
