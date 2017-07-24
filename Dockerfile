FROM mhart/alpine-node:latest

RUN apk update && apk add --no-cache git mongodb redis ffmpeg python2 build-base

RUN git clone https://github.com/rem-bot-industries/rem-v2.git && \
    cd rem-v2 && \
    npm install 

RUN cd rem-v2 && \
    git submodule init && \
    git submodule update

COPY ./src/dummy.js /

WORKDIR /rem-v2
RUN mkdir temp audio config db

COPY ./config/main.json /rem-v2/config
COPY ./config/keys.json /rem-v2/config

COPY ./src/run.sh /
CMD /run.sh
