var mailService = (function() {

    'use strict';

    var shouldUseMocks = window.appConfig.options.useMocks || false;

    // Self is reference to traditional 'this' scope considering we lost access to 'this' by following JS revealing mobule pattern
    var self = {
        messageData: []
    };

    var MAIL_FIELD_CODES = {
        color_label: 102,
        id: 600,
        folder_id: 601,
        attachment: 602,
        from: 603,
        to: 604,
        cc: 605,
        bcc: 606,
        subject: 607,
        size: 608,
        sent_date: 609,
        received_date: 610,
        flags: 611,
        level: 612, // Number	Zero-based nesting level in a thread.
        disp_notification_to: 613, // String	Content of message's header “Disposition-Notification-To”
        priority: 614, // Number	Value of message's “X-Priority” header. See X-Priority header.
        msg_ref: 615, // String	Message reference on reply/forward.
        flag_seen: 651,
        account_name: 652,
        account_id: 653,
        user: 'user', // Array	An array with user-defined flags as strings.
        headers: 'headers', // Object	An object with a field for every non-standard header. The header name is the field name. The header value is the value of the field as string.
        attachments: 'attachments', // Array	Each element is an attachment as described in Attachment. The first element is the mail text. If the mail has multiple representations (multipart-alternative), then the alternatives are placed after the mail text and have the field disp set to alternative.
        // nested_msgs	Array	Each element is a mail object as described in this table, except for fields id, folder_id and attachment.
        // truncated	boolean	true/false if the mail content was trimmed. Since v7.6.1
        // source	String	RFC822 source of the mail. Only present for action=get&attach_src=true
        cid: 'cid', //	String The value of the "Content-ID" header, if the header is present.
        original_id: 654, // String	The original mail identifier (e.g. if fetched from "virtual/all" folder).
        original_folder_id: 655, // String	The original folder identifier (e.g. if fetched from "virtual/all" folder).
        content_type: 656, // String	The Content-Type of a mail; e.g. multipart/mixed; boundary="-0123456abcdefg--".
        answered: 657, // String	Special field to sort mails by answered status.
        forwarded: 658, // String	Special field to sort mails by forwarded status. Note that mail service needs either support a system flag or a $Forwarded user flag
        draft: 659, // String	Special field to sort mails by draft flag.
        flagged: 660, // String	Special field to sort mails by flagged status.
        date: 661
    };

    var MAIL_FLAGS = {
        0x001: 'answered',
        0x002: 'deleted',
        0x004: 'draft',
        0x008: 'flagged',
        0x010: 'recent',
        0x020: 'seen',
        0x040: 'user',
        0x080: 'spam',
        0x100: 'forwarded'
    };

    var setMessageData = function(data) {
        self.messageData.push(data);
    }

    var getMessageData = function() {
        return self.messageData.shift();
    }

    var getMessageParser = function(messageHeader) {
        return function(self) {
            var data = getMessageData();

            var body;

            for (var i in data.attachments || []) {
                if (!body || data.attachments[i].content_type == 'text/plain')
                    body = data.attachments[i].content;
            }

            messageHeader.body = body || "<i>This message has no content</i>";

            if (Autolinker !== undefined && $.isFunction(Autolinker.link)) {
                messageHeader.body = Autolinker.link(messageHeader.body);
            }
        };
    }

    var getMail = function() {

        var keys = 'id,original_id,folder_id,to,from,subject,flags,size,attachment,received_date,msg_ref,headers,attachments'.split(',');

        var codes = [];
        for (var i in keys) {
            codes.push(MAIL_FIELD_CODES[keys[i]]);
        }
        console.log("These are the codes", codes);

        var promise = new $.Deferred();

        if (shouldUseMocks) {
            var getMailPromise = $.ajax({
                url: '/test/mail/all.json'
            });
        } else {
            var getMailPromise = $.ajax({
                method: 'GET',
                url: loginService.hostUrl + '/mail',
                data: {
                    action: 'all',
                    folder: 'default0/INBOX',
                    columns: '"' + codes.join(',') + '"',
                    session: loginService.getSessionId()
                },
                dataType: 'json',
                xhrFields: {
                    withCredentials: true
                }
            });
        }

        getMailPromise.then(function onLoad(data) {
            console.log("getMail!", data);
            var i, j, row;
            var messages = [];
            var promises = [];

            for (i in data.data) {
                row = data.data[i];
                var messageHeader = { index: (+i) + 1 };

                for (j in row) {
                    messageHeader[keys[j]] = row[j];
                }

                console.log("This is the message header!", messageHeader);

                promises.push(getMessage(messageHeader.id || messageHeader.index, messageHeader.folder_id).then(getMessageParser(messageHeader, i)));

                var encodedFlags = messageHeader.flags || 0;
                for (var flag in MAIL_FLAGS) {
                    if (encodedFlags & flag)
                        messageHeader[MAIL_FLAGS[flag]] = true;
                }
                messages.unshift(messageHeader);
            }

            $.when.apply($, promises).then(function() {
                promise.resolve(messages);
            });
        }, function onError(data, b, c) {
            console.log("ERROR getMail!", data, b, c);
            promise.fail(data);
        });

        return promise;
    }

    var getFolderInfo = function() {

        if (shouldUseMocks) {
            var getFolderInfoRequest = $.ajax({
                url: '/test/mail/count.json'
            });
        } else {
            var getFolderInfoRequest = $.ajax({
                method: 'GET',
                url: loginService.hostUrl + '/mail',
                data: {
                    action: 'count',
                    folder: 'default0/INBOX',
                    session: loginService.getSessionId()
                },
                dataType: 'json',
                xhrFields: {
                    withCredentials: true
                }
            });
        }
        getFolderInfoRequest.then(function onLoad(data) {
            console.log("getFolderInfo!", data);
        }, function onError(data, b, c) {
            console.log("ERROR getFolderInfo!", data, b, c);
        });

        return getFolderInfoRequest;
    }

    var getMessage = function(id, folder) {

        if (shouldUseMocks) {
            var getMessageRequest = $.ajax({
                url: '/test/mail/' + id + '.json'
            });
        } else {
            var getMessageRequest = $.ajax({
                method: 'GET',
                url: loginService.hostUrl + '/mail',
                data: {
                    id: id,
                    action: 'get',
                    folder: folder,
                    session: loginService.getSessionId()
                },
                dataType: 'json',
                xhrFields: {
                    withCredentials: true
                }
            });
        }

        getMessageRequest.then(function(data) {
            setMessageData(data.data);
            console.log("!getMessageRequest", data.data);
        }, function onError(data, b, c) {
            console.log("ERROR getMessage!", data, b, c);
        });

        return getMessageRequest;
    }

    return {
        getFolderInfo: getFolderInfo,
        getMail: getMail,
        getMessage: getMessage
    }

})();