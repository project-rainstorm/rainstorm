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

We use ARM-based images only at this time.

### `service.json`

This file is used to store arbitrary data about the service. Examples include, the
name, description, helpful links, and most importantly, user-defined variables.

The back-end uses this file like a database in order to read and store user-defined
variables. The backend uses this file as the "source of truth" when it generates
the `.env` file

The contents of this file are passed to the front-end as `settings` JSON and used
to render information and form fields for the user-defined variables.

### `.env`

This file stores environment variables that are derived from the user-defined
variables kept in `service.json`.

This file is automatically consumed by docker-compose when the command is run.

It is regenerated each time a user-defined variable changes for the service.

The `.env` file is only needed if the service has user-defined variables.

# Adding a Service

1. create a folder here called `<service_name>`

2. create a `docker-compose.yml` file which loads user-defined variables from `ENV`

3. create a default `.env` with default variables set

4. create a `service.json` with information and field definitions for all user-defined variables

5. add a `.jpg` icon for the service to `raincloud/static/images/<service_name>.jpg`
