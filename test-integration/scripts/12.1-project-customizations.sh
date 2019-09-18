#!/bin/bash

set -e
source $(dirname $0)/00-init-env.sh

#-------------------------------------------------------------------------------
# Project Customizations
#-------------------------------------------------------------------------------

cd "$JHI_FOLDER_APP"

echo "Updation webdriver from chrome"
npm install webdriver-manager@12.1.6
npm install -g eslint eslint-plugin-import eslint-plugin-jsx-a11y

#if [[ "$INSTALL_BLUEPRINT" == "global" ]]; then
#    echo "Installing eslint"
#else
#    echo "Installing eslint"
#    npm install eslint
#    npm install eslint
#fi

if [[ "$INSTALL_BLUEPRINT" != "global" && "$JHI_GEN_BRANCH" == "release" && "$JHI_GEN_VERSION" == "" ]]; then
    echo "*** generator-jhipster: use last release version"
    npm install generator-jhipster

elif [[ "$INSTALL_BLUEPRINT" != "global" && "$JHI_GEN_BRANCH" == "release" ]]; then
    echo "*** generator-jhipster: use release version"
    npm install "generator-jhipster@$JHI_GEN_VERSION"
fi
