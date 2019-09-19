#!/bin/bash

#-------------------------------------------------------------------------------
# Project Customizations
#-------------------------------------------------------------------------------

if [[ "$JHI_BLUEPRINT_ENTITY" == "jdl" ]]; then
    #-------------------------------------------------------------------------------
    # Generate Multitenancy2 project with JDL
    #-------------------------------------------------------------------------------
    cd "$JHI_FOLDER_APP"
    jhipster import-jdl *.jdl --no-insight --blueprints multitenancy2 --tenant-name company --relation-tenant-aware
    # Regenerate to fix errors
    jhipster --force --no-insight --skip-checks --with-entities --from-cli --blueprints multitenancy2 --relation-tenant-aware
fi

cd "$JHI_FOLDER_APP"

# Replace version (latest) with local path
echo 'Fixing blueprint version'
echo `cat package.json | grep 'generator-jhipster-multitenancy2'`
sed -e 's#"generator-jhipster-multitenancy2": ".*",#"generator-jhipster-multitenancy2": "file:'$JHI_HOME'",#1;' package.json > package.json.sed
mv -f package.json.sed package.json
echo 'Fixed blueprint version'
echo `cat package.json | grep 'generator-jhipster-multitenancy2'`

if [[ "$JHI_GEN_BRANCH" != "release" && "$JHI_BUILD_SOURCE" == "generator-jhipster-blueprint" ]]; then
    # Replace jhipster version with local path
    echo 'Fixing jhipster version'
    echo `cat package.json | grep '"generator-jhipster"'`
    sed -e 's#"generator-jhipster": ".*",#"generator-jhipster": "file:'$HOME'/generator-jhipster",#1;' package.json > package.json.sed
    mv -f package.json.sed package.json
    echo 'Fixed jhipster version'
    echo `cat package.json | grep '"generator-jhipster"'`
fi

npm install

echo "Updation webdriver from chrome"
npm install webdriver-manager@12.1.6
