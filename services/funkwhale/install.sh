#!/bin/bash

FUNKWHALE_VERSION="1.0.1"
ARCH="arm"

# create env with django secret key
DATA_DIR=$path_to_service_data/funkwhale
mkdir -p $DATA_DIR
DJANGO_SECRET_KEY=$(openssl rand -hex 45)
echo "DJANGO_SECRET_KEY=${DJANGO_SECRET_KEY}" >> $DATA_DIR/.env

# build all-in-one image
cd /tmp
git clone https://github.com/thetarkus/docker-funkwhale.git
cd docker-funkwhale

# download the pre-built front-end files
# download Funkwhale front and api artifacts and nginx configuration
./scripts/download-artifact.sh src/ $FUNKWHALE_VERSION build_front
./scripts/download-artifact.sh src/ $FUNKWHALE_VERSION build_api
./scripts/download-nginx-template.sh src/ $FUNKWHALE_VERSION

docker build --build-arg=arch=$ARCH -t funkwhale/all-in-one:$FUNKWHALE_VERSION .
