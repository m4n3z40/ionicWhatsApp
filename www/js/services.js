angular.module('ionWhatsApp.services', [])

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

            contacts = contacts.filter(function(contact) { return contact.id !== contactId });
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
                    from: 3,
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
                    from: 3,
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
                    from: 3,
                    text: 'Great! it`s been some time since we last talked, huh?',
                    received: true,
                    seen: false,
                    sentAt: '5 min ago'
                }
            ]
        }
    ];

    return {
        getAllSummariesFromUser: function (userId) {
            var deferred = $q.defer();
            var summaries = conversations.map(function (conversation) {
                var displayName = conversation.displayName ?
                        conversation.displayName :
                        conversation.participants.filter(function(user) {
                            return user.id !== userId;
                        })[0].displayName;

                return {
                    id: 2,
                    picture: 'http://placehold.it/60x60',
                    displayName: displayName,
                    lastMessage: conversation.messages[conversation.messages.length - 1]
                };
            });

            deferred.resolve(summaries);

            return deferred.promise;
        },
        getOne: function (conversationId, options) {
            var deferred = $q.defer();
            var conversation = conversations.filter(function(conversation) {
                return conversation.id === conversationId;
            })[0];

            deferred.resolve(conversation);

            return deferred.promise;
        },
        remove: function (conversationId) {
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
