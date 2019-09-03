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

# Create package.json otherwise npm will error and break
npm init -f

npm install "$JHI_HOME"
npm test

# Remove package.json to let jhipster create it's own
rm package.json
