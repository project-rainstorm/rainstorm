#!/bin/bash

my_dir="$(dirname "$0")"
source "$my_dir"/defaults.sh

# execute the backup
restic --repo rclone:dropcloud:backups/$USER_KEY backup $BACKUP_TARGET_FOLDER --password-file $PW_HASH_FILE
# cleanup the old snapshots
restic --repo rclone:dropcloud:backups/$USER_KEY forget --keep-last 2 --prune
