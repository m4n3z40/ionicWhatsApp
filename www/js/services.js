angular.module('ionWhatsApp.services', [])

.factory('wsUser', function(WS_FIREBASE_CFG, $firebaseAuth, $firebaseObject) {
    var tokenGenerator = new FirebaseTokenGenerator(WS_FIREBASE_CFG.secret);
    var fbRef = WS_FIREBASE_CFG.baseRef;
    var auth = $firebaseAuth(fbRef);

    function getUser(uid) {
        return $firebaseObject(fbRef.child('users').child(uid));
    }

    function createUser(userSync, userData) {
        userSync.uid = userData.uid;
        userSync.cel = userData.cel;
        userSync.password = userData.password;

        return userSync.$save();
    }

    return {
        getAuth: function() {
            return auth;
        },
        signIn: function (cel, password) {
            var userData = {
                uid: CryptoJS.SHA256(cel).toString(),
                cel: cel,
                password: CryptoJS.SHA256(password).toString()
            };

            return getUser(userData.uid).$loaded()
                .then(function (user) {
                    if (!user.uid) {
                        createUser(user, userData)
                    }
                })
                .then(function () {
                    var token = tokenGenerator.createToken(userData);

                    return auth.$authWithCustomToken(token);
                })
                .then(function(authData) {
                    return authData.auth;
                });
        },
        onChange: function(fn) {
            return auth.$onAuth(function (authData) {
                if (authData) {
                    fn(authData.auth);
                } else {
                    fn(null);
                }
            });
        },
        logout: function () {
            return auth.$unauth();
        },
        current: function () {
            if (this.isLoggedIn()) {
                return getUser(auth.$getAuth().auth.uid);
            }

            return null;
        },
        isLoggedIn: function () {
            var authData = auth.$getAuth();

            return authData && authData.auth;
        },
        getOne: function (id) {
            return getUser(id);
        }
    }
})

.factory('wsContacts', function($q) {
    var contacts = [
        {
            id: 1,
            avatar: 'http://placehold.it/60x60',
            displayName: 'John Doe',
            statusMessage: 'I am Batman',
            lastOnlineAt: '30 min ago'
        },
        {
            id: 2,
            avatar: 'http://placehold.it/60x60',
            displayName: 'John Doe',
            statusMessage: 'I am Batman',
            lastOnlineAt: '30 min ago'
        },
        {
            id: 3,
            avatar: 'http://placehold.it/60x60',
            displayName: 'John Doe',
            statusMessage: 'I am Batman',
            lastOnlineAt: '30 min ago'
        },
        {
            id: 4,
            avatar: 'http://placehold.it/60x60',
            displayName: 'John Doe',
            statusMessage: 'I am Batman',
            lastOnlineAt: '30 min ago'
        }
    ];

    return {
        getAllFromUser: function (userId) {
            var deferred = $q.defer();

            deferred.resolve(contacts);

            return deferred.promise;
        },
        getOne: function (contactId) {
            var deferred = $q.defer();
            var contact = contacts.filter(function(contact) {
                return contact.is === contactId;
            })[0];

            deferred.resolve(contact);

            return deferred.promise;
        },
        remove: function (contactId) {
            var deferred = $q.defer();

            contacts = contacts.filter(function(contact) {
                return contact.id !== contactId
            });
            deferred.resolve();

            return deferred.promise;
        },
        add: function (userId, contactData) {
            var deferred = $q.defer();

            contacts.push(contactData);
            deferred.resolve();

            return deferred.promise;
        }
    };
})

.factory('wsConversations', function($q, WS_FIREBASE_CFG, $firebaseArray, $firebaseObject) {
    return {
        getAllSummariesFromUser: function (userId) {
            return $firebaseArray(WS_FIREBASE_CFG.baseRef.child('users').child(userId).child('conversations'));
        },
        getOne: function (conversationId) {
            return $firebaseObject(WS_FIREBASE_CFG.baseRef.child('conversations').child(conversationId));
        },
        getMessages: function (conversationSync) {
            return $firebaseArray(conversationSync.$ref().child('messages'));
        },
        remove: function (messagesSync, message) {
            return messagesSync.$remove(message);
        },
        add: function (messagesSync, conversationData) {
            return messagesSync.$add(conversationData);
        }
    };
});
