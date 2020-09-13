#!/bin/bash
#
# Configure rclone to use tardigrade public cloud
# Fetch access token from auth server
# Use restic for backups with rclone as the backend
# Set backup cron
#

source "$HOME"/project_rainstorm/scripts/defaults.sh

#
# aquire access grant if none
#
if [ -f "$BACKUPS_ACCESS_FILE" ]; then
	ACCESS=$(<$BACKUPS_ACCESS_FILE)
else
    echo "$BACKUPS_ACCESS_FILE does not exist."
    # TODO: use api to get access file
fi
#
# configure rclone
#
mkdir -p $RCLONE_CONFIG_FOLDER
echo "[dropcloud]
type = tardigrade
access_grant = ${ACCESS}" > $RCLONE_CONFIG_FOLDER/rclone.conf
#
# configure restic
#
restic --repo rclone:dropcloud:backups/$USER_KEY init --password-file $PW_HASH_FILE

# TODO: create backup cron if none
