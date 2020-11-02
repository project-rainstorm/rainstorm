#!/bin/bash

SERVICE_NAME=filebrowser

# When docker mounts a file, the file must exist.
mkdir -p $path_to_service_data/$SERVICE_NAME/
touch $path_to_service_data/$SERVICE_NAME/.$SERVICE_NAME.json
touch $path_to_service_data/$SERVICE_NAME/database.db
