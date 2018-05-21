import { ModuleWithProviders, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { TranslateDirective } from './translate.directive';
import { TranslatePipe } from './translate.pipe';
import { TranslateService } from './translate.service';
import { LoaderService } from './loader.service';

import { CONFIG } from './types/config.token';

@NgModule({
  imports: [HttpClientModule],
  declarations: [
    TranslateDirective,
    TranslatePipe
  ],
  exports: [
    TranslateDirective,
    TranslatePipe
  ]
})
export class TranslateModule {
  static forRoot(config = {}): ModuleWithProviders {
    return {
      ngModule: TranslateModule,
      providers: [
        TranslateService,
        LoaderService,
        { provide: CONFIG, useValue: config }
      ]
    };
  };
  static forChild(): ModuleWithProviders {
    return {
      ngModule: TranslateModule
    }
  };
}


