import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'ui-decorators-web',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
      copy: [
        {
          src: '../node_modules/@tvenceslau/decorator-validation/dist/esm/index.bundle.min.esm.js',
          dest: 'lib/ui-decorators.esm.js'
        },
        {
          src: '../node_modules/@tvenceslau/decorator-validation/dist/index.bundle.min.js',
          dest: 'lib/ui-decorators.js'
        },
        {
          src: '../node_modules/@tvenceslau/ui-decorators/dist/esm/index.bundle.min.esm.js',
          dest: 'lib/ui-decorators.esm.js'
        },
        {
          src: '../node_modules/@tvenceslau/ui-decorators/dist/index.bundle.min.js',
          dest: 'lib/ui-decorators.js'
        },
        {
          src: '../node_modules/@ionic/core/css',
          dest: 'lib/ionic/css'
        },
        {
          src: '../node_modules/@ionic/core/dist/ionic',
          dest: 'lib/ionic'
        },
        {
          src: '../node_modules/@ionic/core/dist/ionic',
          dest: 'lib/ionic'
        },
        {
          src: '../node_modules/@ionic/core/dist/esm',
          dest: 'lib/ionic/esm'
        },
        {
          src: '../node_modules/@ionic/core/css',
          dest: 'lib/ionic/css'
        }
      ]
    },
  ],
};
