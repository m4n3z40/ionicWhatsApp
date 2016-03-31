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
        currentUser: function () {
            if (this.isLoggedIn()) {
                return getUser(auth.$getAuth().auth.uid);
            }

            return null;
        },
        isLoggedIn: function () {
            var authData = auth.$getAuth();

            return authData && authData.auth;
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

.factory('wsConversations', function($q) {
    var conversations = [
        {
            id: 1,
            participants: [
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
                    displayName: 'Jane Doe',
                    statusMessage: 'I am Batman',
                    lastOnlineAt: '30 min ago'
                }
            ],
            picture: 'http://placehold.it/60x60',
            displayName: '',
            messages: [
                {
                    from: 1,
                    text: 'Hey, how are you doing?',
                    received: true,
                    seen: true,
                    sentAt: '6 min ago'
                },
                {
                    from: 2,
                    text: 'Fine, and you?',
                    received: true,
                    seen: true,
                    sentAt: '5 min ago'
                },
                {
                    from: 1,
                    text: 'Great! it`s been some time since we last talked, huh?',
                    received: true,
                    seen: false,
                    sentAt: '5 min ago'
                }
            ]
        },
        {
            id: 2,
            participants: [
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
                    displayName: 'Jane Doe',
                    statusMessage: 'I am Batman',
                    lastOnlineAt: '30 min ago'
                }
            ],
            picture: 'http://placehold.it/60x60',
            displayName: '',
            messages: [
                {
                    from: 1,
                    text: 'Hey, how are you doing?',
                    received: true,
                    seen: true,
                    sentAt: '6 min ago'
                },
                {
                    from: 2,
                    text: 'Fine, and you?',
                    received: true,
                    seen: true,
                    sentAt: '5 min ago'
                },
                {
                    from: 1,
                    text: 'Great! it`s been some time since we last talked, huh?',
                    received: true,
                    seen: false,
                    sentAt: '5 min ago'
                }
            ]
        },
        {
            id: 3,
            participants: [
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
                    displayName: 'Jane Doe',
                    statusMessage: 'I am Batman',
                    lastOnlineAt: '30 min ago'
                }
            ],
            picture: 'http://placehold.it/60x60',
            displayName: '',
            messages: [
                {
                    from: 1,
                    text: 'Hey, how are you doing?',
                    received: true,
                    seen: true,
                    sentAt: '6 min ago'
                },
                {
                    from: 2,
                    text: 'Fine, and you?',
                    received: true,
                    seen: true,
                    sentAt: '5 min ago'
                },
                {
                    from: 1,
                    text: 'Great! it`s been some time since we last talked, huh?',
                    received: true,
                    seen: false,
                    sentAt: '5 min ago'
                }
            ]
        }
    ];

    function _getDisplayName(conversation, currentUserId) {
        return conversation.displayName ?
            conversation.displayName :
            conversation.participants.filter(function(user) {
                return user.id !== currentUserId;
            })[0].displayName;
    }

    return {
        getAllSummariesFromUser: function (userId) {
            var deferred = $q.defer();
            var summaries = conversations.map(function (conversation) {
                return {
                    id: conversation.id,
                    picture: 'http://placehold.it/60x60',
                    displayName: _getDisplayName(conversation, userId),
                    lastMessage: conversation.messages[conversation.messages.length - 1]
                };
            });

            deferred.resolve(summaries);

            return deferred.promise;
        },
        getOne: function (userId, conversationId, options) {
            var deferred = $q.defer();
            var conversation = conversations.filter(function(conversation) {
                return conversation.id === conversationId;
            })[0];

            if (conversation) {
                conversation = angular.copy(conversation);

                conversation.displayName = _getDisplayName(conversation, userId);
                conversation.messages = conversation.messages.map(function(message) {
                    var from = conversation.participants[0].id === message.from ?
                        conversation.participants[0] :
                        conversation.participants[1];

                    return {
                        from: from,
                        fromCurrentUser: (from.id === userId),
                        text: message.text,
                        received: message.received,
                        seen: message.seen,
                        sentAt: message.sentAt
                    };
                });


                deferred.resolve(conversation);
            } else {
                deferred.reject(new Error('Conversation not found.'));
            }

            return deferred.promise;
        },
        remove: function (userId, conversationId) {
            var deferred = $q.defer();

            conversations = conversations.filter(function(conversation) {
                return conversation.id !== conversationId;
            });
            deferred.resolve();

            return deferred.promise;
        },
        add: function (userId, conversationData) {
            var deferred = $q.defer();

            conversations.push(conversationData);
            deferred.resolve();

            return deferred.promise;
        }
    };
});
