angular.module('ionWhatsApp.configs', [])

.constant('WS_FIREBASE_CFG', (function () {
    var baseUrl = 'https://boiling-heat-7267.firebaseio.com';

    return {
        secret: '8s5j8mPt9nGXbKtNMEYW1UqnQ8vr6AaUCO9Rt15z',
        baseUrl: baseUrl,
        baseRef: new Firebase(baseUrl)
    };
}()))

.factory('WS_APP_CFG', function(wsBindingUtils) {
    return {
        get: function() {
            return wsBindingUtils.getLocalStorageBindingState('appConfigs');
        }
    };
}).

constant('WS_SQLITE_CFG', {
    name: 'whatsAppIonicBackup.db',
    androidLockWorkaround: 1,
    iosDatabaseLocation: 'default'
});
