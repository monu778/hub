var driveService = (function() {

    'use strict';

    var shouldUseMocks = window.appConfig.options.useMocks || false;

    var syncDriveFolders = function() {
        return $.ajax({
            method: 'GET',
            url: hostUrl + '/drive',
            data: {
                action: 'syncfolders',
                session: sessionId,
                root: ''
            },
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            }
        }).then(function onLoad(data) {
            return data.data;
        }, function onError(data, b, c) {
            console.log("ERROR getMessage!", data, b, c);
        });
    }

    return {
        syncDriveFolders: syncDriveFolders
    }

})();