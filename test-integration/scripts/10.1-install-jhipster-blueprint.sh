#!/bin/bash

set -e
source $(dirname $0)/00-init-env.sh

#-------------------------------------------------------------------------------
# Install Blueprint
#-------------------------------------------------------------------------------
echo "*** generator-jhipster-blueprint: use local version at JHI_REPO=$JHI_REPO"
if [[ "$INSTALL_BLUEPRINT" == "global" ]]; then
    echo "Installing globally"
    npm install -g "$JHI_HOME"

else
    cd "$HOME"

    cd "$JHI_HOME"
    git --no-pager log -n 10 --graph --pretty='%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit

    mkdir -p "$JHI_FOLDER_APP"
    cd "$JHI_FOLDER_APP"

    # Create package.json otherwise npm will error and break
    # https://github.com/visionmedia/debug/issues/261
    npm init -f

    # Install blueprint
    npm install "$JHI_HOME"

    # Remove package.json to let jhipster create it's own
    rm package.json
fi
