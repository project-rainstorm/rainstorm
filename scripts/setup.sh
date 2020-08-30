#!/bin/bash

#
# Package dependencies associative array
#
declare -A package_dependencies=(
    [python3]=python3
    [ifconfig]=net-tools
    [htop]=htop
    [vim]=vim
    [unzip]=unzip
    [which]=which
    [wget]=wget
    [docker]=docker
    [docker-compose]=docker-compose
    [ufw]=ufw
    [rsync]=rsync
)

#
# Terminal Colors
#
RED=$(tput setaf 1)
YELLOW=$(tput setaf 3)
NC=$(tput sgr0)
# No Color


echo -e "${RED}"
echo "***"
echo "Setting up system in 10s.."
echo "***"
echo -e "${NC}"
_sleep 10

~/project_rainstorm/scripts/motd
# Show the logo

cp ~/project_rainstorm/scripts/motd /etc/motd
# create the motd

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
    sudo pacman -S --noconfirm "${package_dependencies[$pkg]}"
  fi
done
# install system dependencies, see defaults.sh
# websearch "bash associative array" for info


cat <<EOF
${RED}
***
Creating /mnt/usb directory...
***
${NC}
EOF

test -d /mnt/usb || sudo mkdir /mnt/usb
_sleep 2
# test for /mnt/usb directory, otherwise creates using mkdir
# websearch "bash Logical OR (||)" for info

echo -e "${RED}"
echo "***"
echo "Mounting drive..."
echo "***"
echo -e "${NC}"
_sleep 2
sudo mount /dev/sda1 /mnt/usb
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
