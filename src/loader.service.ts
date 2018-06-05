import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CONFIG } from './types/config.token';
import { TranslateConfiguration } from './types/translate-configuration.interface';

@Injectable()
export class LoaderService {

  public path = '/assets/languages/';
  public extension = '.json';

  constructor(public http: HttpClient,
              @Inject(CONFIG) public config: TranslateConfiguration) {
    this.path = config.path ? config.path : this.path;
  }

  public getFile(fileName: string): Observable<Object> {
    return this.http.get(this.path + fileName + this.extension)
  }

}
