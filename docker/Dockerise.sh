#! /bin/bash
deployment_name=$1
target_branch=$2

# Down the docker-compose first
echo "docker-compose down"
docker-compose down

# Remove existing images
echo "Removing docker images first"
docker rmi frontend:${deployment_name} middleware:${deployment_name}

# Switch to target branch in case we're not in the right branch
echo "Changing to ${target_branch} branch"
git checkout ${target_branch}

# To pull latest version
echo "Pulling latest info from ${target_branch} branch"
git pull

# Set the Time
export TZ=NZ
export BUILD_DATE=$(date +%Y-%m-%d)-$(date +%T)

# Get the latest git commit's hash
export GIT_SHA=`git rev-parse --short HEAD`

# Then create one
echo "Dockerizing"
docker-compose build --build-arg SSH_PRIVATE_KEY="$(cat ~/.ssh/id_rsa)" --no-cache

# Remove <none> tag which is part of multi staging for Docker to keep SSH Key secret
echo "Removing unnecessary image that was used to install from a private repo"
docker images | grep none | awk '{ print $3; }' | xargs docker rmi

# Up the docker-compose in background
echo "docker-compose up"
docker-compose up -d
