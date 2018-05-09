/**
 * Created by julia on 27.01.2017.
 */
let Command = require('../../structures/command');
let axios = require('axios');
let winston = require('winston');
const Menu = require('../../structures/menu');
class AnimeSearch extends Command {
    constructor({t}) {
        super();
        this.cmd = 'char';
        this.cat = 'fun';
        this.aliases = ['character', 'animechar'];
        this.needGuild = false;
        this.t = t;
        this.accessLevel = 0;
        this.help = {
            short: 'help.char.short',
            usage: 'help.char.usage',
            example: 'help.char.example'
        };
        this.needsArguments = true;
    }

    async run(msg) {
        let searchQuery = msg.content.substring(msg.prefix.length + this.cmd.length + 1);
        if (!searchQuery) return await msg.channel.createMessage(this.t('generic.empty-search', {lngs: msg.lang}));
        try {
            let characterRequest = await axios({
                url: `https://graphql.anilist.co/`,
                method: `post`,
                data: {
                    query: `query {
                              Page {
                                characters(search: "${searchQuery}") {
                                  id
                                  name {
                                    first
                                    last
                                    native
                                  }
                                  image {
                                    medium
                                    large
                                  }
                                  description
                                }
                              }
                            }`
                }
            });
            if (characterRequest.data.data.Page.characters.length === 0) {
                return msg.channel.createMessage(this.t('define.no-result', {lngs: msg.lang, term: searchQuery}));
            }
            // console.log(characterRequest.data);
            if (characterRequest.data.data.Page.characters.length === 1) {
                let embed = this.buildResponse(characterRequest.data.data.Page.characters[0]);
                return msg.channel.createMessage(embed);
            } else if (characterRequest.data.data.Page.characters.length > 1) {
                let pick = await new Menu(this.t('search.anime', {lngs: msg.lang}), this.t('menu.guide', {lngs: msg.lang}), characterRequest.data.data.Page.characters.map(c => {
                    return `${c.name.first} ${c.name.last ? c.name.last : ''} ${c.name.native ? ('(' + c.name.native + ')') : ''}`
                }).slice(0, 15), this.t, msg);
                if (pick === -1) {
                    return msg.channel.createMessage(this.t('generic.cancelled-command', {lngs: msg.lang}));
                }
                if (pick > -1) {
                    let character = characterRequest.data.data.Page.characters[pick];
                    let embed = this.buildResponse(character);
                    return msg.channel.createMessage(embed);
                }
            } else {
                return msg.channel.createMessage(this.t('define.no-result', {lngs: msg.lang, term: searchQuery}));
            }
        } catch (e) {
            console.error(e);
            await msg.channel.createMessage(this.t('generic.error', {lngs: msg.lang}));
        }
    }

    buildResponse(data) {
        // console.log(data);
        let info = data.description.replace(/<br>/g, '');
        info = info.replace(/\n|\\n/g, '');
        info = info.replace(/&mdash;/g, '');
        info = info.replace(/&#039;/g, '');
        info = info.split('.').join('.\n\n');
        if (info.indexOf('~!') > -1 && info.indexOf('!~') > 1) {
            info = this.filterSpoilers(info);
        }
        if (info.length > 1024) {
            info = info.substring(0, 1020);
            info += '...';
        }
        let titleString = `${data.name.first} ${data.name.last ? data.name.last : ''} ${data.name.native ? ('(' + data.name.native + ')') : ''}`;
        return {
            embed: {
                "title": titleString,
                "description": info,
                "url": `https://anilist.co/character/${data.id}/`,
                "color": 0x00ADFF,
                "image": {
                    "url": data.image.large
                }
            }
        };
    }

    filterSpoilers(info) {
        let info1 = info.substring(0, info.indexOf('~!') - 1);
        info = info1.concat(info.substring(info.indexOf('!~') + 2));
        if (info.indexOf('~!') > -1 && info.indexOf('!~') > 1) {
            return this.filterSpoilers(info);
        }
        return info;
    }
}
module.exports = AnimeSearch;