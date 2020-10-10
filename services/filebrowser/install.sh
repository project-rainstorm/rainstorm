#!/bin/bash

SERVICE_NAME=filebrowser

# When docker mounts a file, the file must exist.
mkdir -p /mnt/usb/apps/$SERVICE_NAME/
touch /mnt/usb/apps/$SERVICE_NAME/.filebrowser.json
touch /mnt/usb/apps/$SERVICE_NAME/database.db
