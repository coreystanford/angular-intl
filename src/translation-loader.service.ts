import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class TranslationLoaderService {

  public path = '/assets/languages/';
  public extension = '.json';

  constructor(public http: HttpClient) {
  }

  public getFile(fileName: string): Observable<Object> {
    return this.http.get(this.path + fileName + this.extension)
  }

}
