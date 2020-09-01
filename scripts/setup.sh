#!/bin/bash
# shellcheck disable=SC2034


#
# Configuration
#
DEFAULT_USER="drop"
DEFAULT_PASS="drop"
HOSTNAME="rainstorm"
REPO_NAME="project_rainstorm"

#
# Package dependencies associative array
#
declare -A package_dependencies=(
    [vim]=vim
    [git]=git
    [python3]=python3
    [python3-dev]=python3-dev
    [python3-pip]=python3-pip
    [libffi-dev]=libffi-dev
    [libssl-dev]=libssl-dev
)

#
# Terminal Colors
#
RED=$(tput setaf 1)
YELLOW=$(tput setaf 3)
NC=$(tput sgr0)
# No Color

#
# Countdown timer
# Usage: _sleep <seconds> --msg "your message"
#
_sleep() {
    local secs msg verbose
    secs=1 verbose=false

    # Parse Arguments
    while [ $# -gt 0 ]; do
        case "$1" in
            (*[0-9]*)
                secs="$1"
                shift
                ;;
            --msg)
                msg="$2"
                verbose=true
                shift 2
                ;;
        esac
    done

    while [ "$secs" -gt 0 ]; do
        if $verbose; then
            echo -ne "${msg} $secs\033[0K seconds...\r"
        fi
        sleep 1
        : $((secs--))
    done
    echo -e "\n" # Add new line
}

echo -e "${RED}"
echo "***"
echo "Setting up system in 10s.."
echo "***"
echo -e "${NC}"
_sleep 10

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
cp -r /root/$REPO_NAME /home/drop

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

cat <<EOF
${RED}
***
Creating /mnt/usb directory...
***
${NC}
EOF

test -d /mnt/usb || mkdir /mnt/usb
_sleep 2
# test for /mnt/usb directory, otherwise creates using mkdir
# websearch "bash Logical OR (||)" for info

echo -e "${RED}"
echo "***"
echo "Mounting drive..."
echo "***"
echo -e "${NC}"
_sleep 2
mount /dev/sda1 /mnt/usb
_sleep
# mount main storage drive to /mnt/usb directory

echo -e "${RED}"
echo "***"
echo "Displaying the name on the external disk..."
echo "***"
echo -e "${NC}"
_sleep 2
lsblk -o NAME,SIZE,LABEL /dev/sda1
_sleep 2
# double-check that /dev/sda exists, and that its storage capacity is what you expected

echo -e "${RED}"
echo "***"
echo "Check output above for /dev/sda1 and make sure everything looks ok."
echo "***"
echo -e "${NC}"
df -h /dev/sda1
_sleep 4
# checks disk info

if grep -Fxq "/dev/sda1" /etc/fstab
then
    # code if found
    echo -e "${RED}"
    echo "***"
    echo "Adding fstab entry to auto mount external disk..."
    echo "***"
    echo -e "${NC}"
    echo '/dev/sda1    /mnt/usb    ext4    defaults    0    0' >> /etc/fstab
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
