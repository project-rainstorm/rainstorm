#!/bin/bash
# shellcheck disable=SC2034

# Check for root
if [ "$EUID" != 0 ]; then
    sudo bash "$0" "$@"
    exit $?
fi

# Imports
scripts_dir="$(dirname "$0")"
root_dir="$(dirname $scripts_dir)"
source "$scripts_dir"/functions.sh
eval $(_parse $root_dir/config.yml)

#
# Package dependencies associative array
#
declare -A package_dependencies=(
    [vim]=vim
    [git]=git
    [restic]=restic
    [python3]=python3
    [python3-dev]=python3-dev
    [python3-pip]=python3-pip
    [libffi-dev]=libffi-dev
    [libssl-dev]=libssl-dev
)

declare -A dev_package_dependencies=(
    [nodejs]=nodejs
)
cat ${scripts_dir}/motd

_log "If you encounter any issues, report them on GitHub!"

#
# Validation
#

if [ ! -e $default_storage_device ]; then
  _log "No external disk detected. Plug in your hard drive and run this script again."
  exit 1
fi # check that disk plugged in
if [ $# -ge 1 ]
then
  if [ $1 = "--dev" ]
  then
    INSTALL_DEV=1
    _log "DEVELOPER: Welcome aboard, fellow hacker."
  fi
fi # check for --dev argument
_log "Starting setup in 10s..."
_sleep 6
_log "Three..."
_sleep
_log "Two..."
_sleep
_log "One..."
_sleep
_log "Liftoff!"
_sleep

_log "Creating ${default_storage_mount} directory..."
test -d $default_storage_mount || mkdir -p $default_storage_mount
_sleep 2
# test for default_storage_mount directory, otherwise creates using mkdir
# websearch "bash Logical OR (||)" for info

_log "Mounting drive..."
findmnt "${default_storage_device}" 1>/dev/null || mount "${default_storage_device}" "${default_storage_mount}"
_sleep 2

FS_TYPE=$(df -Th | grep "^${default_storage_device}" | awk '{print $2}')
if [ -z "$FS_TYPE" ]
then
  echo "Your external drive cannot be mounted."
  echo "Erase everyting and try again? [y/N]"
  read ANSWER
  if [ $ANSWER = "y" ] || [ $ANSWER = "Y" ] || [ $ANSWER = "yes" ]; then
    _log "Formatting the drive..."
    _sleep 2

    if ! create_fs --label "main" --device "${default_storage_device}" --mountpoint "${default_storage_mount}"; then
      echo -e "${RED}Filesystem creation failed! Exiting${NC}"
      exit 1
    fi
  else
      echo -e "${RED}Drive refused to mount! Exiting${NC}"
      exit 1
  fi
fi
# Get FS_TYPE again just in case it was unreadable the first time
FS_TYPE=$(df -Th | grep "^${default_storage_device}" | awk '{print $2}')
if [ $FS_TYPE != 'ext4' ]; then
  echo "Your external drive is using an unsupported format (${FS_TYPE})."
  echo "Erase everyting and format with ext4? [y/N]"
  read ANSWER
  if [ $ANSWER = "y" ] || [ $ANSWER = "Y" ] || [ $ANSWER = "yes" ]; then
    _log "Formatting the drive..."
    _sleep 2

    if ! create_fs --label "main" --device "${default_storage_device}" --mountpoint "${default_storage_mount}"; then
      echo -e "${RED}Filesystem creation failed! Exiting${NC}"
      exit 1
    fi
    _log "Initializing drive..."
    mkdir -p $path_to_service_data
    chmod 0777 $path_to_service_data
    mkdir -p $path_to_file_storage
  else
    echo -e "${RED}Unsupported drive format! Exiting${NC}"
    exit 1
  fi
else
  if [ -e $path_to_service_data ]; then
    _log "Familiar drive detected. Welcome back!"
  else
    echo "Your external drive is not from a previous installation."
    echo "Erase everyting and initalize drive? (optional) [y/N]"
    read ANSWER
    if [ $ANSWER = "y" ] || [ $ANSWER = "Y" ] || [ $ANSWER = "yes" ]; then
      _log "Unmounting drive..."
      umount $default_storage_device
      _sleep 2

      _log "Formatting the Drive..."
      _sleep 2

      if ! create_fs --label "main" --device "${default_storage_device}" --mountpoint "${default_storage_mount}"; then
        echo -e "${RED}Filesystem creation failed! Exiting${NC}"
        exit 1
      fi

    else
      _log "Leaving existing files alone"
      _sleep 2
    fi
    _log "Initializing drive..."
    mkdir -p $path_to_service_data
    chmod 0777 $path_to_service_data
    mkdir -p $path_to_file_storage
  fi
fi
_log "Displaying the name on the external disk..."
_sleep 2
lsblk -o NAME,SIZE,LABEL $default_storage_device
_sleep 2
# double-check that $default_storage_device exists, and that its storage capacity is what you expected
_log "Check output above for ${default_storage_device} and make sure everything looks ok."
df -h $default_storage_device
_sleep 4
# checks disk info

if grep -Fxq $default_storage_device /etc/fstab
then
    # code if found
    _log "Adding fstab entry to auto mount external disk..."
    echo "${default_storage_device}    ${default_storage_mount}    ext4    defaults    0    0" >> /etc/fstab
else
    # code if not found
    _log "Disk already set to mount at boot"
fi

_log "Create "${default_username}" user with defualt password"
useradd -m $default_username
echo -e "${default_password}\n${default_password}" | passwd $default_username
usermod -aG sudo $default_username
mkdir $path_to_user_config
PW_HASH=$(echo -n $default_password | sha256sum)
echo $PW_HASH > $path_to_password_hash_file

# Install system dependencies
for pkg in "${!package_dependencies[@]}"; do
  if hash "${pkg}" 2>/dev/null; then
    _log "${package_dependencies[$pkg]} already installed..."
    _sleep
  else
    _log "Installing ${package_dependencies[$pkg]}..."
    _sleep
    apt install -y "${package_dependencies[$pkg]}"
  fi
done
# websearch "bash associative array" for info
_log "Install rclone binary..."
curl https://rclone.org/install.sh | bash

_log "Install docker from get.docker.com..."
curl -sSL https://get.docker.com | sh

_log "Install docker-compose from pip..."
pip3 install docker-compose

_log "Add user to docker group..."
usermod -aG docker $default_username

# BEGIN developer install
if [ "$INSTALL_DEV" -eq 1 ]
then
  # Install system dependencies
  for pkg in "${!dev_package_dependencies[@]}"; do
    if hash "${pkg}" 2>/dev/null; then
      _log "${package_dependencies[$pkg]} already installed..."
      _sleep
    else
      _log "Installing ${dev_package_dependencies[$pkg]}..."
      _sleep
      apt install -y "${dev_package_dependencies[$pkg]}"
    fi
  done
  # websearch "bash associative array" for info
  _log "DEVELOPER: Installing yarn from yarnpkg.com..."
  curl -o- -L https://yarnpkg.com/install.sh | bash

  _log "DEVELOPER: Installing virtualenv with pip..."
  pip3 install virtualenv
fi # END developer install

_log "Set hostname to "${default_hostname}""
hostnamectl set-hostname $default_hostname

_log "Finished with setup!"
_sleep 3

_log "You will be logged out of root in 10s..."
_sleep 10
cd /home/$default_username
su $default_username
bash # start a new shell to apply hostname changes
