/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-cli-inject-asset-map',

  // Add asset map hash to asset-map controller
  postBuild: function (results) {
    var jsPath, js, assetMapKey, expression, injectedJs,
        fs          = require('fs'),
        path        = require('path'),
        tree        = results['graph']['tree'],
        // as of ember-cli-fastboot 0.6.0 you can find the assetmap in teh 2nd tree...
        // probably we should be smarter about how we find this...
        assetMap    = tree._inputNodes[tree._inputNodes.length - 2].assetMap;

    if (!assetMap) { console.error('could not find asset map'); return; }

    jsPath      = path.join(results.directory, assetMap['assets/' + process.env.ASSET_MAP_APP_NAME + '.js']);
    js          = fs.readFileSync(jsPath, 'utf-8');
    assetMapKey = 'assetMapHash';
    expression  = new RegExp(assetMapKey + ':\\s?(void 0|undefined)');
    injectedJs  = js.replace(expression, assetMapKey + ': ' + JSON.stringify(assetMap));

    if (fs.existsSync(jsPath)) {
      fs.writeFileSync(jsPath, injectedJs, 'utf-8');
    } else {
      console.error('Unable to inject asset map. File "' + jsPath + '" does not exist.');
    }
  }
};

