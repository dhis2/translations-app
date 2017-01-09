#!/bin/bash
THIS_REPO="dhis2/translations-app"
BRANCH_REGEX="^v2.[2-3][0-9]$"

if [ "$TRAVIS_REPO_SLUG" == "$THIS_REPO" ]  && [ "$TRAVIS_PULL_REQUEST" == "false" ] \
 && ( ( [[ "$TRAVIS_BRANCH" =~ $BRANCH_REGEX ]] && [[ -z $TRAVIS_TAG ]] ) || \
[ "$TRAVIS_BRANCH" == "master" ] ); then
    
    set -e # exit with nonzero exit code if anything fails

    mvn clean deploy --settings deploy/settings.xml

    exit $?

fi 
