// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// 8080 datos migrados, caliope 8080
// 8088 lo q llevavamos, caliope 8088

export const environment = {
  production: false,
  urlConfig: '/assets/config/',
  URL_FOTOS: 'https://testfront.umv.gov.co/Mantenimientos/',
  URL_DOCUMENTOS: 'https://testfornt.umv.gov.co/Mantenimientos/',
  URL_CALIOPE_BACK: 'http://129.213.171.5:8088/Caliope-backend/',
  WM_Hash: '826eb0abceec4c30b4b26a2f722c13e0'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
