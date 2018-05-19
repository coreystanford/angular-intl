import { InjectionToken } from '@angular/core';
import { TranslateConfiguration } from './translate-configuration.interface';

export const CONFIG = new InjectionToken<TranslateConfiguration>('config');
