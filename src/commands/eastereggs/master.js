let Command = require('../../structures/command');

let config = remConfig;
class Master extends Command {
    constructor({t}) {
        super();
        this.cmd = 'master';
        this.cat = 'eastereggs';
        this.needGuild = false;
        this.t = t;
        this.accessLevel = 0;
        this.hidden = true;
    }

    run(msg) {
        function mention(author) {
            return '<@' + author.id + '>';
        }

        if (msg.author.id === config.owner_id) {
            msg.channel.createMessage('O ' + mention(msg.author) + '-sama, truly, you are my Master :bow:');
        } else if (msg.author.id % 7 == 1) {
            msg.channel.createMessage('Sorry, my Master is someone else...');
            setTimeout(function () {
                msg.channel.createMessage('*Hey... It\'s a secret, but I think Ram likes you* :blush: ');
                setTimeout(function() {
                    msg.channel.createMessage('*Here, I secretly took this picture when she was asleep...* https://goo.gl/bn8Bxh');
                }, 5000);
            }, 5000);
        } else {
            let rand = 1 + Math.floor(Math.random() * 100);
            if (rand < 33) {
                msg.channel.createMessage(mention(msg.author) + ', you will never be my Master.');
            } else if (rand < 66) {
                msg.channel.createMessage('It is ten years too early for me to even recognize ' + mention(msg.author) + "'s existence...");
            } else {
                msg.channel.createMessage('Pathetic... ' + mention(msg.author) + ', there was such a user on this server?');
            }
        }
    }
}
module.exports = Master;