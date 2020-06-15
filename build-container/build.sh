#!/bin/sh

if [ "$#" -ne 2 ]; then
    echo "build.sh: construit l'application signauxfaibles-web dans un container docker"
    echo "usage: build.sh branch mode"
    echo "exemple: ./build.sh master production"
    echo ""
    echo "Modes disponibles: development preprod production"
    exit
fi

if [ -d workspace ]; then
    echo "supprimer ./workspace avant de continuer"
    exit
fi

# Checkout git
mkdir workspace
cd workspace
curl -LO "https://github.com/signaux-faibles/signauxfaibles-web/archive/$1.zip"

if [ $(openssl dgst -md5 $1.zip |awk '{print $2}') = '3be7b8b182ccd96e48989b4e57311193' ]; then
   echo "sources manquantes, branche probablement inexistante"
   exit
fi

unzip "$1.zip"
cd "signauxfaibles-web-$1"

# Build app
yarn install
npx vue-cli-service build --mode=$2

# Build docker
cd ../..
docker build -t sfweb --build-arg app="./workspace/signauxfaibles-web-$1/dist" .
docker save sfweb | gzip > sfweb.tar.gz

# Cleanup
rm -rf workspace
