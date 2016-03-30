angular.module('ionWhatsApp.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $ionicLoading, wsUser, $state, $ionicHistory) {
    $scope.currentUser = null;

    $scope.showLoader = function() {
        $ionicLoading.show({template: 'Loading...'});
    };

    $scope.hideLoader = function() {
        $ionicLoading.hide();
    };

    var removeOnUserChange = wsUser.onChange(function(user) {
        $scope.currentUser = user;
        $scope.hideLoader();

        if (user) {
            $ionicHistory.clearHistory();
            $state.go('app.chats', null, {reload: true});
        }
    });

    $scope.$on('$destroy', function() {
        removeOnUserChange();
    });
})

.controller('ChatsCtrl', function($scope, wsConversations) {
    $scope.chats = [];

    $scope.showLoader();

    wsConversations
        .getAllSummariesFromUser(1)
        .then(function(chats) {
            $scope.chats = chats;

            $scope.hideLoader();
        });
})

.controller('ConversationCtrl', function($scope, wsConversations, $stateParams) {
    $scope.conversation = null;
    $scope.newMessage = {};

    $scope.sendMessage = function() {
        console.log($scope.newMessage.text);
    };

    $scope.showLoader();

    wsConversations
        .getOne(1, Number($stateParams.id))
        .then(function(conversation) {
            $scope.conversation = conversation;

            $scope.hideLoader();
        });
})

.controller('ContactsCtrl', function($scope, wsContacts) {
    $scope.contacts = [];

    $scope.showLoader();

    wsContacts
        .getAllFromUser(1)
        .then(function(contacts) {
            $scope.contacts = contacts;

            $scope.hideLoader();
        });

    $scope.beginConversation = function (contact) {
        console.log('Begin conversation with contact: ', contact);
    };
})

.controller('ConfigsCtrl', function($scope, $state, wsUser) {
    $scope.goToLogin = function() {
        $state.go('app.configs_sign_in');
    };

    $scope.logout = function() {
        wsUser.logout();
    };

    $scope.isLoggedIn = function() {
        return wsUser.isLoggedIn();
    }
})

.controller('SignInCtrl', function($scope, $state, wsUser, $ionicHistory) {
    $scope.celNumber = '';
    $scope.password = '';
    $scope.submit = function() {
        $scope.showLoader();

        wsUser
            .signIn($scope.celNumber, $scope.password)
            .then(function() {
                $scope.celNumber = '';
                $scope.password = '';
            });
    };

    $scope.close = function() {
        $ionicHistory.clearHistory();
        $state.go('app.configs');
    };
});
