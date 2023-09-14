#!/bin/bash

export TITLE=${1:-""}
export FILE_NAME=${2:-""}
export NOW=$(date -Iseconds)

envsubst < post.template.md > ./content/posts/$FILE_NAME.md