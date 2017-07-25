let Command = require('../../structures/command');

let fs = require("pn/fs");

class Kanji extends Command {
    constructor({t}) {
        super();
        this.cmd = 'kanji';
        this.cat = 'japanese';
        this.needGuild = false;
        this.t = t;
        this.accessLevel = 0;
    }

    run(msg) {
        fs.readFile("../kanji/05929_anim.gif")
            .then(buffer => msg.channel.createMessage("Kanji:", {
                "file": buffer,
                "name": "kanji.gif"
            }))
            .catch(e => console.error(e));
    }
}
module.exports = Kanji;
