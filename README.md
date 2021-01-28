![Rainstorm Logo](docs/img/logo.png)

The easiest way to own your cloud. Your data. Your cloud. Rainstorm.

## Getting Started

Head over to our downloads page to download an image for your device.
Alternatively, you can install on your own device (see Build Instructions)

## Overview

Rainstorm aims to be the easiest way to to run a dedicated, easy to use,
home server leveraging many popular and open source cloud alternatives that give you complete ownership and control of your data.

With the increasing power and affordability of small board computers like the Raspberry Pi, we believe it's finally feasible for everyone to own their cloud instead of giving everything they own to the cloud.

By running Rainstorm, you can quickly and cheaply deploy your own cloud infrastructure all from the web browser with ZERO terminal commands necessary.

## Features

Each installation of Rainstorm enables a number of wonderful features.

- Plex Media Server
- Transmission Torrent Client
- Filebrowser
- Minecraft Server
- Pi-hole

In the future, we'd also like to have...

- Data backup solutions
- Bitwarden Password Manager
- Nextcloud
- Wordpress Site
- Matrix chat server
- WireGaurd VPN
- Tor Relay
- Bitcoin Full Node
- Jitsi Server
- Email server
- Any service from [this list of open source projects](https://github.com/awesome-selfhosted/awesome-selfhosted) can also be added.

- ...and many more features!

## Screenshots

|            Home Screen            |             Service View              |             Device Settings             |
| :-------------------------------: | :-----------------------------------: | :-------------------------------------: |
| ![Home Screen](docs/img/home.png) | ![Service View](docs/img/service.png) | ![Settings Page](docs/img/settings.png) |

## Supported Devices

- Raspberry Pi 4

## Adding a Service

Rainstorm uses docker-compose for services. Pull requests are welcome. Checkout the [Services README.md](services/README.md) for more info on how to create services for Rainstorm.

## Running Rainstorm

You can run Rainstorm on your own device in just a few easy steps!

1. Download an image from our downloads page.

2. Flash image onto SD card

- Download [Etcher](https://www.balena.io/etcher/)
- Flash downloaded image

3. Insert SD card and attach external HD (highly recommended) to device

4. Boot your device and visit http://rainstorm.local or http://ip_of_device/

## Build Instructions

You can also run Rainstorm on your own.

Download the `config.yml`.

`curl -fsSL https://raw.githubusercontent.com/project-rainstorm/rainstorm/master/config.yml -o config.yml`

Download the setup script in the same directory as `config.yml`

`curl -fsSL https://raw.githubusercontent.com/project-rainstorm/rainstorm/master/scripts/setup.sh -o setup.sh`

**WARNING** Running this script will make changes to your system. This is meant to be run on a dedicated device with a freshly installed OS (RPi4 running Raspberry Pi OS Lite recommended. You are responsible for what you run.)

`bash setup.sh`

If you are a developer

`bash setup.sh --dev`

The script will walk you thru the installation. Check for any errors in the log. 

`sudo reboot`

Log back in as the default user `drop` with password `drop`. 

Or log in with the user/password you set in `config.yml`

Now you can clone this repo in your home directory

`cd && git clone https://github.com/project-rainstorm/rainstorm.git `

## Development Setup

After following the build instructions, you can run the app in development.

To run the API:

- 1. Create a virtual environemnt `python3 -m venv env`

- 2. Activate the virtual environment `source env/bin/activate`

- 3. Install packages `pip3 install -r requirements.txt`

- 4. `bash run_server.sh`

To run the react server:

- 1. `cd thunder`

- 2. Install packages `yarn install`

- 3. `yarn start`

Visit `http://rainstrorm.local:3000` 

## Contributing

The contribution workflow is described in [CONTRIBUTING.md](docs/CONTRIBUTING.md).
