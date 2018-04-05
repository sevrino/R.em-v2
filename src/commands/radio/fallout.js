let Command = require('../../structures/command');
let _ = require("lodash");
let Radio = require('../../structures/radio');
let SongTypes = require('../../structures/constants').SONG_TYPES;
/**
 * The addFalloutToQueueCommand
 * @extends Command
 *
 */
class AddFalloutToQueue extends Command {
    /**
     * Create the command
     * @param {Function} t - the translation module
     * @param {Object} v - the voice manager
     * @param mod
     */
    constructor({t, v, mod}) {
        super();
        this.cmd = 'fallout';
        this.cat = 'radio';
        this.needGuild = true;
        this.t = t;
        this.v = v;
        this.r = mod.getMod('raven');
        this.accessLevel = 0;
    }

    async run(msg) {
        let number = msg.content.split(' ').splice(1);
        if (number.length > 0) {
          number = number[0];
        } else {
          number = '7';
        }
        let msgSplit = msg.content.split(' ').splice(2, 1);
        let options = this.checkOptions(msgSplit);
        let radio = new Radio({
            id: `fallout_fm_${Date.now()}`,
            type: SongTypes.radio,
            title: 'fallout.fm',
            url: 'http://fallout.fm/',
            needsResolve: false,
            local: false,
            duration: 'live',
            streamUrl: 'http://46.101.243.245:8000/falloutfm'.concat(number).concat('.ogg');,
            live: true,
            needsYtdl: false,
            isOpus: false,
            radio: 'fallout.fm'
        });
        try {
            let res = await this.v.addRadioToQueue(msg, radio, options.instant, options.next);
            if (options.next) return msg.channel.createMessage(this.t('play.next', {
                song: res.title,
                lngs: msg.lang,
                user: `${msg.author.username}#${msg.author.discriminator}`
            }));
            if (options.instant) {
                return msg.channel.createMessage(this.t('play.success', {
                    song: res.title,
                    lngs: msg.lang,
                    user: `${msg.author.username}#${msg.author.discriminator}`
                }));
            }
            msg.channel.createMessage(this.t('qa.success', {song: res.title, lngs: msg.lang, user: res.queuedBy}));
        } catch (e) {
            if (e.t) {
                return msg.channel.createMessage(this.t(e.t, {lngs: msg.lang}));
            }
            return msg.channel.createMessage(this.t('generic.error', {lngs: msg.lang}))
        }
    }

    checkOptions(msgSplit) {
        let next = false;
        let instant = false;
        let index = _.indexOf(msgSplit, '-next');
        if (index > -1) {
            next = true;
        }
        index = _.indexOf(msgSplit, '-play');
        if (index > -1) {
            instant = true;
        }
        return {next, instant};
    }
}
module.exports = AddFalloutToQueue;
