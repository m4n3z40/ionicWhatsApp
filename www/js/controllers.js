angular.module('ionWhatsApp.controllers', [])

.controller('ChatsCtrl', function($scope, $ionicLoading, wsConversations) {
    $scope.chats = [];

    $ionicLoading.show({template: 'Loading...'});

    wsConversations
        .getAllSummariesFromUser(1)
        .then(function(chats) {
            $scope.chats = chats;

            $ionicLoading.hide();
        });
})

.controller('ContactsCtrl', function($scope, $ionicLoading, wsContacts) {
    $scope.contacts = [];

    $ionicLoading.show({template: 'Loading...'});

    wsContacts
        .getAllFromUser(1)
        .then(function(contacts) {
            $scope.contacts = contacts;

            $ionicLoading.hide();
        });
})

.controller('ConfigsCtrl', function($scope) {

});
