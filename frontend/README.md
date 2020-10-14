# Seistech Web App

## Naming

- **Filename** : PascalCase (ex: SiteSelection.js, SiteSelectionVS30.js) except index files (ex: index.js, index.html, index.css...)
- **Variables & Functions** : camelCase (ex: siteSelectionLng, siteSelectionLat) except the function is used to render a component (ex: HazardCurveSection.js)
- **HTML Class/ID Names** : All lower case and separate with a dash (ex:hi-my-name-is-tom)

## Overview

This is a React/javascript SPA, using Auth0 authentication, talking to a python flask API, running on a Linux host.

## Requirements - Frontend (seistech_web)

Please contact **Tom** to get values.

### DEVELOPMENT Version

You will need a `.env.dev` file with the following environment variables.

- REACT_APP_CONSTANT_CORE_API_BASE_URL=
- REACT_APP_DEFAULT_ANNUAL_EXCEEDANCE_RATE=0.013862943619741008
- REACT_APP_DEFAULT_LAT=-43.5381
- REACT_APP_DEFAULT_LNG=172.6474
- REACT_APP_ENV=DEV
- REACT_APP_MAP_BOX_TOKEN=
- REACT_APP_AUTH0_DOMAIN=
- REACT_APP_AUTH0_CLIENTID=
- REACT_APP_AUTH0_AUDIENCE=

#### To run Frontend: `npm run start:dev`

### EA Version

You will need a `.env.test` file with the following environment variables.

- REACT_APP_CONSTANT_CORE_API_BASE_URL=
- REACT_APP_ENV=EA
- REACT_APP_MAP_BOX_TOKEN=
- REACT_APP_AUTH0_DOMAIN=
- REACT_APP_AUTH0_CLIENTID=
- REACT_APP_AUTH0_AUDIENCE=

#### To run Frontend: `npm run start:ea`

## Requirements - Intermediate API (seistech_inter_api)

### With `~/.bashrc` (I encourage using this approach so you do not need to install another package.)

Add the following code to `~/.bashrc`

export ENV=dev
export AUTH0_DOMAIN=
export CORE_API_SECRET=
export API_AUDIENCE=
export ALGORITHMS=
export CORE_API_BASE=
export N_PROCS=
export INTER_PORT=

#### To run Intermediate API: `python app.py`

### With .env

You will need a `.env` file with the following environment variables.

- ENV=dev
- AUTH0_DOMAIN=
- CORE_API_SECRET=
- API_AUDIENCE=
- ALGORITHMS=
- CORE_API_BASE=
- N_PROCS=
- INTER_PORT=

You also have to install a Python package called `python-dotenv` by typing the following command.

`pip install -U python-dotenv`

Then add the following code to `server.py`

```python
from dotenv import load_dotenv
load_dotenv()
```

#### To run Intermediate API: `python app.py`

## Running locally

Assuming we are using Core API that is on Epicentre

**Make sure you have an access to `ucgmsim/seistech` git repo via SSH as we need to access private repo to download**

### Without Docker

Open a terminal to do the following steps

1. We need to install some packages for Intermediate API (a.k.a Proxy API).

To run this private_requirements, make sure to have SSH Key setup done with GitHub as we are installing packages from a private repo

```shell
cd ./seistech_inter_api/seistech_inter_api
pip install -r private_requirements.txt
pip install -r requirements.txt
```

2. After installation is done, run the following command

```shell
python app.py
```

Open another terminal to do the following steps

1. Change the directory to seistech_web

```shell
cd ./seistech_web
```

2. Install packages

```shell
npm install
```

3. Start an app

```shell
npm run start:dev or
npm run start:ea
```

**To achieve this, you need the following file**
`.env.dev` for DEV
`.env.test` for EA

Please check **Requirements** above.

### With Docker and docker-compose

#### Requirements

1. Docker
   Tested on Docker version 19.03.12
2. Docker-compose
   Tested on docker-compose version 1.26.2
3. Environment variables for docker-compose
   `.env` must be in the same directory with `docker-compose.yml`.

**`.env` for DEV**

AUTH0_DOMAIN_DEV=
API_AUDIENCE_DEV=
ALGORITHMS_DEV=
CORE_API_SECRET_DEV=
CORE_API_BASE_DEV=
INTER_API_PORT_DEV=
N_PROCS_DEV=

BASE_URL_DEV=
DEFAULT_ANNUAL_EXCEEDANCE_RATE=0.013862943619741008
DEFAULT_LAT=-43.5381
DEFAULT_LNG=172.6474
FRONT_END_PORT_DEV=

`BUILD_DATE_DEV` and `GIT_SHA_DEV` are from Dockerise.sh
`BUILD_DATE_DEV=${BUILD_DATE_DEV}`
`GIT_SHA_DEV=${GIT_SHA_DEV}`

REACT_APP_AUTH0_DOMAIN_DEV=
REACT_APP_AUTH0_CLIENTID_DEV=
REACT_APP_AUTH0_AUDIENCE_DEV=

REACT_APP_MAP_BOX_TOKEN_DEV=

**`.env` for EA**

AUTH0_DOMAIN_EA=
API_AUDIENCE_EA=
ALGORITHMS_EA=
CORE_API_SECRET_EA=
CORE_API_BASE_EA=
INTER_API_PORT_EA=
N_PROCS_EA=

BASE_URL_EA=
FRONT_END_PORT_EA=

`BUILD_DATE_EA` and `GIT_SHA_EA` are from Dockerise.sh
`BUILD_DATE_EA=${BUILD_DATE_EA}`
`GIT_SHA_EA=${GIT_SHA_EA}`

REACT_APP_AUTH0_DOMAIN_EA=
REACT_APP_AUTH0_CLIENTID_EA=
REACT_APP_AUTH0_AUDIENCE_EA=

REACT_APP_MAP_BOX_TOKEN_EA=


##### Steps

1. Change the directory to either `docker/dev` or `docker/ea`
2. Run `Dockerise.sh` script.
3. Access to http://localhost:{port}/ (The port you set in `.env`)

##### What is happening by running `Dockerise.sh`

1. Building images by typing the following command in a terminal

```shell
docker-compose build --build-arg SSH_PRIVATE_KEY="$(cat ~/.ssh/id_rsa)"
```

What it does is, it is building Docker images using docker-compose and passing `SSH_PRIVATE_KEY` as an argument so the time our docker-compose deals with dockerizing Intermediate API, it can pull data from a private repository
**If you have your GitHub SSH private key somewhere else, please update the path `~/.ssh/id_rsa`**

##### Also, you may concern that we are passing the private key to the docker image.

[Multi-stage builds](https://vsupalov.com/build-docker-image-clone-private-repo-ssh-key/)

[Dockerfile](../seistech_inter_api/seistech_inter_api/Dockerfile)

This is the Dockerfile for Intermediate API, what it does is

- It creates one Docker image with this private key to cloning from private repo.

- It creates another Docker image and copying python packages installed in an image called `intermediate` as, within `intermediate`, python has those packages installed (From private repo), then install any extra packages we need to run Intermediate API by running `pip install -r requirements.txt`

- By doing this, we do not leave our private key left in Dockerfile.

2. Running docker images!

```shell
docker-compose up -d
```

-d command for running it on the background.

It runs both Frontend & Intermediate API

3. Access via `localhost:5100`
   **Port can always be changed in the future and if so, will update this doc**

## Deploying to AWS

With a directory called `docker`, there are two more directories, `dev` and `ea`. Each directory has different settings with `docker-compose.yml` file.

They also include a shell script called `Dockerise.sh`. By running this shell script inside EC2, it will automatically pull the latest version (Frontend & Intermediate API) from our repo, create Docker images then run them.

## Anything below from here may not be relevant to us anymore but will keep it in case I can use as a reference.

Build the app for production by running

> npm run build

The builds ingest a corresponding .env.<...> file

> npn run build:dev will use .env.development

For each Azure environment download the "publishProfile" - from the Web App Overview page - and save it in src/Azure/publishProfiles as "seistech-<tag>.PublishSettings.xml
eg., seistech-dev.publishSettings.xml

This file contains, among other things, the ftp credentials. To deploy to a particular environment (dev, test, or prod) run the following

> npm run-script deploy-dev

Or use an ftp client such as FileZilla.

### Azure Linux Web App

This is a container running a standard Linux image - hence, every time the web app restarts the image is reset - meaning that system changes outside the /home directory aren't persisted. This is dealt with currently by running "pip install -r requirements.txt" in the startup script. This makes startup longer than ideal. Longterm, a customised Linux image will be the correct approach. This can be created locally and uploaded to an Azure container store, and then the Azure web app container can load the customised image instead.

## Environment Variables

REACT_APP_SHOW_DEBUG_PANEL=false will disable the debug panel (assuming it is still in the project, possibly console.log is better)

.env contains REACT_APP_SW_VERSION

## Changes to the App

Changes to React packages will be handled through the build process.

Changes to Python packages will necessitate updating and deploying "requirements.txt" by running

> pip freeze > src/wwwroot/requirements.txt

requirements.txt is then deployed to wwwroot, and processed by "wwwroot/startup.sh" when the container starts.

## React build details

At the point where "plotly" was added, the react build began throwing stack overflow errors.

Hence, an increase to the default stack allocation - up to 8192 MB - has been added in the parameters

> env-cmd -f .env.production react-scripts build -- --node-flags --max-old-space-size=8192

Where "env-cmd" is a plugin which passes the file .env.production to the build, and "-- --node-flags --max-old-space-size=8192" increase the stack allocation.

I've found that I need to run these commands in my gitBash terminal, as they don't work reliable using the vsCode commandline.

## sqlite3 - is included in the python distribution

No installation necessary.

## Manual FTP Deploy

Open the Azure publish profile (xml) and format it to improve readability.

Deploy the following [from] ---> [to]

/build/\* ---> /site/wwwroot
/src/wwwroot/ ---> /site/wwwroot
startup.sh (this is run by the Azure startup command whenever the container is warm-started)
requirements.txt
/src/py/ ---> /site/wwwroot/py
application.py

db create GUID - 6df1f9c6-5baf-4eaf-81d6-416c28d674ab
