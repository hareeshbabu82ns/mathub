##################
# Server BUILDER #
##################

FROM node:18 as builder

WORKDIR /usr/src/app

COPY server/package.json ./
COPY server/yarn.lock ./

# RUN git init
RUN yarn install

COPY server/ .

RUN yarn build
# RUN npm audit fix

##############
# UI BUILDER #
##############

FROM node:20 as ui-builder
WORKDIR /usr/src/app
COPY ./client/package.json /usr/src/app
COPY ./client/package-lock.json /usr/src/app
# RUN git init
RUN npm install
COPY client/ /usr/src/app
RUN npm run build
# RUN ls /usr/src/app/build/

#########
# FINAL #
#########

FROM node:20-alpine

ENV APP_HOME=/home/app
ENV APP_SERVER=/home/app/server
ENV APP_WEB=/home/app/client/build
ENV DATA_DIR=/data

RUN mkdir $DATA_DIR

WORKDIR $APP_HOME
COPY --from=builder /usr/src/app $APP_SERVER
COPY --from=ui-builder /usr/src/app/dist $APP_WEB

EXPOSE 4000

# create the app user
RUN addgroup -S app \
  && adduser -S app -G app

# chown all the files to the app user
RUN chown -R app:app $APP_HOME \
  && chown -R app:app $DATA_DIR

# change to the app user
USER app

WORKDIR $APP_SERVER
CMD [ "yarn", "start" ]