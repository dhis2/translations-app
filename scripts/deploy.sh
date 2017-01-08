#!/bin/bash
THIS_REPO = "dhis2/translations-app"
BRANCH_REGEX="2.2[0-9]|master"

if [ "$TRAVIS_REPO_SLUG" == "$THIS_REPO" ]  && [ "$TRAVIS_PULL_REQUEST" == "false" ] \
 && [[ "$TRAVIS_BRANCH" =~ $BRANCH_REGEX ]] && [[ -z $TRAVIS_TAG ]]; then
    
    set -e # exit with nonzero exit code if anything fails

    cd ${HOME}

    mvn clean deploy --settings settings/settings.xml

    exit $?

fi 
