#!/usr/bin/env bash


npm run docs

git checkout gh-pages

git rm --cached -r .
rm .gitignore

touch .nojekyll
git add .nojekyll docs

git clean -fd

git mv docs/* .
