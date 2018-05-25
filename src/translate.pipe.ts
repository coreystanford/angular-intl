import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from './translate.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/takeUntil';

@Pipe({
  name: 'translate',
  pure: false
})
export class TranslatePipe implements PipeTransform, OnDestroy {

  public translation: string = '';
  public translationLoaded$: Observable<boolean>;
  private unsubscribe = new Subject<void>();

  constructor(private translateService: TranslateService) {
    this.translationLoaded$ = translateService.translationsLoaded
      .filter(Boolean)
      .takeUntil(this.unsubscribe);
  }

  transform(val, args): string {
    this.translationLoaded$.subscribe(() => {
      const readValue = this.translateService.read(val ? val : '', args);
      this.translation = readValue === val ? this.translation : readValue;
    });
    return this.translation;
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
