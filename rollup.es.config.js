// https://github.com/robisim74/angular-library-starter

import resolve from 'rollup-plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';
import license from 'rollup-plugin-license';

const path = require('path');

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
  output: {
    format: 'es',
    sourcemap: true
  },
  external: Object.keys(globals),
  plugins: [
    resolve(),
    sourcemaps(),
    license({
      sourceMap: true,
      banner: {
        file: path.join(__dirname, 'license-banner.txt'),
        encoding: 'utf-8',
      }
    })
  ],
  onwarn: () => { return }
}
