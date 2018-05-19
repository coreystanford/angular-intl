import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { HttpClient } from '@angular/common/http';

import { LoaderService } from './loader.service';
import { CONFIG, CONSTANTS, TranslateConfiguration, TranslationResult } from './types';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/switchMapTo';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/from';

@Injectable()
export class TranslateService {

  public defaultKey;
  public defaultPrefix;
  public overrideKey;
  public translations = {};

  public loaderService: LoaderService;
  public translationsLoaded = new BehaviorSubject<boolean>(false);

  private matcher = key => new RegExp('{{\\s?[\\b' + key + '\\b]*\\s?}}', 'gm');

  constructor(public http: HttpClient,
              @Inject(CONFIG) public config: TranslateConfiguration) {
    this.loaderService = new LoaderService(http, config);
  }

  public getBrowserLanguage() {
    let browserLanguage = window.navigator.languages
      ? window.navigator.languages[0]
      : window.navigator.language;
    if (browserLanguage.indexOf('-') !== -1) {
      browserLanguage = browserLanguage.split('-')[0];
    }
    if (browserLanguage.indexOf('_') !== -1) {
      browserLanguage = browserLanguage.split('_')[0];
    }
    return browserLanguage;
  }

  public setDefault(fileName: string) {
    this.defaultKey = fileName;
    this.defaultPrefix = fileName.split('-')[0];
    if (this.translations[this.defaultKey]) {
      this.translationsLoaded.next(true);
    } else {
      this.loaderService.getFile(fileName)
        .subscribe(translations => {
          this.translations[this.defaultKey] = translations;
          this.translationsLoaded.next(true);
        });
    }
  }

  public setLanguage(fileName: string) {
    this.overrideKey = fileName;
    if (this.translations[this.overrideKey]) {
      this.translationsLoaded.next(true);
    } else {
      this.loaderService.getFile(fileName)
        .subscribe(translations => {
          this.translations[this.overrideKey] = translations;
          this.translationsLoaded.next(true);
        });
    }
  }

  public read(keyPath: string, params = {}, overrideKey = this.overrideKey): string {
    let value: string = CONSTANTS.EXIT;
    const path = keyPath.split('.');
    if (this.translations[overrideKey]) {
      value = this.readValue(path, this.translations[overrideKey]);
      if (value === CONSTANTS.EXIT) {
        value = this.readValue(path, this.translations[this.defaultKey]);
      }
    } else if (this.translations[this.defaultKey]) {
      value = this.readValue(path, this.translations[this.defaultKey]);
    }
    if (Boolean(params) && params !== {}) {
      value = Object.keys(params)
        .reduce((final, key) => final.replace(this.matcher(key), params[key]), value);
    }
    return value !== CONSTANTS.EXIT ? value : keyPath;
  }

  public get(keyPaths: string | Array<string>): Observable<TranslationResult> {
    return this.translationsLoaded
      .filter(Boolean)
      .switchMapTo(keyPaths instanceof Array
        ? this.getAll(keyPaths)
        : this.getOne(keyPaths)
      );
  }

  public getByFileName(keyPaths: string | Array<string>, fileName: string): Observable<TranslationResult> {
    const translationLoaded = new Subject<string>();
    if (this.translations[fileName]) {
      translationLoaded.next(fileName);
    } else {
      this.loaderService.getFile(fileName)
        .subscribe(translations => {
            this.translations[fileName] = translations;
            translationLoaded.next(fileName);
          }, () => {
            const defaultFileName = `${this.defaultPrefix}-${fileName.split('-')[1]}`;
            this.loaderService.getFile(defaultFileName).subscribe(translations => {
              this.translations[defaultFileName] = translations;
              translationLoaded.next(defaultFileName);
            });
          }
        );
    }
    return translationLoaded
      .switchMap(name => keyPaths instanceof Array
        ? this.getAll(keyPaths, name)
        : this.getOne(keyPaths, name)
      );
  }

  public getOne(keyPath: string, fileName = this.overrideKey): Observable<TranslationResult> {
    return Observable.from([this.read(keyPath, {}, fileName)])
  }

  public getAll(keyPaths: Array<string>, fileName = this.overrideKey): Observable<TranslationResult> {
    return Observable.of(keyPaths.reduce(
      (acc, keyPath) => ({ ...acc, [keyPath]: this.read(keyPath, {}, fileName) }), {}
    ));
  }

  // this is a tailored 'reduce' method that breaks if a value is not found
  public readValue(path: Array<any>, translation: any): string | CONSTANTS.EXIT {
    const length = path.length;
    for (let i = 0; i < length; i++) {
      translation = translation[path[i]] ? translation[path[i]] : CONSTANTS.EXIT;
      if (translation === CONSTANTS.EXIT) {
        break;
      }
    }
    return translation;
  }

}
