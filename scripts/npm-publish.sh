#!/usr/bin/env bash

PACKAGE_VERSION=$(node -p -e "require('./package').version")
VERSION_TAG="v$PACKAGE_VERSION"
NPM_REGISTRY="$1"

git diff --exit-code --stat $VERSION_TAG

DIFF_STATUS=$?

if [ $DIFF_STATUS != 0 ]; then
    echo
    (>&2 echo "ERROR: Tagged version $VERSION_TAG must match the package.json without any diff to be published")
    exit $DIFF_STATUS
fi

if [ -z $NPM_REGISTRY ]; then
    npm publish
else
    npm publish --registry $NPM_REGISTRY
fi
