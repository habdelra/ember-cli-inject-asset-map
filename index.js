/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-cli-inject-asset-map',

  // Add asset map hash to asset-map controller
  postBuild: function (results) {
    var fs          = require('fs'),
        path        = require('path'),
        tree        = results['graph']['tree'],
        assetMap    = tree._inputNodes[tree._inputNodes.length - 1].assetMap,
        jsPath      = path.join(results.directory, assetMap['assets/' + process.env.ASSET_MAP_APP_NAME + '.js']),
        js          = fs.readFileSync(jsPath, 'utf-8'),
        assetMapKey = 'assetMapHash',
        expression  = new RegExp(assetMapKey + ':\\s?(void 0|undefined)'),
        injectedJs  = js.replace(expression, assetMapKey + ': ' + JSON.stringify(assetMap));

    if (fs.existsSync(jsPath)) {
      fs.writeFileSync(jsPath, injectedJs, 'utf-8');
    } else {
      console.error('Unable to inject asset map. File "' + jsPath + '" does not exist.');
    }
  }
};

