#!/bin/bash
# shellcheck disable=SC2034

# Source ZIP url
repo="https://github.com/project-rainstorm/rainstorm/zipball/master"

# Check for root
if [ "$EUID" != 0 ]; then
    sudo bash "$0" "$@"
    exit $?
fi

#
# Terminal Colors
#
RED=$(tput setaf 1)
NC=$(tput sgr0)

#
# Fancy Logging
# Usage: _log "your message here"
#
_log() {
  echo -e "${RED}"
  echo "***"
  echo "$1"
  echo "***"
  echo -e "${NC}"
}

#
# Parse YAML into ENV Vars
# Usage: _parse filename.yml
#

function _parse {
   local prefix=$2
   local s='[[:space:]]*' w='[a-zA-Z0-9_]*' fs=$(echo @|tr @ '\034')
   sed -ne "s|^\($s\):|\1|" \
        -e "s|^\($s\)\($w\)$s:$s[\"']\(.*\)[\"']$s\$|\1$fs\2$fs\3|p" \
        -e "s|^\($s\)\($w\)$s:$s\(.*\)$s\$|\1$fs\2$fs\3|p"  $1 |
   awk -F$fs '{
      indent = length($1)/2;
      vname[indent] = $2;
      for (i in vname) {if (i > indent) {delete vname[i]}}
      if (length($3) > 0) {
         vn=""; for (i=0; i<indent; i++) {vn=(vn)(vname[i])("_")}
         printf("%s%s%s=\"%s\"\n", "'$prefix'",vn, $2, $3);
      }
   }'
}

# Import Config
config="$(dirname "$0")/config.yml"
if test -f "$config"; then
  eval $(_parse $config)
else
  _log "Error: config.yml not found."
  _log "Download config and run this script again in the same directory."
  _log "Exiting"
  return 1
fi

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
    [python3-venv]=python3-venv
)

#
# Functions
#


#
# Create Filesystem
#
create_fs() {
    local supported_filesystems=("ext2" "ext3" "ext4" "xfs") fstype="ext4"

    # Parse Arguments
    while [ $# -gt 0 ]; do
        case "$1" in
            --fstype|-fs)
                if [[ ! "${supported_filesystems[*]}" =~ ${2} ]]; then
                    _log "Error: unsupported filesystem type ${2}"
                    _log "Available options are: ${supported_filesystems[@]}"
                    _log "Exiting"
                    return 1
                else
                    local fstype="$2"
                    shift 2
                fi
                ;;
            --label|-L)
                local label="$2"
                shift 2
                ;;
            --device|-d)
                local device="$2"
                shift 2
                ;;
            --mountpoint)
                local mountpoint="$2"
                shift 2
                ;;
            -*|--*=) # unsupported flags
                echo "Error: Unsupported flag $1" >&2
                exit 1
                ;;
        esac
    done

    # Create mount point directory if not available
    if [ ! -d "${mountpoint}" ]; then
        _log "Creating ${mountpoint} directory..."
        sudo mkdir -p "${mountpoint}" || return 1
    elif findmnt "${device}" 1>/dev/null; then # Is device already mounted?
        # Make sure to stop tor and docker when mount point is ${INSTALL_DIR}
        if [ "${mountpoint}" = "${INSTALL_DIR}" ]; then
            for x in tor docker; do
                sudo systemctl stop "${x}"
            done

            # Stop swap on mount point
            if ! check_swap "${INSTALL_DIR_SWAP}"; then
                sudo swapoff "${INSTALL_DIR_SWAP}"
            fi
        fi

        sudo umount -l "${device}"
    fi

    # This quick hack checks if device is either a SSD device or a NVMe device
    [[ "${device}" =~ "sd" ]] && _device="${device%?}" || _device="${device%??}"

    if [ ! -b "${device}" ]; then
        echo 'type=83' | sudo sfdisk -q "${_device}" 2>/dev/null
    else
        sudo sfdisk --quiet --wipe always --delete "${_device}" &>/dev/null
        # if device exists, use sfdisk to erase filesystem and partition table

        # wipe labels
        sudo wipefs -a --force "${_device}" &>/dev/null

        # reload partition table
        partprobe

        # Create a partition table with a single partition that takes the whole disk
        echo 'type=83' | sudo sfdisk -q "${_device}" 2>/dev/null
    fi
    _log "Using ${fstype} filesystem format for ${device} partition..."

    # Create filesystem
    if [[ $fstype =~ 'ext' ]]; then
        sudo mkfs."${fstype}" -q -F -L "${label}" "${device}" 1>/dev/null || return 1
    elif [[ $fstype =~ 'xfs' ]]; then
        sudo mkfs."${fstype}" -L "${label}" "${device}" 1>/dev/null || return 1
    fi

    # Sleep here ONLY, don't ask me why ask likewhoa!
    _sleep 5

    # systemd.mount unit file creation
    local uuid systemd_mount
    uuid=$(lsblk -no UUID "${device}")      # UUID of device
    local tmp=${mountpoint:1}               # Remove leading '/'
    local systemd_mountpoint=${tmp////-}    # Replace / with -

    # Check if drive unit file was previously created
    if [ -f /etc/systemd/system/"${systemd_mountpoint}".mount ]; then
        systemd_mount=true
    fi

    if ! grep "${uuid}" /etc/systemd/system/"${systemd_mountpoint}".mount &>/dev/null; then
        _log "Adding device ${device} to systemd.mount unit file"
        sudo bash -c "cat <<EOF >/etc/systemd/system/${systemd_mountpoint}.mount
[Unit]
Description=Mount External SSD Drive ${device}
[Mount]
What=/dev/disk/by-uuid/${uuid}
Where=${mountpoint}
Type=${fstype}
Options=defaults
[Install]
WantedBy=multi-user.target
EOF"
        # Mount filesystem
        _log "Mounting ${device} to ${mountpoint}"
    fi

    if $systemd_mount; then
        sudo systemctl daemon-reload
    fi

    sudo systemctl start "${systemd_mountpoint}".mount || return 1
    sudo systemctl enable "${systemd_mountpoint}".mount 2>/dev/null || return 1
    # mount drive to ${mountpoint} using systemd.mount


    return 0
}


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

#
# Begin setup
#

cat << EOF


                            rai       ns
                          tormrai    nsto
                    rm  rainstormra instorm
              ra   instormrainstormtrainstromrain
            stormrainstromrainstormrainstromrainstorm
          rainstromrainstormrainstromrainstormrainstro
                      / / / /  / / / / / / / /
                  /   / / / / / / /   / / / /
                    / / /   / /   / / / / /
                    / / / / / / / / / /
                  / /    / / /   / /

            ____ ____ _ _  _ ____ ___ ____ ____ _  _
            |__/ |__| | |\ | [__   |  |  | |__/ |\/|
            |  \ |  | | | \| ___]  |  |__| |  \ |  |

                                    Drip. Drop. Boom.

EOF

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

_log "Create "${default_username}" user with default password"
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

isInFile=$(cat /etc/hosts | grep -c "127.0.0.1        rainstorm")

if [ $isInFile -eq 0 ]; then
   #string not contained in file
   echo  "127.0.0.1        rainstorm" >> /etc/hosts
fi

_log "Finished with setup!"
_sleep 3

_log "You should restart to apply changes..."
_sleep 3
_log "Remember to log in with user: ${default_username} from now on..."
_sleep 10
