/**
 * Created by Julian/Wolke on 27.11.2016.
 */
let Manager = require('../../structures/manager');
let Cleverbot = require('cleverbot');

let re = /<@[0-9].*>/g;
let cleverbotKey = remConfig.cleverbot_api_key;

class CleverBotManager extends Manager {
    constructor() {
        super();
        this.cleverbot = new Cleverbot({'key': cleverbotKey});
        this.continuationStrings = {};
    }

    talk(msg) {
        var message = msg.content.replace(re, '');
        var continuationString = this.continuationStrings[msg.channel.id];

        if (continuationString && continuationString.length > 2000) {
            msg.channel.createMessage("I am having trouble remembering this conversation... Let's start over!");
            this.continuationStrings[msg.channel.id] = undefined;
            return;
        }

        this.cleverbot
            .query(encodeURI(message), {'cs': continuationString})
            .then(response => {
                setTimeout(() => {
                    msg.channel.sendTyping();
                    setTimeout(() => {
                        msg.channel.createMessage(response.output);
                    }, response.output.length * 65);
                }, message.length * 25);
                this.continuationStrings[msg.channel.id] = response.cs;
            })
            .catch(error => {
                console.error(error);
                return msg.channel.createMessage(':x: An error with cleverbot occured!');
            });
    }
}

module.exports = {class: CleverBotManager, deps: [], async: false, shortcode: 'cm'};
