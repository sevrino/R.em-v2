let Command = require('../../structures/command');
let adminId = remConfig.owner_id;

let emojiLetters = {
    "a": "🇦", "b": "🇧",
    "c": "🇨", "d": "🇩",
    "e": "🇪", "f": "🇫",
    "g": "🇬", "h": "🇭",
    "i": "🇮", "j": "🇯",
    "k": "🇰", "l": "🇱",
    "m": "🇲", "n": "🇳",
    "o": "🇴", "p": "🇵",
    "q": "🇶", "r": "🇷",
    "s": "🇸", "t": "🇹",
    "u": "🇺", "v": "🇻",
    "w": "🇼", "x": "🇽",
    "y": "🇾", "z": "🇿",
    "!": "❗", "?": "❓",
};

class React extends Command {
    constructor({mod}) {
        super();
        this.cmd = 'react';
        this.cat = 'admin';
        this.needGuild = false;
        this.accessLevel = 2;
        this.hidden = true;
        this.hub = mod.getMod('hub');
    }

    run(msg) {
        if (msg.author.id === adminId) {
            let letters = msg.content.split(' ').splice(1)[0];
            for (var i = 0; i < letters.length; ++i) {
                msg.addReaction(emojiLetters[letters[i]]);
            }
        }
    }
}
module.exports = React;
