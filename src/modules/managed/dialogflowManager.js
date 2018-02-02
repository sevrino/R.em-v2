let Manager = require('../../structures/manager');
let dialogflow = require('apiai');

let dialogflowKey = remConfig.dialogflow_api_key;

class DialogFlowManager extends Manager {
    constructor() {
        super();
        this.dialogFlow = dialogflow(dialogflowKey);
    }

    talk(msg) {
        var message = msg.content.substring(`<@!${rem.user.id}>`.length);
        var oprions = {
            sessionId: msg.channel.id
        };

        var request = this.dialogFlow.textRequest(message, oprions);

        request.on('response', function(response) {
            let answer = response.result.fulfillment.speech;
            setTimeout(() => {
                msg.channel.sendTyping();
                setTimeout(() => {
                    msg.channel.createMessage(answer);
                }, answer.length * 65);
            }, message.length * 25);
        });

        request.on('error', function(error) {
            console.error(error);
            return msg.channel.createMessage(':x: Something gone wrong!');
        });

        request.end();
    }
}

module.exports = {class: DialogFlowManager, deps: [], async: false, shortcode: 'dm'};
