#!/bin/bash

set -e
source $(dirname $0)/00-init-env.sh

#-------------------------------------------------------------------------------
# Project Customizations
#-------------------------------------------------------------------------------

cd "$JHI_FOLDER_APP"

echo "Updation webdriver from chrome"
npm install webdriver-manager@12.1.6

if [[ "$INSTALL_BLUEPRINT" != "global" ]]; then
    npm install eslint
fi
