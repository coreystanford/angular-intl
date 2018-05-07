import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from './translate.service';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { takeUntil } from 'rxjs/internal/operators';

@Pipe({
  name: 'translate',
  pure: false
})
export class TranslatePipe implements PipeTransform, OnDestroy {

  public translation: string = '';
  public translationLoaded$: Observable<string>;
  private unsubscribe = new Subject<void>();

  constructor(private translateService: TranslateService) {
    this.translationLoaded$ = translateService.translationsLoaded.pipe(
      filter(Boolean),
      takeUntil(this.unsubscribe)
    );
  }

  transform(val, args) {
    this.translationLoaded$.subscribe(() => {
      const readValue = this.translateService.read(val, args);
      this.translation = readValue === val ? this.translation : readValue;
    });
    return this.translation;
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
