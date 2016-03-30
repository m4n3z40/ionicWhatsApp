// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('ionWhatsApp', [
    'ionic',
    'firebase',
    'ionWhatsApp.configs',
    'ionWhatsApp.services',
    'ionWhatsApp.controllers'
])

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('app', {
            abstract: true,
            templateUrl: 'templates/app.html',
            controller: 'AppCtrl'
        })

        .state('app.chats', {
            url: '/chats',
            views: {
                'tab-chats': {
                    templateUrl: 'templates/tab-chats.html',
                    controller: 'ChatsCtrl'
                }
            }
        })
        .state('app.chats_conversation', {
            url: '/chats/:id',
            views: {
                'tab-chats': {
                    templateUrl: 'templates/conversation.html',
                    controller: 'ConversationCtrl'
                }
            }
        })

        .state('app.contacts', {
            url: '/contacts',
            views: {
                'tab-contacts': {
                    templateUrl: 'templates/tab-contacts.html',
                    controller: 'ContactsCtrl'
                }
            }
        })

        .state('app.configs', {
            url: '/configs',
            views: {
                'tab-configs': {
                    templateUrl: 'templates/tab-configs.html',
                    controller: 'ConfigsCtrl'
                }
            }
        });

    $urlRouterProvider.otherwise('/chats');
})

.run(function ($ionicPlatform, $rootScope) {
    var currentPlatform = ionic.Platform.platform();

    // Make platform helper globally accessible
    $rootScope.platform = {
        current: currentPlatform,
        ios: currentPlatform === 'ios',
        android: currentPlatform === 'android'
    };

    $ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }

        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
});
