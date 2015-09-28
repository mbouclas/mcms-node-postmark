module.exports = (function(Config){
    var postmark = require('postmark'),
        lo = require('lodash'),
        Client = new postmark.Client(Config.key),
        Options = {
            TrackOpens : true
        };



    return {
        client : Client,
        formatMessage : formatMessage,
        send : send,
        sendMultiple : sendMultiple
    };

    function send(message,callback){
        if (arguments.length == 1){
            callback = function(err,result){};
        }

        message = lo.merge(message,Options);
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
        return {
            From: from,
            To: to,
            Subject: subject,
            TextBody: extra.textBody || body,
            HtmlBody: body,
            ReplyTo : extra.replyTo || from
        };
    }

});
