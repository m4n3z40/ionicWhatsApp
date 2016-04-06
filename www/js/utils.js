angular.module('ionWhatsApp.utils', [])

.factory('wsBindingUtils', function() {
    var localStorageBindingsKeyPrefix = 'ws_binding:';

    function makeLSKey(model) {
        return localStorageBindingsKeyPrefix + model;
    }

    return {
        getLocalStorageBindingState: function(model, defaultState) {
            var localStorageKey = makeLSKey(model);
            defaultState = defaultState || {};

            return angular.fromJson(localStorage.getItem(localStorageKey)) || defaultState;
        },
        bindToLocalStorage: function($scope, model, initialValue) {
            var localStorageKey = makeLSKey(model);

            $scope[model] = this.getLocalStorageBindingState(model);

            $scope.$watch(model, function (newValue) {
                localStorage.setItem(localStorageKey, angular.toJson(newValue));
            }, true);
        }
    };
});
