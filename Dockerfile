FROM node:10-alpine
LABEL NAME="aws-s3-component"
LABEL MAINTAINER Matt Baker "matt@bakermatt.com"
LABEL SUMMARY="This image is used to integrate AWS S3 operations into OIH"

RUN apk --no-cache add \
    python \
    make \
    g++ \
    libc6-compat

WORKDIR /usr/src/app

COPY package.json /usr/src/app

RUN npm install --production

COPY . /usr/src/app

RUN chown -R node:node .

USER node

ENTRYPOINT ["npm", "start"]