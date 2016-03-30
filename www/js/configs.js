angular.module('ionWhatsApp.configs', [])

.constant('WS_FIREBASE_CFG', (function () {
    var baseUrl = 'https://boiling-heat-7267.firebaseio.com';

    return {
        secret: '8s5j8mPt9nGXbKtNMEYW1UqnQ8vr6AaUCO9Rt15z',
        baseUrl: baseUrl,
        baseRef: new Firebase(baseUrl)
    };
}()));
