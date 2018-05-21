// https://github.com/robisim74/angular-library-starter

import resolve from 'rollup-plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';

const globals = {
  '@angular/core': 'ng.core',
  '@angular/common': 'ng.common',
  '@angular/common/http': 'ng.common.http',
  'rxjs': 'rxjs',
  'rxjs/operators': 'rxjs.operators',
  'rxjs/internal/operators': 'rxjs.internal.operators'
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
