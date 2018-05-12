#!/bin/sh

#stop and remove the mongo container id it's already running
CONT="$(docker ps -aq --filter name=docker-mongo-boilerplate)"
if [[ -n $CONT ]]; then
  docker stop $CONT
  docker rm $CONT
fi

#stop and remove the mongoadmin container id it's already running
#CONT1="$(docker ps -aq --filter name=docker-mongoexpress-boilerplate)"
#if [[ -n $CONT1 ]]; then
#  docker stop $CONT1
#  docker rm $CONT1
#fi


#start the mongo container
docker run --rm -d -p 27017:27017 \
--name docker-mongo-boilerplate \
-e MONGO_INITDB_ROOT_USERNAME=root \
-e MONGO_INITDB_ROOT_PASSWORD=example \
  aido179/docker-mongo-boilerplate:test

#start the mongoadmin
#docker run --rm -d -p 1234:1234 \
#  --name docker-mongo-admin-boilerplate \
#  -e CONN_NAME=appdb \
#  -e DB_USERNAME=root \
#  -e DB_PASSWORD=example \
#  -e DB_HOST=127.0.0.1 \
#  -e DB_NAME=appdb \
#  mrvautin/adminmongo
