import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from './translate.service';
import { Subject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { takeUntil } from 'rxjs/internal/operators';

@Pipe({
  name: 'translate',
  pure: false
})
export class TranslatePipe implements PipeTransform, OnDestroy {

  public translation: string = '';
  public translationLoaded$: Observable<boolean>;
  private unsubscribe = new Subject<void>();

  constructor(private translateService: TranslateService) {
    this.translationLoaded$ = translateService.translationsLoaded.pipe(
      filter(Boolean),
      takeUntil(this.unsubscribe)
    );
  }

  transform(val, args): string {
    this.translationLoaded$.subscribe(() => {
      const readValue = val ? this.translateService.read(val, args) : '';
      this.translation = readValue === val ? this.translation : readValue;
    });
    return this.translation;
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
