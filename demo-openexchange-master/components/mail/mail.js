(function appClosure() {

    $parent = $('#widget');
    $mail = $('<div/>').addClass('mailHolder').appendTo($parent);

    var DATE_FORMAT = 'dddd MMM D';
    var TIME_FORMAT = 'h:mm A';

    var iconBarHTML = '<div class="icon-email flag"></div><div class="icon-archive archive"></div><div class="icon-trash delete"></div>';

    function getHeaderView(hdr, prevDate) {
        var $view = $('<div/>').addClass('messageHolder');
        var from = hdr.from[0][0] || hdr.from[0][1];
        var timestamp = hdr.received_date;

        var prevStr = prevDate ? moment(prevDate).format(DATE_FORMAT) || "" : "";
        var dateStr = moment(timestamp).format(DATE_FORMAT) || "";
        if (prevStr != dateStr)
            $('<div/>').addClass('datestamp').text(dateStr).appendTo($view);

        var $message = $('<div/>').addClass('message').appendTo($view);
        var $messageHeader = $('<div/>').addClass('messageHeader').appendTo($message);
        var $senderHolder = $('<div/>').addClass('senderHolder').appendTo($messageHeader);
        var $sender = $('<div/>').addClass('sender').text(from || "").appendTo($senderHolder);
        $('<div/>').addClass('timestamp').text(moment(timestamp).format(TIME_FORMAT) || "").appendTo($senderHolder);

        $('<div/>').addClass('subject').text(hdr.subject || "").appendTo($messageHeader);
        var $messageBody = $('<div/>').addClass('messageBody').html(hdr.body || "").appendTo($messageHeader);

        var $iconBarHolder = $('<div/>').addClass('iconBarHolder').prependTo($message);
        var $iconBar = $('<div/>').addClass('iconBar hidden').html(iconBarHTML).appendTo($iconBarHolder);

        var $showMoreHolder = $('<div/>').addClass('showMoreHolder').appendTo($view);
        var $showMore = $('<div/>').addClass('hidden showMore').appendTo($showMoreHolder);

        return $view;
    }

    loginService.login().then(function() {
        var promises = [];

        promises.push(mailService.getMail().then(function(data) {
            console.log("Loaded", data);

            var prevDate;
            for (var i in data) {
                getHeaderView(data[i], prevDate).appendTo($mail);
                prevDate = data[i].received_date;
            }
        }));

        promises.push(mailService.getFolderInfo());
        $.when.apply($, promises).then(function() {
            loginService.logout();
        });
    });

    $(function() {

        $('body').on({
            click: function() {
                $this = $(this);
                console.log("Flag called");
            },
        }, '.iconBar .flag');

        $('body').on({
            click: function() {
                $this = $(this);
                console.log("Archive called");
            },
        }, '.iconBar .archive');

        $('body').on({
            click: function() {
                $this = $(this);
                console.log("Delete called");
            },
        }, '.iconBar .delete');

        $('body').on({
            mouseenter: function() {
                $(this).find(".iconBar, .showMore, .showLess").toggleClass('hidden');
            },
            mouseleave: function() {
                $(this).find(".iconBar, .showMore, .showLess").toggleClass('hidden');
            }
        }, '.messageHolder');

        $('body').on({
            click: function() {
                $this = $(this);
                $this.parent().siblings(".message").find(".messageBody").toggleClass('expanded');
                $this.toggleClass('showMore').toggleClass('showLess');
            },
        }, '.showMore, .showLess');

    })

})();