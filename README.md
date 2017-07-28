

# Lokales Setup
Zum lokalen Starten der UI-Tests werden folgende Tools benötigt.
- [confluence-docker-setup](https://bitbucket.apps.seibert-media.net/projects/DH/repos/confluence-docker-setup/browse) mit ./scripts/create-and-run.sh starten (weiter Infos siehe
  [Lokale Confluence Test-Systeme mit Docker (für Kompatibilitätstests)](https://confluence.apps.seibert-media.net/pages/viewpage.action?pageId=105842961))
- Protractor über "npm install"

## Schritte zum Ausführen der UI-Tests
Die UI-Tests müssen im Projekt eingerichtet sein.
1. Im Projekt `confluence-docker-setup` ein frisches leeres Docker-Confluence aufsetzen
   1. Docker-Instanz erstellen und starten `./scripts/create-and-run.sh` ausführen
      (!) Achtung: Macht bereits eingerichtete Instanzen platt, daher ggf. die Daten sichern (siehe Abschnitt **Clean and backup your** auf der Seite [Lokale Confluence Test-Systeme mit Docker (für Kompatibilitätstests)](https://confluence.apps.seibert-media.net/pages/viewpage.action?pageId=105842961))
   1. Die Instanz ist unter <http://confluence:8090> aufrufbar
      (!) Achtung: Hierfür muss unter `/etc/hosts` ein VHost eintragen werden: `127.0.0.1      confluence`
1. Im Plugin-Projekt `protractor` installieren und `webdriver-manager` aktualisieren und starten
   1. Im Plugin-Projekt `npm install` auführen, danach sind im Ordner `node_modules/.bin` ausführbare Programme
   1. Einmalig `webdriver-manager` aktualisieren mit dem Befehl `node_modules/.bin/webdriver-manager update`
   1. In einer eigenen Konsole `webdriver-manager` starten mit dem Befehl `node_modules/.bin/webdriver-manager start`
1. UI-Tests mit npm Skript starten. Befehl `npm run test-e2e` (e2e steht für End-to-End)

# Troubleshooting
## phantom.js
```text
error while loading shared libraries: libicui18n.so.52: cannot open shared object file: No such file or directory
```
Für Ubuntu 16.04 hat folgendes geholfen: <https://github.com/Pyppe/phantomjs2.0-ubuntu14.04x64/issues/1#issuecomment-244120878>

## WebDriverJS
```text
run 'webdriver-manager update'.The cmd show 'SyntaxError: Unexpected token ...' #4001
```
Siehe https://github.com/angular/protractor/issues/4001.

```text
node_modules\webdriver-manager\built\lib\cli\logger.js:66
    info(...msgs) {
         ^^^
SyntaxError: Unexpected token ...
    at exports.runInThisContext (vm.js:53:16)
    at Module._compile (module.js:404:25)
    at Object.Module._extensions..js (module.js:432:10)
    at Module.load (module.js:356:32)
    at Function.Module._load (module.js:313:12)
    at Module.require (module.js:366:17)
    at require (module.js:385:17)
    at Object.<anonymous> (C:\Users\wuyang\AppData\Roaming\npm\node_modules\protractor\node_modules\webdriver-manager\built\
lib\cli\index.js:8:10)
    at Module._compile (module.js:425:26)
    at Object.Module._extensions..js (module.js:432:10)
```

Mit einem Update von [Node und npm](https://confluence.apps.seibert-media.net/display/technologies/Node+und+npm) war das behoben (Ich habe unter Ubuntu 16.04 den 3. Weg genommen und Version 7.6.0 bekommen, npm 4.1.2).

## npm install
Folgende Warnungen erhalte ich bei Ausführung von "npm install"

```text
npm WARN deprecated graceful-fs@2.0.3: graceful-fs v3.0.0 and before will fail on node releases &gt;= v7.0\. Please update to graceful-fs@^4.0.0 as soon as possible. Use 'npm ls graceful-fs' to find it in the tree.
npm WARN deprecated node-uuid@1.4.7: use uuid module instead
npm WARN deprecated minimatch@1.0.0: Please update to minimatch 3.0.2 or higher to avoid a RegExp DoS issue
npm WARN deprecated tough-cookie@0.12.1: ReDoS vulnerability parsing Set-Cookie <a href="https://nodesecurity.io/advisories/130">https://nodesecurity.io/advisories/130</a>
npm WARN deprecated npmconf@2.1.2: this package has been reintegrated into npm and is now out of date with respect to npm
npm WARN deprecated minimatch@0.3.0: Please update to minimatch 3.0.2 or higher to avoid a RegExp DoS issue
npm WARN prefer global jsonlint@1.6.2 should be installed with -g
npm WARN prefer global bower-installer@0.8.4 should be installed with -g
```
