#!/bin/bash
# shellcheck disable=SC2034

# Check for root
if [ $EUID != 0 ]; then
    sudo "$0" "$@"
    exit $?
fi

source "$HOME"/project_rainstorm/scripts/defaults.sh
source "$HOME"/project_rainstorm/scripts/functions.sh

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
# Terminal Colors
#
RED=$(tput setaf 1)
YELLOW=$(tput setaf 3)
NC=$(tput sgr0)
# No Color


#
# Validation
#

if [ ! -e $PRIMARY_STORAGE ]; then
  echo -e "${RED}"
  echo "***"
  echo "No external disk detected. Plug in your hard drive and run this script again."
  echo "***"
  echo -e "${NC}"
  exit 1
fi # check that disk plugged in

if [ $# -ge 1 ]
then
  if [ $1 = "--dev" ]
  then
    INSTALL_DEV=1
    echo -e "${RED}"
    echo "***"
    echo "Developer Installation"
    echo "***"
    echo -e "${NC}"
    echo -e "${RED}"
    echo "***"
    echo "Welcome aboard, fellow hacker."
    echo "***"
    echo -e "${NC}"
  fi
fi # check for --dev argument

echo -e "${RED}"
echo "***"
echo "Setting up system in 10s..."
echo "***"
echo -e "${NC}"
_sleep 10

cat <<EOF
${RED}
***
Creating ${PRIMARY_STORAGE_MOUNT} directory...
***
${NC}
EOF

test -d $PRIMARY_STORAGE_MOUNT || mkdir -p $PRIMARY_STORAGE_MOUNT
_sleep 2
# test for PRIMARY_STORAGE_MOUNT directory, otherwise creates using mkdir
# websearch "bash Logical OR (||)" for info

echo -e "${RED}"
echo "***"
echo "Mounting drive..."
echo "***"
echo -e "${NC}"
findmnt "${PRIMARY_STORAGE}" 1>/dev/null || mount "${PRIMARY_STORAGE}" "${PRIMARY_STORAGE_MOUNT}"
_sleep 2

FS_TYPE=$(df -Th | grep "^${PRIMARY_STORAGE}" | awk '{print $2}')
if [ -z "$FS_TYPE" ]
then
  echo "Your external drive cannot be mounted."
  echo "Erase everyting and try again? [y/N]"
  read ANSWER
  if [ $ANSWER = "y" ] || [ $ANSWER = "Y" ] || [ $ANSWER = "yes" ]; then
    echo -e "${RED}"
    echo "***"
    echo "Formatting the Drive..."
    echo "***"
    echo -e "${NC}"
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
    echo -e "${RED}"
    echo "***"
    echo "Formatting the Drive..."
    echo "***"
    echo -e "${NC}"
    _sleep 2

    if ! create_fs --label "main" --device "${PRIMARY_STORAGE}" --mountpoint "${PRIMARY_STORAGE_MOUNT}"; then
      echo -e "${RED}Filesystem creation failed! Exiting${NC}"
      exit 1
    fi

    echo -e "${RED}"
    echo "***"
    echo "Initializing drive..."
    echo "***"
    echo -e "${NC}"
    mkdir -p $SERVICE_DATA
    mkdir -p $FILE_STORAGE
  else
    echo -e "${RED}Unsupported drive format! Exiting${NC}"
    exit 1
  fi
else
  if [ -e $SERVICE_DATA ]; then
    echo -e "${RED}"
    echo "***"
    echo "Familiar drive detected. Welcome back!"
    echo "***"
    echo -e "${NC}"
  else
    echo "Your external drive is not from a previous installation."
    echo "Erase everyting and initalize drive? (optional) [y/N]"
    read ANSWER
    if [ $ANSWER = "y" ] || [ $ANSWER = "Y" ] || [ $ANSWER = "yes" ]; then
      echo -e "${RED}"
      echo "***"
      echo "Unmounting drive..."
      echo "***"
      echo -e "${NC}"
      umount $PRIMARY_STORAGE
      _sleep 2

      echo -e "${RED}"
      echo "***"
      echo "Formatting the Drive..."
      echo "***"
      echo -e "${NC}"
      _sleep 2

      if ! create_fs --label "main" --device "${PRIMARY_STORAGE}" --mountpoint "${PRIMARY_STORAGE_MOUNT}"; then
        echo -e "${RED}Filesystem creation failed! Exiting${NC}"
        exit 1
      fi

    else
      echo -e "${RED}"
      echo "***"
      echo "Leaving existing files alone"
      echo "***"
      echo -e "${NC}"
      _sleep 2
    fi
    echo -e "${RED}"
    echo "***"
    echo "Initializing drive..."
    echo "***"
    echo -e "${NC}"
    mkdir -p $SERVICE_DATA
    mkdir -p $FILE_STORAGE
  fi
fi

echo -e "${RED}"
echo "***"
echo "Displaying the name on the external disk..."
echo "***"
echo -e "${NC}"
_sleep 2
lsblk -o NAME,SIZE,LABEL $PRIMARY_STORAGE
_sleep 2
# double-check that $PRIMARY_STORAGE exists, and that its storage capacity is what you expected

echo -e "${RED}"
echo "***"
echo "Check output above for ${PRIMARY_STORAGE} and make sure everything looks ok."
echo "***"
echo -e "${NC}"
df -h $PRIMARY_STORAGE
_sleep 4
# checks disk info

if grep -Fxq $PRIMARY_STORAGE /etc/fstab
then
    # code if found
    echo -e "${RED}"
    echo "***"
    echo "Adding fstab entry to auto mount external disk..."
    echo "***"
    echo -e "${NC}"
    echo "${PRIMARY_STORAGE}    ${PRIMARY_STORAGE_MOUNT}    ext4    defaults    0    0" >> /etc/fstab
else
    # code if not found
    echo -e "${RED}"
    echo "***"
    echo "Disk already set to mount at boot"
    echo "***"
    echo -e "${NC}"
fi

cat <<EOF
${RED}
***
Create "${DEFAULT_USER}" user with defualt password
***
${NC}
EOF
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
    cat <<EOF
${RED}
***
${package_dependencies[$pkg]} already installed...
***
${NC}
EOF
    _sleep
  else
    cat <<EOF
${RED}
***
Installing ${package_dependencies[$pkg]}...
***
${NC}
EOF
    _sleep
    apt install -y "${package_dependencies[$pkg]}"
  fi
done
# websearch "bash associative array" for info

cat <<EOF
${RED}
***
Install rclone binary...
***
${NC}
EOF
curl https://rclone.org/install.sh | bash

cat <<EOF
${RED}
***
Install docker from get.docker.com...
***
${NC}
EOF
curl -sSL https://get.docker.com | sh

cat <<EOF
${RED}
***
Install docker-compose from pip...
***
${NC}
EOF
pip3 install docker-compose

cat <<EOF
${RED}
***
Add user to docker group...
***
${NC}
EOF
usermod -aG docker $DEFAULT_USER

# BEGIN developer install
if [ $INSTALL_DEV -eq 1 ]
then
  # Install system dependencies
  for pkg in "${!dev_package_dependencies[@]}"; do
    if hash "${pkg}" 2>/dev/null; then
      cat <<EOF
${RED}
***
${package_dependencies[$pkg]} already installed...
***
${NC}
EOF
      _sleep
    else
      cat <<EOF
${RED}
***
Installing ${dev_package_dependencies[$pkg]}...
***
${NC}
EOF
      _sleep
      apt install -y "${dev_package_dependencies[$pkg]}"
    fi
  done
  # websearch "bash associative array" for info
  echo -e "${RED}"
  echo "***"
  echo "DEVELOPER: Installing yarn from yarnpkg.com..."
  echo "***"
  echo -e "${NC}"
  curl -o- -L https://yarnpkg.com/install.sh | bash

  echo -e "${RED}"
  echo "***"
  echo "DEVELOPER: Installing virtualenv with pip..."
  echo "***"
  echo -e "${NC}"
  pip3 install virtualenv
fi # END developer install

cat <<EOF
${RED}
***
Set hostname to "${HOSTNAME}"
***
${NC}
EOF
hostnamectl set-hostname $HOSTNAME

echo -e "${RED}"
echo "***"
echo "Finished with setup!"
echo "***"
echo -e "${NC}"
_sleep 3

echo -e "${RED}"
echo "***"
echo "You will be logged out of root in 10s..."
echo "***"
echo -e "${NC}"
_sleep 10
rm -r /root/$REPO_NAME
cd /home/$DEFAULT_USER
su $DEFAULT_USER
bash # start a new shell to apply hostname changes
