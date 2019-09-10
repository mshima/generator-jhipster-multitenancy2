#!/bin/bash

set -e
source $(dirname $0)/00-init-env.sh

#-------------------------------------------------------------------------------
# Project Customizations
#-------------------------------------------------------------------------------

cd "$JHI_FOLDER_APP"
npm install webdriver-manager@12.1.6
