import { ModuleWithProviders, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {
  TranslateDirective,
  TranslatePipe,
  TranslateService,
  LoaderService
} from '.';
import { CONFIG } from './types';

export function configFactory(config) {
  return config;
}

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
        { provide: CONFIG, useFactory: configFactory(config) }
      ]
    };
  };
  static forChild(): ModuleWithProviders {
    return {
      ngModule: TranslateModule
    }
  };
}


