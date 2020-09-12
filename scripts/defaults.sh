#!/bin/bash
#
# include these vars in your scripts with
# `source default.sh`

# User info
DEFAULT_USER="drop"
DEFAULT_PASS="drop"

# Project info
HOSTNAME="rainstorm"
REPO_NAME="project_rainstorm"
PRIMARY_STORAGE="/dev/sda1"
PRIMARY_STORAGE_MOUNT="/mnt/usb"

# Folders
USER_CONFIG_FOLDER=/home/$DEFAULT_USER/.dropcloud
RCLONE_CONFIG_FOLDER=/home/$DEFAULT_USER/.config/rclone
SERVICE_DATA=$PRIMARY_STORAGE_MOUNT/apps
FILE_STORAGE=$PRIMARY_STORAGE_MOUNT/files
BACKUP_TARGET_FOLDER=$SERVICE_DATA


# Files
PW_HASH_FILE=$USER_CONFIG_FOLDER/pw_sha256
BACKUPS_ACCESS_FILE=$USER_CONFIG_FOLDER/backups.access
PREMIUM_KEY_FILE=$USER_CONFIG_FOLDER/key


# grab the license key if it exists
if [ -f "$PREMIUM_KEY_FILE" ]; then
	USER_KEY=$(<$PREMIUM_KEY_FILE)
else
    echo "Premium license not activated!"
fi
