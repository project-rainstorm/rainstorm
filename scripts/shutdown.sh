#!/bin/bash
#
# For safely turning off the device
#
# Stop all the docker containers
docker stop $(docker ps -aq)
# shutdown the device
poweroff
