#!/bin/bash
set -e 
mvn clean deploy --settings deploy/settings.xml
exit $?
