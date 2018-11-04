#!/bin/sh

composer install
## create TMP build dir
mkdir build
rsync -av --progress --exclude-from="./bin/excludeFromBuild" ./* ./build/ongea
## TODO: settings.php
cd ./build
zip -r build.zip ./ongea/*
