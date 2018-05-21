// https://github.com/robisim74/angular-library-starter

import resolve from 'rollup-plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';

const globals = {
  '@angular/core': 'ng.core',
  '@angular/common': 'ng.common',
  '@angular/platform-browser': 'ng.platform-browser',
  'rxjs/Observable': 'Rx',
  'rxjs/Subject': 'Rx',
  'rxjs/BehaviorSubject': 'Rx',
  'rxjs/operator/concatMap': 'Rx',
  'rxjs/operator/filter': 'Rx',
  'rxjs/operator/map': 'Rx',
  'rxjs/observable/of': 'Rx',
  'rxjs/observable/from': 'Rx',
};

export default {
  external: Object.keys(globals),
  plugins: [resolve(), sourcemaps()],
  onwarn: () => { return },
  output: {
    format: 'umd',
    name: 'ng.angularIntl',
    globals: globals,
    sourcemap: true,
    exports: 'named',
    amd: { id: 'angular-intl' }
  }
}
