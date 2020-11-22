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

export ENV=dev
export AUTH0_DOMAIN=
export CORE_API_SECRET=
export API_AUDIENCE=
export ALGORITHMS=
export CORE_API_BASE=
export N_PROCS=
export INTER_PORT=

##### To run Intermediate API: `python app.py`

#### With .env

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

##### To run Intermediate API: `python app.py`

## Running locally

Assuming we are using Core API that is on Epicentre

**Make sure you have an access to `ucgmsim/seistech` git repo via SSH as we need to access the private repo to download**

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

### With Docker

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

## Application

### Hazard Analysis

#### Site Selection

##### Ensemble

If it is in DEV version, you see two options, **v20p5emp** and **v20p45sim**.
But in EA and PROD.

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

Will add this from NZ Code branch.

#### GMS

Users need to set the location first in **Site Selection** tab to get into this tab.

##### IM Type

The options are similar to IM (Intensity Measure) from the Hazard Curve in Seismic Hazard but slightly different. Those options are specialised for GMS. Users need to choose one of them.

##### IM Level or Exceedance Rate

Users can choose either **IM Level** or **Exceedance Rate**. The urrent setup is, by choosing **IM Type** first then putting **IM Level** or **Exceedance Rate**. If the focus gets outside of the input box, then it sends a request to Core API to get default parameters which are for **Pre-GM Filtering parameters** inside the advanced tab.

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
