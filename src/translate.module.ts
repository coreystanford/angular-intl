import { ModuleWithProviders, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {
  TranslateDirective,
  TranslatePipe,
  TranslateService,
  TranslationLoaderService
} from '.';
import { CONFIG } from './translate.service';

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
  /**
   * Use this method in your root module to provide the TranslateService
   * @returns {ModuleWithProviders}
   */
  static forRoot(config = {}): ModuleWithProviders {
    return {
      ngModule: TranslateModule,
      providers: [TranslateService, { provide: CONFIG, useValue: config }, TranslationLoaderService]
    };
  };
  /**
   * Use this method in your other (non root) modules to import the directive/pipe
   * @returns {ModuleWithProviders}
   */
  static forChild(): ModuleWithProviders {
    return {
      ngModule: TranslateModule
    }
  };
}
