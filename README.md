# angular-intl [![Build Status](https://img.shields.io/circleci/project/github/coreystanford/angular-intl/master.svg)](https://circleci.com/gh/coreystanford/angular-intl) [![npm version](https://img.shields.io/npm/v/angular-intl.svg)](https://www.npmjs.com/package/angular-intl)

A lightweight internationalization library for Angular applications.

## Setup

First, import the `TranslateModule` in your root module, like so:

```ts
@NgModule({
  imports: [
    TranslateModule.forRoot({ path: '/assets/languages' })
  ]
})
export class AppModule {
  constructor(public translateService: TranslateService) {
    const defaultPrefix = 'default';
    const browserLanguage = this.translationService.getBrowserLanguage();
    this.translationService.setDefault(`${defaultPrefix}-${browserLanguage}`); // eg. 'default-en'
  }
}
```

This bootstraps the translation pipe, directive and service at the root level, making them available throughout the application.

In the `/assets/languages` directory, you should have `.json` files that contain the key/value pairs for your translations.

eg. '/assets/languages/default-en.json':
```json
{
  "BODY": {
    "TITLE": "Title Translation",
    "DESCRIPTION": "Description translation"
  }
}
```

## Usage

Once bootstrapped, you can use the service, pipe and directive to make translations throughout your codebase.

Pipe example:
```html
<p>{{ 'BODY.TITLE' | translate }}</p>
```

Directive example:
```html
<p translate>BODY.TITLE</p>
```

Service example:
```ts
// for one translation
this.translateService.get('BODY.TITLE')
  .subscribe(translatedTitle => this.title = translatedTitle);
  
// for multiple translations
this.translateService.get(['BODY.TITLE', 'BODY.DESCRIPTION'])
  .subscribe(translations => {
    this.title = translations['BODY.TITLE'];
    this.description = translations['BODY.DESCRIPTION'];
  });
```

Default Overrides are also available, so after calling `setDefault`, you may call `setLanguage`, which will be used first, and then fall back to the default if the key is not found:

eg. '/assets/languages/override-en.json':
```json
{
  "BODY": {
    "TITLE": "Title Translation Override",
  }
}
```

Alternatively, you can get a translation without enforcing an entire file override, by getting a translation by file. This uses the translation if it is already loaded, otherwise it requests the file and uses the value that corresponds to the key, all without loading that file as an override or making it default:

```ts
this.translateService.getByFileName('BODY.TITLE', 'alternate-en')
  .subscribe(translatedTitle => this.title = translatedTitle);
```
