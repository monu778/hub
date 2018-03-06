var calendarService = (function() {

    'use strict';

    var shouldUseMocks = window.appConfig.options.useMocks || false;

    var CALENDAR_FIELD_CODES = {
        id: 1,
        created_by: 2,
        modified_by: 3,
        creation_date: 4,
        last_modified: 5,
        categories: 100,
        title: 200,
        start_date: 201,
        end_date: 202,
        note: 203,
        alarm: 204,
        recurrence_id: 206,
        recurrence_position: 207,
        recurrence_date_position: 208,
        recurrence_type: 209,
        change_exceptions: 210,
        delete_exceptions: 211,
        days: 212,
        day_in_month: 213,
        month: 214,
        interval: 215,
        until: 216,
        notification: 217,
        participants: 220,
        users: 221,
        uid: 223,
        organizer: 224,
        confirmations: 226,
        principal: 228,
        location: 400,
        full_time: 401,
        timezone: 408,
        recurrence_start: 410
    }

    // Self is reference to traditional 'this' scope considering we lost access to 'this' by following JS revealing mobule pattern
    var self = {
        calendarData: []
    }

    var setCalendarData = function(calendarData) {
        self.calendarData.push(calendarData);
    }

    var getCalendarData = function() {
        return self.calendarData;
    }

    var getCalendarFieldCodesString = function() {
        var arrayOfCodes = [];

        for (var code in CALENDAR_FIELD_CODES) {
            arrayOfCodes.push(CALENDAR_FIELD_CODES[code]);
        }
        return arrayOfCodes.toString();
    }

    var getCalendarFieldNamesArray = function() {
        var arrayOfNames = [];

        for (var name in CALENDAR_FIELD_CODES) {
            arrayOfNames.push(name);
        }
        return arrayOfNames;
    }

    var getListAppointments = function() {
        if (shouldUseMocks) {
            var getListAppointmentsPromise = $.ajax({
                url: '/test/calendar/all.json'
            });
        } else {
            var getListAppointmentsPromise = $.ajax({
                method: 'GET',
                url: loginService.hostUrl + '/calendar',
                data: {
                    action: 'all',
                    session: loginService.getSessionId(),
                    columns: getCalendarFieldCodesString(),
                    start: Date.now(),
                    end: Date.now() + ((1000 * 24 * 60 * 60) * window.appConfig.options.calendar.daysToDisplay)
                },
                dataType: 'json',
                xhrFields: {
                    withCredentials: true
                }
            });
        }

        getListAppointmentsPromise.then(function onLoad(data) {
            var i, j, row;

            for (i in data.data) {
                row = data.data[i];
                var appointmentHeader = { index: (+i) + 1 };

                for (j in row) {
                    appointmentHeader[getCalendarFieldNamesArray()[j]] = row[j];
                }
                setCalendarData(appointmentHeader);
            }

        }, function onError(data, b, c) {
            console.log("ERROR getMessage!", data, b, c);
        });

        return getListAppointmentsPromise;
    }

    return {
        getListAppointments: getListAppointments,
        getCalendarData: getCalendarData
    }

})();