import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CONFIG, TranslateConfiguration } from './types';

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
