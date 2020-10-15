# Intro to Services

Services are the prepackaged apps that users can install and run from their device.
They are stored here in this folder and you can add one if you'd like!

# Overview

Each service folder can contain up to 3 files.

- `docker-compose.yml`
- `service.yml`
- `install.sh`

Additionally, each service has files which are in other folders.

- `raincloud/static/images/<service_name>.jpg`
- `/mnt/usb/apps/<service_name>/.env`

Let's break down each of those files:

### `docker-compose.yml`

This file is required.

This file is the heart of the service. It tells docker everything it needs to download,
configure and run the service on the device.

We use ARM-based images only at this time. Only choose image repositories that are popular and well maintained.

### `service.yml`

This file is required.

The contents of this file are passed to the front-end as `settings` JSON and used
to render information and form fields for the user-defined variables.

This file is tracked in git so do not use it like a database. This file is only meant to be read by the application. It is never to be written to.

### `raincloud/static/images/<service_name>.jpg`

This file is required.

This is the icon used for the service.

### `/mnt/usb/apps/<service_name>/.env`

This file is optional. It will be generated automatically based on the `var_fields` in `service.yml`.

This file stores environment variables that are automatically applied to the `docker-compose.yml` file.

Each user-defined variable is stored in the .env file. The contents of your `.env` file are specific to your configuration. It is stored in the service data folder on the HDD.

### `install.sh`

This file is optional.

The system will detect if this is the first time running a service. If there is an `install.sh` it will execute that script before running docker-compose.

If your service requires additional configuration for docker to do its thing, you can define that configuration here.

# Adding a Service

1. create a folder here called `<service_name>`

2. create a `docker-compose.yml` using variable names from the `.env`

3. create a `service.yml` with information and field definitions for all user-defined variables

4. add a `.jpg` icon for the service to `raincloud/static/images/<service_name>.jpg`
