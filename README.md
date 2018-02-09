# Confluence Protractor Base
 
[![Npm version](https://img.shields.io/npm/v/confluence-protractor-base.svg)](https://www.npmjs.com/package/confluence-protractor-base)
[![Npm dependencies](https://img.shields.io/david/seibert-media/confluence-protractor-base.svg)](https://david-dm.org/seibert-media/confluence-protractor-base)
[![devDependency Status](https://img.shields.io/david/dev/seibert-media/confluence-protractor-base.svg)](https://david-dm.org/seibert-media/confluence-protractor-base#info=devDependencies)

The Confluence&reg; Protractor Base is a simple solution to implement und run UI tests for [Atlassian&reg; Confluence&reg;](https://www.atlassian.com/software/confluence).
It provides basic functionality like creating pages, spaces, users and groups as well as login, authenticate as admin and open pages.  

## Installation
`npm install confluence-protractor-base`

## First Steps
1. Start a [local Confluence instance](#localConf)
1. Checkout the project and switch to the directory
1. Install requirements\
 `npm install`
1. Update [webdriver manager](https://github.com/angular/webdriver-manager)\
 `npm run webdriver-update`
1. Start the webdriver manager\
 `npm run webdriver-start`
1. run UI tests in another console window (e2e means End-to-End)\
 `npm run test-e2e`


## Local Confluence instance<a name="localConf"></a>
First of all you need a local Confluence instance. 

The instance should be locally available under <http://localhost:1990/confluence> (Atlassian&reg; SDK standard)

This can be done via the Atlassian SDK or with a Docker container


### Atlassian SDK
Start a local Confluence test instance using the [Atlassian&reg; SDK](https://developer.atlassian.com/docs/getting-started/set-up-the-atlassian-plugin-sdk-and-build-a-project)

`atlas-run-standalone --product confluence
`

### Docker container
Start a local [Confluence&reg; docker instance](https://hub.docker.com/r/atlassian/confluence-server/)\

## Supported Platforms
We have tested the confluence-protractor-base with 
* Confluence 5.7 - 6.7
* PSQL, MYSQL, MSSQL

## Troubleshooting
See [Issues](https://github.com/seibert-media/confluence-protractor-base/issues)

## Known issues

### Page edit with synchrony (concurrent editing)

Page edit with synchrony enabled may be unstable. All page objects inheriting from `ConfluenceBase` have a
`disableSynchrony()` method to prevent problems. Example:

    const upm = new UniversalPluginManager();
    upm.disableSynchrony();
