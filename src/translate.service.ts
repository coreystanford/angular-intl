import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject, of, from } from 'rxjs';
import { filter } from 'rxjs/operators';
import { switchMap, switchMapTo, combineLatest, take } from 'rxjs/internal/operators';

import { LoaderService } from './loader.service';
import { CONFIG } from './types/config.token';
import { TranslateConfiguration } from './types/translate-configuration.interface';
import { TranslationResult } from './types/translation-result.type';
import { CONSTANTS } from './types/constants.enum';

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
      this.translationsLoaded.next(false);
      this.loaderService.getFile(fileName)
        .subscribe(translations => {
          this.translations[this.defaultKey] = translations;
          this.translationsLoaded.next(true);
        });
    }
  }

  public setOverride(fileName: string) {
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

  public get(keyPaths: string | Array<string>): Observable<TranslationResult> {
    return this.translationsLoaded.pipe(
      filter(Boolean),
      switchMapTo(keyPaths instanceof Array
        ? this.getAll(keyPaths)
        : this.getOne(keyPaths))
    );
  }

  public getByFileName(keyPaths: string | Array<string>, fileName: string): Observable<TranslationResult> {
    const translationLoaded = new Subject<string>();
    const defaultFileName = `${this.defaultPrefix}-${fileName.split('-')[1]}`;
    this.loaderService.getFile(fileName).pipe(
        combineLatest(this.loaderService.getFile(defaultFileName)),
        filter(results => results.indexOf(undefined) === -1),
        take(1)
      ).subscribe(([translations, defaultTranslations]) => {
          this.translations[fileName] = translations;
          this.translations[defaultFileName] = defaultTranslations;
          translationLoaded.next(fileName);
        }, () => {
          this.loaderService.getFile(defaultFileName)
            .pipe(take(1))
            .subscribe(translations => {
              this.translations[defaultFileName] = translations;
              translationLoaded.next(defaultFileName);
            });
        }
      );
    return translationLoaded.pipe(
      switchMap(overrideFileName => keyPaths instanceof Array
        ? this.getAll(keyPaths, overrideFileName, defaultFileName)
        : this.getOne(keyPaths, overrideFileName, defaultFileName)
      ));
  }

  private getOne(keyPath: string, fileName = this.overrideKey, defaultKey = this.defaultKey): Observable<TranslationResult> {
    return from([this.read(keyPath, {}, fileName, defaultKey)])
  }

  private getAll(keyPaths: Array<string>, fileName = this.overrideKey, defaultKey = this.defaultKey): Observable<TranslationResult> {
    return of(keyPaths.reduce(
      (acc, keyPath) => ({ ...acc, [keyPath]: this.read(keyPath, {}, fileName, defaultKey) }), {}
    ));
  }

  public read(keyPath: string, params = {}, overrideKey = this.overrideKey, defaultKey = this.defaultKey): string {
    let value: string = CONSTANTS.EXIT;
    const path = keyPath.split('.');
    if (this.translations[overrideKey]) {
      value = this.readValue(path, this.translations[overrideKey]);
      if (value === CONSTANTS.EXIT) {
        value = this.readValue(path, this.translations[defaultKey]);
      }
    } else if (this.translations[defaultKey]) {
      value = this.readValue(path, this.translations[defaultKey]);
    }
    if (Boolean(params) && params !== {}) {
      value = Object.keys(params)
        .reduce((final, key) => final.replace(this.matcher(key), params[key]), value);
    }
    if (value === CONSTANTS.EXIT) {
      console.warn('Unknown Key: ', keyPath);
      return keyPath;
    }
    return value;
  }

  // this is a tailored 'reduce' method that breaks if a value is not found
  private readValue(path: Array<any>, translation: any): string | CONSTANTS.EXIT {
    const length = path.length;
    for (let i = 0; i < length; i++) {
      translation = translation && translation[path[i]] ? translation[path[i]] : CONSTANTS.EXIT;
      if (translation === CONSTANTS.EXIT) {
        break;
      }
    }
    return translation;
  }

  public isEquivalent(a, b) {
    if (!Boolean(a) || !Boolean(b)) {
      return false;
    }
    const aProps = Object.getOwnPropertyNames(a);
    const bProps = Object.getOwnPropertyNames(b);
    if (aProps.length !== bProps.length) {
      return false;
    }
    for (let i = 0; i < aProps.length; i++) {
      const propName = aProps[i];
      if (a[propName] !== b[propName]) {
        return false;
      }
    }
    return true;
  }

}
