import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject, of } from 'rxjs';
import { filter } from 'rxjs/operators';
import { switchMap, switchMapTo } from 'rxjs/internal/operators';

interface TranslationResult {
  [key: string]: string
}

interface TranslateConfiguration {
  path: string;
}

enum CONSTANTS {
  EXIT = 'EXIT'
}

@Injectable()
export class TranslateService {

  public defaultKey;
  public defaultPrefix;
  public overrideKey;
  public translations = {};

  public path = '/assets/languages/';
  public extension = '.json';
  public translationsLoaded = new BehaviorSubject<boolean>(false);

  private matcher = key => new RegExp('{{\\s?[\\b' + key + '\\b]*\\s?}}', 'gm');

  constructor(private http: HttpClient,
              @Inject('config') private config: TranslateConfiguration) {
    this.path = config.path ? config.path : this.path;
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

  public setDefault(fileName) {
    this.defaultKey = fileName;
    this.defaultPrefix = fileName.split('-')[0];
    if (this.translations[this.defaultKey]) {
      this.translationsLoaded.next(true);
    } else {
      this.getFile(fileName)
        .subscribe(translations => {
          this.translations[this.defaultKey] = translations;
          this.translationsLoaded.next(true);
        });
    }
  }

  public setLanguage(fileName) {
    this.overrideKey = fileName;
    if (this.translations[this.overrideKey]) {
      this.translationsLoaded.next(true);
    } else {
      this.getFile(fileName)
        .subscribe(translations => {
          this.translations[this.overrideKey] = translations;
          this.translationsLoaded.next(true);
        });
    }
  }

  public read(keyPath, params = {}, overrideKey = this.overrideKey): string {
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
    if (params && params !== {}) {
      value = Object.keys(params)
        .reduce((final, key) => final.replace(this.matcher(key), params[key]), value);
    }
    return value !== CONSTANTS.EXIT ? value : keyPath;
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
    if (this.translations[fileName]) {
      translationLoaded.next(fileName);
    } else {
      this.getFile(fileName)
        .subscribe(translations => {
            this.translations[fileName] = translations;
            translationLoaded.next(fileName);
          }, () => {
            const defaultFileName = `${this.defaultPrefix}-${fileName.split('-')[1]}`;
            this.getFile(defaultFileName).subscribe(translations => {
              this.translations[defaultFileName] = translations;
              translationLoaded.next(defaultFileName);
            });
          }
        );
    }
    return translationLoaded.pipe(
      switchMap(name => keyPaths instanceof Array
        ? this.getAll(keyPaths, name)
        : this.getOne(keyPaths, name))
    );
  }

  private getOne(keyPath: string, fileName = this.overrideKey): Observable<TranslationResult> {
    return of({ [keyPath]: this.read(keyPath, {}, fileName) })
  }

  private getAll(keyPaths: Array<string>, fileName = this.overrideKey): Observable<TranslationResult> {
    return of(keyPaths.reduce(
      (acc, keyPath) => ({ ...acc, [keyPath]: this.read(keyPath, {}, fileName) }), {}
    ));
  }

  // this is a tailored 'reduce' method that breaks if a value is not found
  private readValue(path: Array<any>, translation: any): string | CONSTANTS.EXIT {
    const length = path.length;
    for (let i = 0; i < length; i++) {
      translation = translation[path[i]] ? translation[path[i]] : CONSTANTS.EXIT;
      if (translation === CONSTANTS.EXIT) {
        break;
      }
    }
    return translation;
  }

  private getFile(fileName) {
    return this.http.get(this.path + fileName + this.extension)
  }

}
