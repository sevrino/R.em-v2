/**
 * Created by Julian/Wolke on 15.11.2016.
 */

let axios = require('axios');
let Command = require('../../structures/command');
class LewdImage extends Command {
    constructor({t}) {
        super();
        this.cmd = 'lewd';
        this.cat = 'image';
        this.needGuild = false;
        this.t = t;
        this.accessLevel = 0;
    }

    async run(msg) {
        if (Math.random() > 0.7)
            return await msg.channel.createMessage('https://www.youtube.com/watch?v=qr89xoZyE1g');
        try {
            let res = await axios.get('https://rra.ram.moe/i/r', { params: { "type": this.cmd } });
            let path = res.data.path.replace('/i/', '');
            await msg.channel.createMessage(`https://cdn.ram.moe/${path}`);
        } catch (e) {
            return winston.error(e);
        }
    }
}
module.exports = LewdImage;
