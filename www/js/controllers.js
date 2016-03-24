angular.module('ionWhatsApp.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $ionicLoading) {
    $scope.currentUser = {
        id: 1
    };

    $scope.signIn = {
        modal: null,
        celNumber: '',
        password: '',
        submit: function() {
            console.log(this.celNumber, this.password);
        }
    };

    $ionicModal
        .fromTemplateUrl('templates/modals/sign-in.html', {scope: $scope})
        .then(function (modal) {
            $scope.signIn.modal = modal;
        });

    $scope.showLoader = function() {
        $ionicLoading.show({template: 'Loading...'});
    };

    $scope.hideLoader = function() {
        $ionicLoading.hide();
    };
})

.controller('ChatsCtrl', function($scope, wsConversations) {
    $scope.chats = [];

    $scope.showLoader();

    wsConversations
        .getAllSummariesFromUser($scope.currentUser.id)
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
        .getOne($scope.currentUser.id, Number($stateParams.id))
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

.controller('ConfigsCtrl', function($scope) {
    $scope.showSignInModal = function() {
        $scope.signIn.modal.show();
    };
});
