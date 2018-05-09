/**
 * Created by julia on 27.01.2017.
 */
let Command = require('../../structures/command');
let axios = require('axios');
const Menu = require('../../structures/menu');
class AnimeSearch extends Command {
    constructor({t}) {
        super();
        this.cmd = 'anime';
        this.cat = 'fun';
        this.needGuild = false;
        this.t = t;
        this.accessLevel = 0;
        this.needsArguments = true;
    }

    async run(msg) {
        let searchQuery = msg.content.substring(msg.prefix.length + this.cmd.length + 1);
        if (!searchQuery) return await msg.channel.createMessage(this.t('generic.empty-search', {lngs: msg.lang}));
        try {
            let animeRequest = await axios({
                url: `https://graphql.anilist.co/`,
                method: `post`,
                data: {
                    query: `query {
                          Page {
                            media(search: "${searchQuery}", type: ANIME) {
                              id
                              title {
                                romaji
                                english
                              }
                              coverImage {
                                large
                              }
                              description
                              genres
                              averageScore
                              episodes
                            }
                          }
                        }`
                }
            });
            if (animeRequest.data.data.Page.media.length === 0) {
                return msg.channel.createMessage(this.t('define.no-result', {lngs: msg.lang, term: searchQuery}));
            }
            if (animeRequest.data.data.Page.media.length === 1) {
                let characters = await this.loadCharacters(animeRequest.data.data.Page.media[0].id);
                let embed = this.buildResponse(msg, animeRequest.data.data.Page.media[0], characters);
                return msg.channel.createMessage(embed);
            } else if (animeRequest.data.data.Page.media.length > 1) {
                let pick = await new Menu(this.t('search.anime', {lngs: msg.lang}), this.t('menu.guide', {lngs: msg.lang}), animeRequest.data.data.Page.media.map(a => {
                    if (a.title.english !== a.title.romaji) {
                        if (a.title.english === null) {
                            return a.title.romaji
                        } else {
                            return `${a.title.romaji} | ${a.title.english}`
                        }
                    } else {
                        return a.title.romaji
                    }
                }).slice(0, 10), this.t, msg);
                if (pick === -1) {
                    return msg.channel.createMessage(this.t('generic.cancelled-command', {lngs: msg.lang}));
                }
                if (pick > -1) {
                    let anime = animeRequest.data.data.Page.media[pick];

                    let characters = await this.loadCharacters(anime.id);
                    let embed = this.buildResponse(msg, anime, characters);
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

    async loadCharacters(id) {
        let characterRequest = await axios({
            url: `https://graphql.anilist.co/`,
            method: `post`,
            data: {
                query: `query {
                      Media(id: ${id}, type: ANIME) {
                        characters(page: 1, sort: [ROLE]) {
                          edges {
                            role
                            node {
                              id
                              name {
                                first
                                last
                              }
                            }
                          }
                        }
                      }
                    }`
            }
        });
        return characterRequest.data.data.Media.characters.edges;
    }

    buildResponse(msg, data, characters) {
        let description = data.description.replace(/<br>/g, '');
        description = description.replace(/\n|\r|\\n|\\r/g, '');
        description = description.replace(/&mdash;/g, '');
        description = description.replace(/&#039;/g, '');
        description = description.split('.').join('.\n\n');
        if (description.length > 1024) {
            description = description.substring(0, 1020);
            description += '...';
        }
        let mainCharacters = characters.filter((c) => {
            return c.role === 'MAIN';
        });
        let characterString = mainCharacters.map(c => {
            return `[${c.node.name.first}${c.node.name.last ? ` ${c.node.name.last}` : ''}](https://anilist.co/character/${c.node.id})`
        });
        characterString = characterString.join(', ');
        let titleString = "";
        if (data.title.english !== data.title.romaji) {
            if (data.title.english === null) {
                titleString = data.title.romaji;
            } else {
                titleString = `${data.title.romaji} | ${data.title.english}`;
            }
        } else {
            titleString = data.title.romaji;
        }
        return {
            embed: {
                "title": titleString,
                "description": description,
                "url": `https://anilist.co/anime/${data.id}/`,
                "color": 0x00ADFF,
                "footer": {
                    "text": `⭐${this.t('anime.score', {lngs: msg.lang})}: ${data.averageScore !== null ? data.averageScore : 0}/100`
                },
                "image": {
                    "url": data.coverImage.large
                },
                "fields": [
                    {
                        "name": `:movie_camera: ${this.t('anime.genres', {lngs: msg.lang})}`,
                        "value": `**${data.genres.join(', ')}**`
                    },
                    {
                        "name": `:1234: ${this.t('anime.episodes', {lngs: msg.lang})}`,
                        "value": `**${data.episodes > 0 ? data.episodes : `${this.t('generic.unknown', {lngs: msg.lang})}` }**`
                    },
                    {
                        "name": `:man_dancing: ${this.t('anime.characters', {lngs: msg.lang})}`,
                        "value": `**${characterString}**`
                    }
                ]
            }
        };
    }
}
module.exports = AnimeSearch;