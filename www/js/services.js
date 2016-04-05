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

.factory('wsContacts', function($q, $cordovaContacts, WS_FIREBASE_CFG, $firebaseArray, $firebaseObject) {
    function removeInvalidContacts(contacts) {
        return contacts.filter(function(contact) {
            return contact.phoneNumbers && contact.phoneNumbers.length > 0;
        });
    }

    function assumeContactsUID(contacts) {
        contacts.forEach(function(contact) {
            contact.assumedUID = CryptoJS.SHA256(contact.phoneNumbers[0].value);
        });

        return contacts;
    }

    function findMatchingUsers(contacts) {
        var deferred = $q.defer();

        WS_FIREBASE_CFG.baseRef.child('users').once('value', function(snapshot) {
            var usersHash = snapshot.val();

            var foundUsers = contacts.filter(function(contact) {
                return contact.assumedUID in usersHash;
            }).map(function(contact) {
                contact.dbData = usersHash[contact.assumedUID];

                return contact;
            });

            deferred.resolve(foundUsers);
        });

        return deferred.promise;
    }

    function syncUserContacts(userId) {
        return function (contacts) {
            if (!contacts || contacts.length === 0) return;

            return $q.all(contacts.map(function (contact) {
                var deferred = $q.defer();

                WS_FIREBASE_CFG.baseRef
                    .child('contacts')
                    .child(userId)
                    .child(contact.assumedUID)
                    .set({
                        uid: contact.assumedUID,
                        avatar: 'http://placehold.it/60x60',
                        displayName: contact.displayName,
                        statusMessage: 'Hi. I`m on IonicWhatsApp!',
                        lastOnlineAt: '10 min ago'
                    }, function () {
                        deferred.resolve(contact);
                    });

                return deferred.promise;
            }));
        }
    }

    return {
        getAllFromUser: function (userId) {
            return $firebaseArray(WS_FIREBASE_CFG.baseRef.child('contacts').child(userId));
        },
        refreshAllFromUser: function(userId) {
            return $cordovaContacts.find({hasPhoneNumber: true})
                .then(removeInvalidContacts)
                .then(assumeContactsUID)
                .then(findMatchingUsers)
                .then(syncUserContacts(userId));
        },
        getOne: function (userId, contactId) {
            return $firebaseObject(
                WS_FIREBASE_CFG.baseRef
                    .child('contacts')
                    .child(userId)
                    .child(contactId)
            );
        },
        remove: function (contactsSync, contact) {
            return contactsSync.$remove(contact);
        },
        add: function (contactsSync, contact) {
            var contactArr = [contact];

            contactArr = removeInvalidContacts(contactArr);

            if (contactArr.length === 0) {
                return $q.reject(new Error('Contact not valid.'));
            }

            return findMatchingUsers(assumeContactsUID(contactArr))
                .then(function(foundMatches) {
                    if (foundMatches.length === 0) {
                        return $q.reject(new Error('Contact is not registered in IonicWhatsApp.'));
                    }

                    return foundMatches;
                })
                .then(syncUserContacts(contactsSync.$ref().key()))
                .then(function(contactsSaved) {
                    return contactsSaved[0];
                });
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
