#!/bin/bash

set -e
source $(dirname $0)/00-init-env.sh

#-------------------------------------------------------------------------------
# Install Blueprint
#-------------------------------------------------------------------------------

if !$BLUEPRINT_BUILD; then
    echo "*** jhipster: not a blueprint installation"
    exit 0
fi

mkdir -p "$JHI_FOLDER_APP"
cd "$JHI_HOME"

if $BLUEPRINT_LINK && $BLUEPRINT_GLOBAL; then
    echo "*** Link blueprint globally"
    npm link

elif $BLUEPRINT_LINK; then
    echo "*** Link blueprint locally"
    npm link

    cd "$JHI_FOLDER_APP"
    npm link "$BLUEPRINT_NAME"

elif $BLUEPRINT_GLOBAL; then
    echo "*** Installing blueprint globally"
    npm install -g "$JHI_HOME"

else
    echo "*** Installing blueprint locally at $JHI_FOLDER_APP"
    cd "$JHI_FOLDER_APP"

    # Create package.json otherwise npm will error and break
    # https://github.com/visionmedia/debug/issues/261
    npm init -f

    if [[ "$JHI_GEN_BRANCH" == "release" && "$JHI_GEN_VERSION" != "" ]]; then
        npm install "generator-jhipster@$JHI_GEN_VERSION"

    elif [[ "$JHI_GEN_BRANCH" == "release" ]]; then
        npm install generator-jhipster

    else
        npm install "$HOME"/generator-jhipster
    fi

    # Install blueprint
    npm install "$JHI_HOME"
fi

#-------------------------------------------------------------------------------
# Check folder where the app is generated
#-------------------------------------------------------------------------------
ls -al "$JHI_FOLDER_APP"
