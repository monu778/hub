var loginService = (function() {

    'use strict';

    var shouldUseMocks = window.appConfig.options.useMocks || false;

    var hostUrl = "https://webmail.hostway.com/ajax";
    var accountName = "alecwalker@walkerplumbers.com";
    var accountPassword = "Buckhorn9!";

    // Self is reference to traditional 'this' scope considering we lost access to 'this' by following JS revealing mobule pattern
    var self = {
        sessionId: null
    }

    var setSessionId = function(sessionId) {
        self.sessionId = sessionId;
    }

    var getSessionId = function() {
        return self.sessionId;
    }

    var login = function() {

        if (shouldUseMocks) {
            var loginRequest = $.ajax({
                url: '/test/login.json'
            });
        } else {
            var loginRequest = $.ajax({
                url: hostUrl + '/login',
                type: "POST",
                dataType: 'json',
                data: {
                    action: 'login',
                    name: accountName,
                    password: accountPassword
                },
                xhrFields: {
                    withCredentials: true
                }
            });
        }

        loginRequest.then(function onLoad(data) {
            setSessionId(data.session);
        }, function onError(data, b, c) {
            console.log("ERROR!", data, b, c);
        });

        return loginRequest;
    }

    var logout = function() {

        if (shouldUseMocks) {
            var logoutRequest = $.ajax({
                url: '../../test/logout.json'
            });
        } else {
            var logoutRequest = $.ajax({
                url: hostUrl + '/login?action=logout',
                method: 'GET',
                data: {
                    session: getSessionId()
                },
                xhrFields: {
                    withCredentials: true
                }
            });

        }

        logoutRequest.then(function onLoad(data) {
            setSessionId(null);
        }, function onError(data, b, c) {
            console.log("ERROR!", data, b, c);
        });

        return logoutRequest;
    }

    return {
        hostUrl: hostUrl,
        getSessionId: getSessionId,
        login: login,
        logout: logout
    }

})();