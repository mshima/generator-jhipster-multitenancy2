#!/bin/bash

set -e
source $(dirname $0)/00-init-env.sh

#-------------------------------------------------------------------------------
# Install Blueprint
#-------------------------------------------------------------------------------
cd "$HOME"
echo "*** generator-jhipster-blueprint: use local version at JHI_REPO=$JHI_REPO"

cd "$JHI_HOME"
git --no-pager log -n 10 --graph --pretty='%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit

rm -rf "$JHI_FOLDER_APP"
mkdir -p "$JHI_FOLDER_APP"
cd "$JHI_FOLDER_APP"

npm install "$JHI_HOME"
npm test
