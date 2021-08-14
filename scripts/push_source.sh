#!/bin/bash

# Path Settings
RPIST_REMOTE_ROOT='~/RPIST' # directory created remotely for syncing codebase

RPI_USERNAME=pi   # username for rpi endpoint
RPI_IP=10.0.1.184 # ip address for rpi endpoint

if [[ -z $RPIST_LOCAL_ROOT ]]; then
    echo 'RPIST_LOCAL_ROOT env var not set'
    exit 1
fi

rsync -a --exclude 'node_modules' $RPIST_LOCAL_ROOT pi@$RPI_IP:$RPIST_REMOTE_ROOT