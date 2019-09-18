#!/bin/bash

set -e
source $(dirname $0)/00-init-env.sh

#-------------------------------------------------------------------------------
# Project Customizations
#-------------------------------------------------------------------------------

cd "$JHI_FOLDER_APP"

# Replace version (latest) with local path
echo 'Changing blueprint version'
echo `cat package.json | grep 'generator-jhipster-multitenancy2'`
sed -e 's#"generator-jhipster-multitenancy2": ".*",#"generator-jhipster-multitenancy2": "file:'$JHI_HOME'",#1;' package.json > package.json.sed
mv -f package.json.sed package.json
echo 'Fixed blueprint version'
echo `cat package.json | grep 'generator-jhipster-multitenancy2'`

npm install

echo "Updation webdriver from chrome"
npm install webdriver-manager@12.1.6
