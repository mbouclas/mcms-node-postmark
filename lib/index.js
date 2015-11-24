module.exports = (function(Config){
    var postmark = require('postmark'),
        lo = require('lodash'),
        Client = new postmark.Client(Config.key);



    return {
        client : Client,
        formatMessage : formatMessage,
        send : send,
        sendMultiple : sendMultiple
    };

    function send(from,to,subject,body,options,callback){
        if (arguments.length < 5) {
            return 'missing some arguments there...';
        }

        if (arguments.length == 5 && lo.isFunction(arguments[4])){
            var callback = arguments[4];
            var options = {};
        }

        options = lo.merge({
            TrackOpens : true
        },options);

        message = lo.merge(formatMessage(from,to,subject,body,options),options);
        Client.sendEmail(message,callback);
    }

    //messages NEEDS to be an array
    function sendMultiple(messages,callback){
        if (arguments.length == 1){
            callback = function(err,result){};
        }

        if (!lo.isArray(messages)){
            var err = 'invalid messages format';
            return (arguments.length == 1) ? err : callback(err);
        }

        Client.sendEmailBatch(messages,callback);
    }

    function formatMessage(from,to,subject,body,extra){
        if (!extra){
            extra = {};
        }

        var fromEmail = (lo.isObject(from)) ? from.email : from,
            fromName = (lo.isObject(from)) ? from.name : from,
            toEmail = (lo.isObject(to)) ? to.email : to,
            toName = (lo.isObject(to)) ? to.name : to;

        return {
            From: fromName + ' <' + fromEmail + '>',
            To: toName + ' <' + toEmail + '>',
            Subject: subject,
            TextBody: extra.textBody || body,
            HtmlBody: body,
            ReplyTo : extra.replyTo || fromEmail
        };
    }

});
