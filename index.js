/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-cli-inject-asset-map',

  // Add asset map hash to asset-map controller
  postBuild: function (results) {
    var fastbootJsPath, jsPath, js, fastbootJs,  assetMapKey, expression, injectedJs, fastbootInjectedJs,
        fs          = require('fs'),
        path        = require('path'),
        tree        = results['graph']['tree'],
        // as of ember-cli-fastboot 0.6.0 you can find the assetmap in the 2nd tree...
        // probably we should be smarter about how we find this...
        fastbootAssetMap = tree._inputNodes[tree._inputNodes.length - 1].assetMap,
        assetMap    = tree._inputNodes[tree._inputNodes.length - 2].assetMap;

    if (!assetMap) { console.error('could not find asset map'); return; }
    if (!fastbootAssetMap) { console.error('could not find fastboot asset map'); return; }

    jsPath      = path.join(results.directory, assetMap['assets/' + process.env.ASSET_MAP_APP_NAME + '.js']);
    fastbootJsPath = path.join(results.directory, fastbootAssetMap['fastboot/' + process.env.ASSET_MAP_APP_NAME + '.js']);
    js          = fs.readFileSync(jsPath, 'utf-8');
    fastbootJs  = fs.readFileSync(fastbootJsPath, 'utf-8');
    assetMapKey = 'assetMapHash';
    expression  = new RegExp(assetMapKey + ':\\s?(void 0|undefined)');
    injectedJs  = js.replace(expression, assetMapKey + ': ' + JSON.stringify(assetMap));
    fastbootInjectedJs  = fastbootJs.replace(expression, assetMapKey + ': ' + JSON.stringify(assetMap));

    if (fs.existsSync(jsPath)) {
      fs.writeFileSync(jsPath, injectedJs, 'utf-8');
    } else {
      console.error('Unable to inject asset map. File "' + jsPath + '" does not exist.');
    }

    if (fs.existsSync(fastbootJsPath)) {
      fs.writeFileSync(fastbootJsPath, fastbootInjectedJs, 'utf-8');
    } else {
      console.error('Unable to inject asset map. File "' + fastbootJsPath + '" does not exist.');
    }
  }
};

