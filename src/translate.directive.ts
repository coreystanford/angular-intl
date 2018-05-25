import { AfterViewInit, Directive, ElementRef, Input, OnDestroy } from '@angular/core';
import { TranslateService } from './translate.service';
import { Subject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { takeUntil } from 'rxjs/internal/operators';

@Directive({
  selector: '[translate]',
})
export class TranslateDirective implements AfterViewInit, OnDestroy {

  public keyPath: string;
  public translationLoaded$: Observable<boolean>;
  private unsubscribe = new Subject<void>();

  @Input('translate') params: any;

  constructor(public element: ElementRef,
              public translateService: TranslateService) {
    this.translationLoaded$ = this.translateService.translationsLoaded.pipe(
      filter(Boolean),
      takeUntil(this.unsubscribe)
    );
  }

  ngAfterViewInit() {
    this.keyPath = this.element.nativeElement.textContent ? this.element.nativeElement.textContent.trim() : '';
    this.element.nativeElement.textContent = '';
    this.translationLoaded$.subscribe(() => {
      const readValue = this.translateService.read(this.keyPath, this.params);
      this.element.nativeElement.textContent = readValue === this.keyPath ? '' : readValue;
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
