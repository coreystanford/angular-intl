import { AfterViewInit, Directive, ElementRef, Input, OnDestroy } from '@angular/core';
import { TranslateService } from './translate.service';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { takeUntil } from 'rxjs/internal/operators';

@Directive({
  selector: '[translate]',
})
export class TranslateDirective implements AfterViewInit, OnDestroy {

  @Input() translateParams: any;
  public keyPath: string;
  private unsubscribe = new Subject<void>();

  constructor(private element: ElementRef,
              private translateService: TranslateService) {
  }

  ngAfterViewInit() {
    this.keyPath = this.element.nativeElement.textContent.trim();
    this.element.nativeElement.textContent = '';
    if (this.keyPath) {
      this.translateService.translationsLoaded.pipe(
        filter(Boolean),
        takeUntil(this.unsubscribe)
      ).subscribe(() => {
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
