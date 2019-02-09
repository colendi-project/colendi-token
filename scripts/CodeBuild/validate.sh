#!/bin/bash

# Initialize contract URL
contractUrl=""
if [ "$1" == "dev" ]
then
    contractUrl="api-dev.colendilabs.com"
fi

if [ "$1" == "stage" ]
then
    contractUrl="api-stage.colendilabs.com"
fi

if [ "$1" == "prod" ]
then
    contractUrl="api.colendilabs.com"
fi

apiPath="contract/detail/token"
checkUrl="https://$contractUrl/$apiPath"

# API status check
result=$(curl -s -o /dev/null -I -w "%{http_code}" "$checkURL")
if [[ "${result:0:1}" =~ "0" ]]; then
    printf 'Validation failed with error code "%d"\n' "$?" >&2
    exit 1
else
    echo "success"
    exit 0
fi