FROM mhart/alpine-node:latest

RUN apk update && apk add --no-cache git mongodb redis ffmpeg python2 build-base

COPY . /rem-v2/
WORKDIR /rem-v2

RUN npm install

RUN mkdir temp audio db
COPY ./config/keys.json ./config/main.json config/

COPY ./src/dummy.js /
COPY ./src/run.sh /

CMD /run.sh
