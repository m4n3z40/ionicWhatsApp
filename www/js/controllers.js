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

        if (user) {
            $ionicHistory.clearHistory();
            $state.go('app.chats', null, {reload: true});
        }
    });

    $scope.$on('$destroy', function() {
        removeOnUserChange();
    });
})

.controller('ChatsCtrl', function($scope, wsUser, wsConversations) {
    $scope.chats = [];

    $scope.showLoader();

    wsUser.current()
        .$loaded()
        .then(function(user) {
            return wsConversations.getAllSummariesFromUser(user.uid);
        })
        .then(function(chats) {
            $scope.chats = chats;

            $scope.hideLoader();
        });
})

.controller('ConversationCtrl', function($scope, wsConversations, $stateParams, wsUser) {
    $scope.conversation = null;
    $scope.messages = null;
    $scope.newMessage = {};
    $scope.otherUser = null;

    $scope.sendMessage = function() {
        wsConversations.add($scope.messages, {
            from: $scope.currentUser.uid,
            text: $scope.newMessage.text,
            received: false,
            seen: false,
            sentAt: '5 min ago'
        });

        $scope.newMessage = {};
    };

    function handleMessagesChange(change) {
        if (change.event === 'child_added') {
            var lastAdded = $scope.messages[$scope.messages.length - 1];

            if (lastAdded.from !== $scope.currentUser.uid) {
                lastAdded.received = true;
                lastAdded.seen = true;

                $scope.messages.$save(lastAdded);
            }
        }
    }

    $scope.showLoader();

    wsConversations.getOne($stateParams.id)
        .$loaded()
        .then(function(conversation) {
            var participants = conversation.participants;
            var otherUserId = participants.user1 === $scope.currentUser.uid ?
                participants.user1 :
                participants.user2;

            $scope.conversation = conversation;

            return wsUser.getOne(otherUserId);
        })
        .then(function(otherUser) {
            $scope.otherUser = otherUser;

            return wsConversations.getMessages($scope.conversation);
        })
        .then(function(messages) {
            messages.$watch(handleMessagesChange);
            $scope.messages = messages;

            $scope.hideLoader();
        });
})

.controller('ContactsCtrl', function($scope, wsContacts, $cordovaContacts) {
    $scope.contacts = [];

    $scope.showLoader();

    wsContacts.getAllFromUser($scope.currentUser.uid)
        .$loaded()
        .then(function(contacts) {
            $scope.contacts = contacts;

            $scope.hideLoader();
        });

    $scope.refreshContacts = function() {
        $scope.showLoader();

        wsContacts.refreshAllFromUser($scope.currentUser.uid)
            .then(function () {
                $scope.hideLoader();
            });
    };

    $scope.addNewContact = function() {
        $cordovaContacts.pickContact()
            .then(function(contact) {
                $scope.showLoader();

                return wsContacts.add($scope.contacts, contact);
            })
            .catch(function(error) {
                window.alert(error.message);
            })
            .finally(function() {
                $scope.hideLoader();
            });
    };

    $scope.beginConversation = function (contact) {
        console.log(contact);
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
    $scope.signInData = {
        celNumber: '',
        password: ''
    };

    $scope.submit = function() {
        $scope.showLoader();

        wsUser
            .signIn($scope.signInData.celNumber, $scope.signInData.password)
            .then(function() {
                $scope.signInData.celNumber = '';
                $scope.signInData.password = '';

                $scope.hideLoader();
            });
    };

    $scope.close = function() {
        $ionicHistory.clearHistory();
        $state.go('app.configs');
    };
});
