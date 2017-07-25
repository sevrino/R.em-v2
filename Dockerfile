FROM mhart/alpine-node:latest

RUN apk update && apk add --no-cache git mongodb redis ffmpeg python2 build-base

RUN cd /tmp && \
    wget http://pkgs.fedoraproject.org/repo/pkgs/mecab/mecab-0.996.tar.gz/7603f8975cea2496d88ed62545ba973f/mecab-0.996.tar.gz && \
    wget http://pkgs.fedoraproject.org/repo/pkgs/mecab-ipadic/mecab-ipadic-2.7.0-20070801.tar.gz/e09556657cc70e45564c6514a6b08495/mecab-ipadic-2.7.0-20070801.tar.gz && \
    tar xf mecab-0.996.tar.gz && \
    tar xf mecab-ipadic-2.7.0-20070801.tar.gz && \
    cd mecab-0.996 && \
    ./configure && \
    make && \
    make install && \
    cd ../mecab-ipadic-2.7.0-20070801/ && \
    ./configure --with-charset=utf8 && \
    make && \
    /usr/local/libexec/mecab/mecab-dict-index -f euc-jp -t utf-8 && \
    make install && \
    rm -rf /tmp/mecab*

COPY . /rem-v2/
WORKDIR /rem-v2

RUN npm install

RUN mkdir temp audio db
COPY ./config/keys.json ./config/main.json config/

COPY ./src/dummy.js /
COPY ./src/run.sh /

CMD /run.sh
