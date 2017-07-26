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
        this.cleverbot
            .query(message, {'cs': this.continuationStrings[msg.channel.id]})
            .then(response => {
                console.log("[cleverbot] msg-in: " + message);
                console.log("[cleverbot] cs-in: " + this.continuationStrings[msg.channel.id]);
                console.log("[cleverbot] cs-out: " + response.cs);
                msg.channel.createMessage(':pencil: ' + response.output);
                this.continuationStrings[msg.channel.id] = response.cs;
            })
            .catch(error => {
                console.error(error);
                return msg.channel.createMessage(':x: An error with cleverbot occured!');
            });
    }
}

module.exports = {class: CleverBotManager, deps: [], async: false, shortcode: 'cm'};