# Intro to Services

Services are the prepackaged apps that users can install and run from their device.
They are stored here in this folder and you can add one if you'd like!

# Overview

Each service has a folder which contains exactly 3 files.

- `docker-compose.yml`
- `service.json`
- `.env`

Additionally, there is an icon for every service stored in `raincloud/static/images`

Let's break down each of those files:

### `docker-compose.yml`

This file is the heart of the service. It tells docker everything it needs to download,
configure and run the service on the device.

We use ARM-based images only at this time. Only choose image repositories that are popular and well maintained.

### `service.json`

The contents of this file are passed to the front-end as `settings` JSON and used
to render information and form fields for the user-defined variables.

This file is tracked in git so do not use it like a database. This file is only meant to be read by the application. It is never to be written to.

### `.env`

This file stores environment variables that are automatically applied to the `docker-compose.yml` file.

Each user-defined variable is stored in the .env file. Other variables may be inserted if they are needed for docker.

This file is not tracked by git. The contents of your `.env` file are specific to your configuration.

# Adding a Service

1. create a folder here called `<service_name>`

2. create a `docker-compose.yml` file which loads user-defined variables from `ENV`

3. create a default `.env` with default variables set

4. create a `service.json` with information and field definitions for all user-defined variables

5. add a `.jpg` icon for the service to `raincloud/static/images/<service_name>.jpg`
