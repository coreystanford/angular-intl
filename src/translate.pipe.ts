import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from './translate.service';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { takeUntil } from 'rxjs/internal/operators';

@Pipe({
  name: 'translate',
  pure: false
})
export class TranslatePipe implements PipeTransform, OnDestroy {

  public translation: string = '';
  private unsubscribe = new Subject<void>();

  constructor(private translateService: TranslateService) {
  }

  transform(val, args) {
    this.translateService.translationsLoaded.pipe(
      filter(Boolean),
      takeUntil(this.unsubscribe)
    ).subscribe(() => this.translation = this.translateService.read(val, args));
    return this.translation;
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
