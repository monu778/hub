(function appClosure() {

    $parent = $('#widget');
    $calendar = $('<div/>').addClass('calendarHolder').appendTo($parent);

    var DATE_FORMAT = 'dddd MMM D';
    var TIME_FORMAT = 'h:mm A';

    var iconBarHTML = '<div class="icon-tick accept"></div><div class="icon-cross decline"></div><div class="icon-tentative tentative"></div><div class="icon-externallink launch"></div>';

    function createCalendarView(appointmentData, prevDate) {
        var $view = $('<div/>').addClass('appointmentHolder');
        var organizer = appointmentData.organizer || '';
        var timestamp = appointmentData.start_date;
        var allday = appointmentData.full_time;
        var location = appointmentData.location || '';
        var title = appointmentData.title || '';
        var note = appointmentData.note || '';

        var prevStr = prevDate ? moment.utc(prevDate).format(DATE_FORMAT) || "" : "";
        var dateStr = moment.utc(timestamp).format(DATE_FORMAT) || "";

        if (prevStr != dateStr) {
            $('<div/>').addClass('datestamp').text(dateStr).appendTo($view);
        }

        var $appointment = $('<div/>').addClass('appointment').appendTo($view);
        var $appointmentHeader = $('<div/>').addClass('appointmentHeader').appendTo($appointment);

        var $titleHolder = $('<div/>').addClass('titleHolder').appendTo($appointmentHeader);

        var $title = $('<div/>').addClass('title').text(title || "").appendTo($titleHolder);
        $('<div/>').addClass('timestamp').text(allday ? 'All Day' : moment(timestamp).format(TIME_FORMAT) || "").appendTo($titleHolder);

        $('<div/>').addClass('location').text(location).appendTo($appointmentHeader);
        var $noteBody = $('<div/>').addClass('noteBody').html(note).appendTo($appointmentHeader);

        var $iconBarHolder = $('<div/>').addClass('iconBarHolder').prependTo($appointment);
        var $iconBar = $('<div/>').addClass('iconBar hidden').html(iconBarHTML).appendTo($iconBarHolder);

        return $view;
    }

    loginService.login().then(function() {

        var promises = [];

        promises.push(calendarService.getListAppointments().then(function(data) {

            var prevDate;
            var proccessedData = calendarService.getCalendarData();
            console.log("This is proccessedData", proccessedData);
            for (event in proccessedData) {
                createCalendarView(proccessedData[event], prevDate).appendTo($calendar);
                prevDate = proccessedData[event].start_date;
            }

        }));

        $.when.apply($, promises).then(function() {
            loginService.logout();
        });
    });

    $(function() {

        $('body').on({
            click: function() {
                $this = $(this);
                console.log("Accept called");
            },
        }, '.iconBar .accept');

        $('body').on({
            click: function() {
                $this = $(this);
                console.log("Decline called");
            },
        }, '.iconBar .decline');

        $('body').on({
            click: function() {
                $this = $(this);
                console.log("Tenative called");
            },
        }, '.iconBar .tenative');

        $('body').on({
            click: function() {
                $this = $(this);
                console.log("Launch called");
            },
        }, '.iconBar .launch');

        $('body').on({
            mouseenter: function() {
                $this = $(this);
                $this.find(".iconBar").toggleClass('hidden');
            },
            mouseleave: function() {
                $this = $(this);
                $this.find(".iconBar").toggleClass('hidden');
            }
        }, '.appointmentHolder');

    })

})();