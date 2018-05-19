import { InjectionToken } from '@angular/core';
import { TranslateConfiguration } from '../translate.service';

export const CONFIG = new InjectionToken<TranslateConfiguration>('config');
