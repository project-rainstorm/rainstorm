#!/bin/bash
#
# Change Linux Password
# Change password for services
# Write new password hash file
#
source "$HOME"/project_rainstorm/scripts/defaults.sh

PASSWORD=$1
HASH_SHA256=$(echo -n "$PASSWORD" | sha256sum | awk '{print $1}')

# If pass did not change and all hash files exist, exit success
if [ -f $PW_HASH_FILE ]; then
    OLD_HASH_SHA256=$(cat $PW_HASH_FILE)
    if [ "$OLD_HASH_SHA256" = "$HASH_SHA256" ]; then
        exit 0;
    fi
fi


# Change Linux Password
echo "admin:$PASSWORD" | chpasswd

# Change Restic backup repo password
# WARNING: this requires user input of new password
# Maybe we need another backups tool that allows changing password with a single command
#
# restic -r rclone:dropcloud:backups/$USER_KEY key passwd --password-file $PW_HASH_FILE

# DO THIS LAST: Save hashed password
echo "$HASH_SHA256" > $PW_HASH_FILE
