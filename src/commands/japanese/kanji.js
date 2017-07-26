let Command = require('../../structures/command');

let pnfs = require("pn/fs");
let fs = require("fs");

var files = fs.readdirSync("../kanji/");

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
        let words = msg.content.split(' ').splice(1);
        if (words.length == 0 || words.length > 1 || words[0].length > 1) {
            msg.channel.createMessage(":x: Please query for exactly one character.");
            return;
        }
        
        var kanji = words[0][0];
        var kanjiFile = "0" + words[0].charCodeAt(0).toString(16) + "_anim.gif";

        if (!(files.includes(kanjiFile))) {
            msg.channel.createMessage(":x: Kanji not found or not a kanji.");
            return;
        }

        pnfs.readFile("../kanji/" + kanjiFile)
            .then(buffer => msg.channel.createMessage(":information_source: Here is the stroke order for 「" + kanji + "」:" , {
                "file": buffer,
                "name": kanji + ".gif"
            }))
            .catch(e => console.error(e));
    }
}
module.exports = Kanji;
