#!/bin/bash
#
# Change Linux Password
# Change password for services
# Write new password hash file
#
my_dir="$(dirname "$0")"
source "$my_dir"/defaults.sh

PASSWORD=$1
HASH_SHA256=$(echo -n "$PASSWORD" | sha256sum | awk '{print $1}')

# If pass did not change and all hash files exist, exit success
if [ -f $PW_HASH_FILE ]; then
    OLD_HASH_SHA256=$(cat $PW_HASH_FILE)
    if [ "$OLD_HASH_SHA256" = "$HASH_SHA256" ]; then
        echo "Supplied password already set"
        exit 0;
    fi
fi


# Change Linux Password
echo "$DEFAULT_USER:$PASSWORD" | sudo chpasswd

# Save hashed password
echo "$HASH_SHA256" > $NEW_PW_HASH_FILE

# Change transmission password
sed -i '/PASS/d' $PROJECT_DIR/services/transmission/.env
echo "PASS=${PASSWORD}" >> $PROJECT_DIR/services/transmission/.env

# Change Restic backup repo password
# NOTE: restic needs both the old and new password in a file
#       for restic, we use the hash of the password as the password
restic -r $RESTIC_REPO --password-file $PW_HASH_FILE key passwd --new-password-file $NEW_PW_HASH_FILE

# Overwrite old password
# NOTE: Do this last!
mv $NEW_PW_HASH_FILE $PW_HASH_FILE
