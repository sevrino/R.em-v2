let Command = require('../../structures/command');

let StringDecoder = require('string_decoder').StringDecoder;
let cp = require('child_process')

function katakanaToHiragana(katakana) {
    var hiragana = '';
    for (var i = 0; i < katakana.length; ++i) {
        let n = katakana[i].charCodeAt(0);
        if (n > 0x30A0 && n <= 0x30FA) {
            n -= 0x60;
        }
        hiragana += String.fromCharCode(n);
    }
    return hiragana;
}

function mecab(input, callback) {
    let decoder = new StringDecoder('utf8');
    var c = cp.spawn('mecab', ['-F%FC[7]・', '-E\\s'])

    c.stdin.write(input + '\n');
    c.stdout.on('data', data => {
        var katakana = decoder.write(data);
        var hiragana = katakanaToHiragana(katakana);
        callback(hiragana.slice(0, -2));
    });
    c.stdin.end();
}

class Read extends Command {
    constructor({t}) {
        super();
        this.cmd = 'read';
        this.cat = 'japanese';
        this.needGuild = false;
        this.t = t;
        this.accessLevel = 0;
    }

    run(msg) {
        var outside = this;
        var sentence = msg.content.split(' ');
        sentence.shift();
        sentence = sentence.join(' ').trim();

        if (sentence === '') return msg.channel.createMessage(this.t('generic.empty-search', {lngs: msg.lang}));

        mecab(sentence, function(hiragana) {
            if (hiragana.includes("given index is out of")) return msg.channel.createMessage(outside.t('generic.error', {lngs: msg.lang}));

            msg.channel.createMessage({
                "content": "Let me read that for you:",
                "embed": {
                    "description": hiragana
                }
            });          
        });

    }
}
module.exports = Read;
