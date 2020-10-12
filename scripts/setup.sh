#!/bin/bash
# shellcheck disable=SC2034

# Check for root
if [ "$EUID" != 0 ]; then
    sudo bash "$0" "$@"
    exit $?
fi

my_dir="$(dirname "$0")"
source "$my_dir"/defaults.sh
source "$my_dir"/functions.sh

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

#
# Validation
#

if [ ! -e $PRIMARY_STORAGE ]; then
  _log "No external disk detected. Plug in your hard drive and run this script again."
  exit 1
fi # check that disk plugged in

if [ $# -ge 1 ]
then
  if [ $1 = "--dev" ]
  then
    INSTALL_DEV=1
    _log "Developer Installation"
    _log "Welcome aboard, fellow hacker."
  fi
fi # check for --dev argument
_log "Setting up system in 10s..."
_sleep 10

_log "Creating ${PRIMARY_STORAGE_MOUNT} directory..."
test -d $PRIMARY_STORAGE_MOUNT || mkdir -p $PRIMARY_STORAGE_MOUNT
_sleep 2
# test for PRIMARY_STORAGE_MOUNT directory, otherwise creates using mkdir
# websearch "bash Logical OR (||)" for info

_log "Mounting drive..."
findmnt "${PRIMARY_STORAGE}" 1>/dev/null || mount "${PRIMARY_STORAGE}" "${PRIMARY_STORAGE_MOUNT}"
_sleep 2

FS_TYPE=$(df -Th | grep "^${PRIMARY_STORAGE}" | awk '{print $2}')
if [ -z "$FS_TYPE" ]
then
  echo "Your external drive cannot be mounted."
  echo "Erase everyting and try again? [y/N]"
  read ANSWER
  if [ $ANSWER = "y" ] || [ $ANSWER = "Y" ] || [ $ANSWER = "yes" ]; then
    _log "Formatting the drive..."
    _sleep 2

    if ! create_fs --label "main" --device "${PRIMARY_STORAGE}" --mountpoint "${PRIMARY_STORAGE_MOUNT}"; then
      echo -e "${RED}Filesystem creation failed! Exiting${NC}"
      exit 1
    fi
  else
      echo -e "${RED}Drive refused to mount! Exiting${NC}"
      exit 1
  fi
fi
# Get FS_TYPE again just in case it was unreadable the first time
FS_TYPE=$(df -Th | grep "^${PRIMARY_STORAGE}" | awk '{print $2}')
if [ $FS_TYPE != 'ext4' ]; then
  echo "Your external drive is using an unsupported format (${FS_TYPE})."
  echo "Erase everyting and format with ext4? [y/N]"
  read ANSWER
  if [ $ANSWER = "y" ] || [ $ANSWER = "Y" ] || [ $ANSWER = "yes" ]; then
    _log "Formatting the drive..."
    _sleep 2

    if ! create_fs --label "main" --device "${PRIMARY_STORAGE}" --mountpoint "${PRIMARY_STORAGE_MOUNT}"; then
      echo -e "${RED}Filesystem creation failed! Exiting${NC}"
      exit 1
    fi
    _log "Initializing drive..."
    mkdir -p $SERVICE_DATA
    chmod 0777 $SERVICE_DATA
    mkdir -p $FILE_STORAGE
  else
    echo -e "${RED}Unsupported drive format! Exiting${NC}"
    exit 1
  fi
else
  if [ -e $SERVICE_DATA ]; then
    _log "Familiar drive detected. Welcome back!"
  else
    echo "Your external drive is not from a previous installation."
    echo "Erase everyting and initalize drive? (optional) [y/N]"
    read ANSWER
    if [ $ANSWER = "y" ] || [ $ANSWER = "Y" ] || [ $ANSWER = "yes" ]; then
      _log "Unmounting drive..."
      umount $PRIMARY_STORAGE
      _sleep 2

      _log "Formatting the Drive..."
      _sleep 2

      if ! create_fs --label "main" --device "${PRIMARY_STORAGE}" --mountpoint "${PRIMARY_STORAGE_MOUNT}"; then
        echo -e "${RED}Filesystem creation failed! Exiting${NC}"
        exit 1
      fi

    else
      _log "Leaving existing files alone"
      _sleep 2
    fi
    _log "Initializing drive..."
    mkdir -p $SERVICE_DATA
    chmod 0777 $SERVICE_DATA
    mkdir -p $FILE_STORAGE
  fi
fi
_log "Displaying the name on the external disk..."
_sleep 2
lsblk -o NAME,SIZE,LABEL $PRIMARY_STORAGE
_sleep 2
# double-check that $PRIMARY_STORAGE exists, and that its storage capacity is what you expected
_log "Check output above for ${PRIMARY_STORAGE} and make sure everything looks ok."
df -h $PRIMARY_STORAGE
_sleep 4
# checks disk info

if grep -Fxq $PRIMARY_STORAGE /etc/fstab
then
    # code if found
    _log "Adding fstab entry to auto mount external disk..."
    echo "${PRIMARY_STORAGE}    ${PRIMARY_STORAGE_MOUNT}    ext4    defaults    0    0" >> /etc/fstab
else
    # code if not found
    _log "Disk already set to mount at boot"
fi

_log "Create "${DEFAULT_USER}" user with defualt password"
useradd -m $DEFAULT_USER
echo -e "${DEFAULT_PASS}\n${DEFAULT_PASS}" | passwd $DEFAULT_USER
usermod -aG sudo $DEFAULT_USER
cp -r /root/$REPO_NAME /home/$DEFAULT_USER
mkdir $USER_CONFIG_FOLDER
PW_HASH=$(echo -n $DEFAULT_PASS | sha256sum)
echo $PW_HASH > $USER_CONFIG_FOLDER/pw_sha256

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
usermod -aG docker $DEFAULT_USER

# BEGIN developer install
if [ $INSTALL_DEV -eq 1 ]
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

_log "Set hostname to "${HOSTNAME}""
hostnamectl set-hostname $HOSTNAME

_log "Finished with setup!"
_sleep 3

_log "You will be logged out of root in 10s..."
_sleep 10
cd /home/$DEFAULT_USER
su $DEFAULT_USER
bash # start a new shell to apply hostname changes
