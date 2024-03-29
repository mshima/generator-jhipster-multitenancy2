#!/bin/bash

init_var() {
    result=""
    if [[ $1 != "" ]]; then
        result=$1
    elif [[ $2 != "" ]]; then
        result=$2
    fi
    echo $result
}

# uri of repo
JHI_REPO=$(init_var "$BUILD_REPOSITORY_URI" "$TRAVIS_REPO_SLUG")

# folder where the repo is cloned
JHI_HOME=$(init_var "$BUILD_REPOSITORY_LOCALPATH" "$TRAVIS_BUILD_DIR")

# folder for test-integration
if [[ "$JHI_INTEG" == "" ]]; then
    JHI_INTEG="$JHI_HOME"/test-integration
fi

# folder for samples
if [[ "$JHI_SAMPLES" == "" ]]; then
    JHI_SAMPLES="$JHI_INTEG"/samples
fi

# folder for scripts
if [[ "$JHI_SCRIPTS" == "" ]]; then
    JHI_SCRIPTS="$JHI_INTEG"/scripts
fi

# folder for app
if [[ "$JHI_FOLDER_APP" == "" ]]; then
    JHI_FOLDER_APP="$HOME"/app
fi

# folder for uaa app
if [[ "$JHI_FOLDER_UAA" == "" ]]; then
    JHI_FOLDER_UAA="$HOME"/uaa
fi

# set correct OpenJDK version
if [[ "$JHI_JDK" == "11" ]]; then
    JAVA_HOME=$(readlink -f /usr/bin/java | sed "s:bin/java::")
fi

# source of the build
if [[ "$JHI_REPO" == *"/jhipster" ]]; then
    JHI_BUILD_SOURCE=jhipster

elif [[ "$JHI_REPO" == *"/generator-jhipster" ]]; then
    JHI_BUILD_SOURCE=generator-jhipster

else
    JHI_BUILD_SOURCE=other
fi

if [[ "$JHI_GEN_VERSION" == "" ]]; then
    if [[ "$JHI_BUILD_SOURCE" == "generator-jhipster" ]]; then
        JHI_GEN_VERSION=file:$JHI_HOME
    elif [[ "$JHI_BUILD_SOURCE" != "generator-jhipster" && "$JHI_GEN_BRANCH" != "release" ]]; then
        JHI_GEN_VERSION=file:"$HOME"/generator-jhipster
    fi
fi

if [ "$JHI_GEN_VERSION" != "" ]; then
   JHI_PARAMS="$JHI_PARAMS --generator-jhipster-version $JHI_GEN_VERSION"
fi
