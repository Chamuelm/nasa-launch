#!/bin/bash

docker run --rm -d \
           --name nasa-deno \
           -p 8000:8000 \
           chamuelm/nasa-deno