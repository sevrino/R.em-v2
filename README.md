# レム

<h4><img width=150 src=https://user-images.githubusercontent.com/4116708/28647479-b0eb104a-7267-11e7-9778-63becbbaa56b.png /><br>        プラス日本語！</h4>

Fork of Rem, a Discord bot, now discontinued by its author. All contained in a Docker container, ready to be deployed on Heroku. Includes new features geared towards Japanese Learning servers.

---


## Modifications compared to original Rem

- Fully containerized
- Fully re-implemented Cleverot module, now supporting current API
- Removed all NSFW commands
- Moderation features:
    - Logs all edited messages to some hardcoded channel ID
- Japanese commands:
    - `!w.kanji <kanji>` sends an embed with meanings, readings, misc infos, and uploads an animation of how to write the character
    - `!w.jisho [definition number] <keywords>` queries Jisho.org to send an embed with all relevant dictionary information
    - `!w.read <japanese sentence>` uses Mecab to generate a kana-only version of provided sentence
- Easter eggs commands:
    - `!w.master` to show who's really boss
    - `!w.react <letters>` makes Rem react to this message with letter emojis (hits rate-limitting fast)

## Building requirements:

### Configuration files

Place `main.json` and `keys.json` (format [below](#configuration-format)) in a folder called `config/`

### Resources

- Translations:
    - Run `git submodule init` and `git submodule update`
- Kanji stroke order animations:
    - Download [KanjiVG main SVGs](https://github.com/KanjiVG/kanjivg/releases)
    - Generate animation gifs with [Kanimaji](https://github.com/maurimo/kanimaji)
    - Use the default settings, but with a white background and only produce gifs
    - Use `scripts/kanimaji_batch.py` to generate animations for all SVGs (takes about 20 hours on a MBP 2016)
    - Archive all generated GIFs in a compressed tarall named `kanji.tar.gz` located in `kanji/`
- Kanji information:
    - Download the [JSON version of KANJIDIC2](https://github.com/shawnps/kanjidic2-json)
    - Use `scripts/convert_kanjidic2.py` to convert it to a more convenient format
    - Place output in `kanji/kanji.json`


### Configuration format

`config/main.json` (remove comments if copy/pasting):

```python
{
    "owner"             : "Username#Discriminant",
    "owner_id"          : "Owner ID",
    "environment"       : "development",
    "no_error_tracking" : true, # Bug tracker, unused, leave true
    "token"             : "Discord App Bot Token", # https://discordapp.com/developers/applications/me
    "client_id"         : "Discord App Client ID",
    "bot_id"            : "Discord App Client ID", # Yes, twice :|
    "cleverbot_api_key" : "Cleverbot API Key", # cleverbot.com, not .io
    "use_ws"            : false, # False if only one shard
    "mongo_hostname"    : "mongodb://host:port/dbname",
    "redis_enabled"     : true,
    "redis_database"    : 2,
    "redis_hostname"    : "Redis host", # Port is automatically set to 6379
    "sentry_token"      : "", # Leave blbank
    "master_hostname"   : "", # Leave blank
    "shard_token"       : "", # Leave blank
    # Rest is unused for now
    "osu_token"         : "",
    "osu_username"      : "",
    "osu_password"      : "",
    "soundcloud_key"    : "",
    "anilist_secret"    : "",
    "anilist_id"        : "",
    "lbsearch_sfw_key"  : "",
    "mashape_key"       : ""
}
```

`config/keys.json`:

```json
{
    "keys": [
        "YouTube API Key"
    ]
}
```
