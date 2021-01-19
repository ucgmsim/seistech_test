# Seistech Web App

## Contents

- [Naming](#naming)
- [Overview](#overview)
- [Requirements](#requirements)
  - [Frontend](#frontend)
    - [DEV Version](#dev-version)
    - [EA Version](#ea-version)
  - [Middleware](#middleware)
    - [Without .env](#without-env)
    - [With .env](#with-env)
  - [Database](#database)
    - [With docker-compose](#with-docker-compose)
- [Running locally](#running-locally)
  - [Without Docker](#without-docker)
  - [With Docker](#with-docker)
- [Deploying to AWS](#deploying-to-aws)
- [Application](#application)
  - [Hazard Analysis](#hazard-analysis)
    - [Site Selection](#site-selection)
      - [Ensemble](#ensemble)
      - [Location](#location)
      - [Site Conditions](#site-conditions)
    - [Seismic Hazard](#seismic-hazard)
      - [Hazard Curve](#hazard-curve)
      - [Disaggregation](#disaggregation)
      - [Uniform Hazard Spectrum](#uniform-hazard-spectrum)
      - [NZ Code](#nz-code)
    - [GMS](#gms)
      - [IM Type](#im-type)
      - [IM Level or Exceedance Rate](#im-level-or-exceedance-rate)
      - [IM Vector](#im-vector)
      - [Num Ground Motions](#num-ground-motions)
      - [Advanced](#advanced)
        - [Pre-GM Filtering Parameters](#pre-gm-filtering-parameters)
        - [Weights](#weights)
        - [Database](#database)
        - [Replicates](#replicates)
  - [Projects](#projects)
    - [Project Site Selection](#project-site-selection)
      - [Project ID](#project-id)
      - [Project Location](#project-location)
      - [Project VS30](#Project-vs30)
    - [Project Seismic Hazard](#project-seismic-hazard)
      - [Project Hazard Curve](#project-hazard-curve)
      - [Project Disaggregation](#project-disaggregation)
      - [Project Uniform Hazard Spectrum](#project-uniform-hazard-spectrum)

## Naming

- **Filename** : PascalCase (ex: SiteSelection.js, SiteSelectionVS30.js) except index files (ex: index.js, index.html, index.css...)
- **Variables & Functions** : camelCase (ex: siteSelectionLng, siteSelectionLat) except the function is used to render a component (ex: HazardCurveSection.js)
- **HTML Class/ID Names** : All lower case and separate with a dash (ex:hi-my-name-is-tom)

## Overview

This is a React/javascript SPA, using Auth0 authentication, talking to a python flask API, running on a Linux host.

## Requirements - Environment variables

Please contact **Tom** to get values.

### Frontend

#### DEV Version

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

##### To run Frontend: `npm run start:dev`

#### EA Version

You will need a `.env.test` file with the following environment variables.

- REACT_APP_CONSTANT_CORE_API_BASE_URL=
- REACT_APP_ENV=EA
- REACT_APP_MAP_BOX_TOKEN=
- REACT_APP_AUTH0_DOMAIN=
- REACT_APP_AUTH0_CLIENTID=
- REACT_APP_AUTH0_AUDIENCE=

##### To run Frontend: `npm run start:ea`

### Middleware

We do not separate middleware for DEV and EA. However, we run simultaneously (One for DEV and another one for EA). However, you don't have to worry about this if you run it locally.

#### Without .env

Add the following code to `~/.bashrc`

```vim
# For Intermediate API
export ENV=dev
export AUTH0_DOMAIN=
export API_AUDIENCE=
export ALGORITHMS=
export CORE_API_SECRET=
export INTER_PORT=
export N_PROCS=
export CORE_API_BASE=
export PROJECT_API_BASE=

# To connect MariaDB from Intermediate API DEV
export DB_USERNAME=
export DB_PASSWORD=
export DB_SERVER="127.0.0.1:3306"
export DB_NAME=

# For Auth0 Management API - To pull existing users.
export AUTH0_CLIENT_ID=
export AUTH0_CLIENT_SECRET=
export AUTH0_AUDIENCE=
export AUTH0_GRANT_TYPE=
```

##### To run Intermediate API: `python app.py`

#### With .env

You will need a `.env` file with the following environment variables.

```env
# For Intermediate API
ENV=dev
AUTH0_DOMAIN=
API_AUDIENCE=
ALGORITHMS=
CORE_API_SECRET=
INTER_PORT=
N_PROCS=
CORE_API_BASE=
PROJECT_API_BASE=

# To connect MariaDB from Intermediate API DEV
DB_USERNAME=
DB_PASSWORD=
DB_SERVER="127.0.0.1:3306"
DB_NAME=

# For Auth0 Management API - To pull existing users.
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
AUTH0_AUDIENCE=
AUTH0_GRANT_TYPE=
```

You also have to install a Python package called `python-dotenv` by typing the following command.

`pip install -U python-dotenv`

Then add the following code to `server.py`

```python
from dotenv import load_dotenv
load_dotenv()
```

##### To run Intermediate API: `python app.py`

### Database

##### With docker-compose

#### Requirements

1. Docker
   Tested on Docker version 19.03.12
2. Docker-compose
   Tested on docker-compose version 1.26.2
3. Environment variables for docker-compose
   `.env` must be in the same directory with `docker-compose.yml`.

**`.env`**

```env
MYSQL_DATABASE=
MYSQL_USER=
MYSQL_PASSWORD=
MYSQL_ROOT_PASSWORD=
```

**docker-compose.yml**

```yml
# docker-compose.yml

version: "3.8"

services:
  db:
    image: mariadb
    restart: always
    ports:
      - 3306:3306
    environment:
      - MYSQL_DATABSE=${MYSQL_DATABASE}
      - MYSQL_USER=${MYSQL_USER}
      - MYSQL_PASSWORD=${MYSQL_PASSWORD}
      - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
      # TZ is not necessary.
      - TZ=Pacific/Auckland

    # Assuming we don't mind store db_data directory in the current directory.
    # For instance, the directory could look like this (Database is a root directory)
    # Database
    # |- .env
    # |- docker-compose.yml
    # |- db_data <- this directory will be created upon using the following volumes command
    # Now we store data in this directory (externally), not inside the docker container.
    volumes:
      - ./db_data:/var/lib/mysql

  # Not necessary for AWS but your local setup due to having DB Viewer via a web browser
  adminer:
    image: adminer
    restart: always
    ports:
      - 8080:8080

volumes:
  db_data:
```

##### Steps - MariaDB

1. Change the directory to where this `docker-compose.yml` is. (Make sure to have `.env` in the same directory.)
2. Type the following command:
   `docker-compose --env-file .env up -d`
   So it passes the environment variables to `docker-compose.yml` when it runs the docker image. We are not creating docker images like we did for Frontend and Middleware, we use the existing docker image that is created by official MariaDB.
3. You can either accese/check data via the browser at `localhost:8080` or via command, `mysql -h 127.0.0.1 -P 3306 -u {MYSQL_USER} -p{MYSQL_PASSWORD}.` (Space after -u but -p)

##### DO THIS STEP IF IT'S YOUR FIRST TIME SETTING UP THE DB

1. Open up a Terminal.
2. Two ways of doing it
   1. With Docker
      1. Type `docker ps`
      2. Type `docker exec -it {CONTAINER_ID_INTERMEDIATE_API} bash` to access to its bash.
      3. Type `python add_exist_users.py` will pull existing users' Auth0 unique ID then insert them into the DB
   2. Without Docker
      1. Run the Intermediate API after running the DB.
      2. From a different terminal, type `python add_exist_users.py`.

As our Intermediate API now tracks users' activity and to do so, we need our DB with users ID.

##### Stpes - Adminer (Local development purpose)

1. Open up a browser and type `localhost:8080`
2. Put the following details:

- Username = `${MYSQL_USER}`
- Password = `${MYSQL_PASSWORD}`
- Database = `${MYSQL_DATABASE}`

##### IMPORTANT - Make sure to run the DB first then run the Intermediate API as it needs to be connected to DB.

## Running locally

Assuming we are using Core API and Project API that are hosted by UCQuakeCore1p.

**Make sure you have an access to `ucgmsim/seistech` git repo via SSH as we need to access the private repo to download**

### Without Docker

Open a terminal to do the following steps

1. Create Python virtual environment first.

2. We need to install some packages for Middleware (a.k.a Intermediate API).

To run this private_requirements, make sure to have SSH Key setup done with GitHub as we are installing packages from a private repo

```shell
cd {seistech_psha_frontend_directory}/middleware/middleware
pip install -r private_requirements.txt
pip install -r requirements.txt
```

3. After installation is done, run the following command

```shell
python app.py
```

Open another terminal to do the following steps

1. Change the directory to frontend

```shell
cd {seistech_psha_frontend_directory}/frontend
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

Differences between `DEV` and `EA` are:

- `DEV` has an **Ensemble** selector
- `DEV` has some default values. (E.g., Lat, Lng, Annual exceedance rate)

**To achieve this, you need the following file**
`.env.dev` for DEV
`.env.test` for EA

Please check **Requirements** above.

### With Docker

#### Requirements

1. Docker
   Tested on Docker version 19.03.12
2. Docker-compose
   Tested on docker-compose version 1.26.2
3. Environment variables for docker-compose
   `.env` must be in the same directory with `docker-compose.yml`.

**`.env` for DEV**

```env
# For Intermediate API
AUTH0_DOMAIN_DEV=
API_AUDIENCE_DEV=
ALGORITHMS_DEV=
CORE_API_SECRET_DEV=
CORE_API_BASE_DEV=
PROJECT_API_BASE_DEV=
INTER_API_PORT_DEV=
N_PROCS_DEV=

# To connect MariaDB from Intermediate API DEV
DB_USERNAME_DEV=
DB_PASSWORD_DEV=
DB_PORT_DEV=
DB_NAME_DEV=

# For MariaDB DEV
DEV_DB_PORT=
DEV_MYSQL_DATABASE=
DEV_MYSQL_USER=
DEV_MYSQL_PASSWORD=
DEV_MYSQL_ROOT_PASSWORD=
DEV_TZ=

# For Auth0 Management API
AUTH0_CLIENT_ID_DEV=
AUTH0_CLIENT_SECRET_DEV=
AUTH0_AUDIENCE_DEV=
AUTH0_GRANT_TYPE_DEV=

# For Frontend
BASE_URL_DEV=
DEFAULT_ANNUAL_EXCEEDANCE_RATE=0.013862943619741008
DEFAULT_LAT=-43.5381
DEFAULT_LNG=172.6474
FRONT_END_PORT_DEV=

# From Dockerise.sh
BUILD_DATE_DEV=${BUILD_DATE_DEV}
GIT_SHA_DEV=${GIT_SHA_DEV}

# AUTH0
REACT_APP_AUTH0_DOMAIN_DEV=
REACT_APP_AUTH0_CLIENTID_DEV=
REACT_APP_AUTH0_AUDIENCE_DEV=

# MapBox

REACT_APP_MAP_BOX_TOKEN_DEV=

# TAG to match Dockerise.sh
BRANCH_NAME=master_dev

```

**`.env` for EA**

```env
# For Intermediate API
AUTH0_DOMAIN_EA=
API_AUDIENCE_EA=
ALGORITHMS_EA=
CORE_API_SECRET_EA=
CORE_API_BASE_EA=
PROJECT_API_BASE_EA=
INTER_API_PORT_EA=
N_PROCS_EA=

# To connect MariaDB from Intermediate API EA
DB_USERNAME_EA=
DB_PASSWORD_EA=
DB_PORT_EA=
DB_NAME_EA=

# For MariaDB EA
EA_DB_PORT=
EA_MYSQL_DATABASE=
EA_MYSQL_USER=
EA_MYSQL_PASSWORD=
EA_MYSQL_ROOT_PASSWORD=
EA_TZ=Pacific/Auckland

# For Auth0 Management API
AUTH0_CLIENT_ID_EA=
AUTH0_CLIENT_SECRET_EA=
AUTH0_AUDIENCE_EA=
AUTH0_GRANT_TYPE_EA=

# For Frontend
BASE_URL_EA=
DEFAULT_ANNUAL_EXCEEDANCE_RATE=""
DEFAULT_LAT=""
DEFAULT_LNG=""
FRONT_END_PORT_EA=

# From Dockerise.sh
BUILD_DATE_EA=${BUILD_DATE_EA}
GIT_SHA_EA=${GIT_SHA_EA}

# AUTH0
REACT_APP_AUTH0_DOMAIN_EA=
REACT_APP_AUTH0_CLIENTID_EA=
REACT_APP_AUTH0_AUDIENCE_EA=

# MapBox

REACT_APP_MAP_BOX_TOKEN_EA=

```

##### Steps

1. Change the directory to either `docker/dev` or `docker/ea`
2. Run the following command.
   - `../Dockerise.sh master_dev master_dev` to run DEV version
   - `../Dockerise.sh master_ea master_dev` to run EA version
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

- It creates one Docker image with this private key to cloning from the private repo.

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

Under a directory called `seistech_psha_frontend`, there is ith a directory called `docker`.

There are three directories, `master_dev`, `master_ea` and `master_test`.

Each directory has a different setting with `docker-compose.yml` file.

It also includes a shell script called `Dockerise.sh` in a `docker` directory. By running this shell script inside EC2, it will automatically pull the latest version (Frontend & Intermediate API) from the repo, create Docker images then run them. To do so, change the directory to either `master_dev` or `master_ea` as `master_test` is uesd by Jenkins, then type the following cmd.

```cmd
../Dockerise.sh {master_dev or master_ea} master_dev
```

The first parameter, `master_dev` or `master_ea` will be added to the docker image to tell which images belong to `DEV` and `EA` version of SeisTech.

The second parameter, `master_dev` is the target branch which tells EC2 to switch to the `master_dev` and create docker images based on the latest information. This parameter is required for Jenkins so it can switch the branch to the PR's branch.

## Application

### Hazard Analysis

#### Site Selection

##### Ensemble

If it is in DEV version, you see two options, **v20p5emp** and **v20p45sim** for **Ensemble** but in EA and PROD, they are not visible.

##### Location

Users can put Lat and Lng within NZ coordinates. Then click **Set** button to get a station, regional map and vs30 map.

##### Site Conditions

By setting the location, users get a default VS30. They can also update VS30 if they want by updating the input field and click **Set VS30**. By clicking the **Use Default**, it goes back to what it was. (The value from API when users set the location)

#### Seismic Hazard

Users need to set the location first in **Site Selection** tab to get into this tab.

##### Hazard Curve

Users can choose one IM from the dropdown, then click **Compute** button to get the following plots.

- Ensemble branches
- Fault/distributed seismicity contribution

##### Disaggregation

Users must choose IM first to do this job.

Users can put **Annual Exceedance Rate** anywhere between 0 and 1. Click **Compute** to get following things.

- Epsilon (image)
- Fault/distributed seismicity (image)
- Source contributions (table)

##### Uniform Hazard Spectrum

Similar to **Disaggregation**. Users can put **Annual Exceedance Rate** but they can put more than one. Click **Compute** to get a plot.

##### NZ Code

NZ Code is now separated with its section. When users set the location from **Site Selection**, the app sends another request to Core API to get default parameters, such as distance(not displaying), soil class and z factor. Then when users try to compute **Hazard Curve** and/or **UHS**, the app sens NZCode calls right after the Hazard and/or UHS to get NZ Code data to plot. So basically, we send NZ Code call with **Hazard Curve** and/or **UHS**. However, users can update NZ Code by itself by changing **Soil Class** and/or **Z Factor** then click the compute button in NZS1170 section.

#### GMS

Users need to set the location first in **Site Selection** tab to get into this tab.

##### IM Type

The options are similar to IM (Intensity Measure) from the Hazard Curve in Seismic Hazard but slightly different. Those options are specialised for GMS. Users need to choose one of them.

##### IM Level or Exceedance Rate

Users can choose either **IM Level** or **Exceedance Rate**. The current setup is, by choosing **IM Type** first then putting **IM Level** or **Exceedance Rate**. If the focus gets outside of the input box, then it sends a request to Core API to get default parameters which are for **Pre-GM Filtering parameters** inside the advanced tab.

##### IM Vector

Identical list to IM Type. Except, the chosen **IM Type** will be filtered out. For instance, if you choose PGA from **IM Type**, there is now PGA in **IM Vector**. Also, users can choose multiple IMs.

Also, just like above, when the focus gets out of this select box, it sends a request to the Core API to get default weights which are for **Weights** inside the advanced tab.

##### Num Ground Motions

Just a number.

##### Compute button

After users have done the following steps:

- Choose IM Type
- Choose IM Level or Exceedance Rate
- Put its value
- Choose IM Vector(s)
- Put Num Ground Motions

Compute button will be waiting for the following responses from Core API:

- Pre-GM Filtering Parameters
- Weights

Once it gets all the responses from the Core API, the compute button gets enabled and users can click it to send a request to Core API to get the following plots:

- IM Distributions
  - Pseudo acceleration response spectra
  - IM Vectors
- Causal Parameters - Using **Pre-GM Filtering Parameters**'s Min/Max for the red dashed-dot lines
  - Magnitude and Rrup plot
  - Magnitude
  - Rrup
  - Scale Factor
  - VS30 - Red solid line is from Site Selection, VS30 value.

##### Advanced

###### Pre-GM Filtering Parameters

A table with inputs, afters user choose **IM Type** and either **IM Level** or **Exceedance Rate**, we get the default values. But users can also change to their values.

###### Weights

A table with multiple columns (number of chosen IM Vectors). Weights are allocated by the Core API.

###### Database

Currently, we don't have any database but will be there as a dropdown option.

###### Replicates

Currently, it defaults to 1.

### Projects

#### Project Site Selection

##### Project ID

Select(Dropdown) with available **Project IDs**.

##### Project Location

Select(Dropdown) with available **Project Locations**.

##### Project VS30

Select(Dropdown) with available **Project VS30s**.

#### Project Seismic Hazard

Users need to set the location first in **Site Selection** tab to get into this tab.

##### Project Hazard Curve

Users can choose one **Intensity Measure** from the dropdown, then click **Get** button to get the following plots.

- Ensemble branches
- Fault/distributed seismicity contribution

##### Project Disaggregation

Users must choose **IM** first to do this job.

Users can choose one **Return Period** from the dropdown, then click **Get** to get following things.

- Epsilon (image)
- Fault/distributed seismicity (image)
- Source contributions (table)

##### Project Uniform Hazard Spectrum

Similar to **Disaggregation**. Users can choose **Return Period** from the dropdown but they can choose more than one. Click **Get** to get a plot.
