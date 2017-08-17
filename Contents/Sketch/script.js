var onRun = function (context) {
  var documentName = context.document.displayName();
  // log('The current document is named: ' + documentName);

  var selectedLayers = context.selection;
  var selectedCount = selectedLayers.count();

  if (selectedCount == 0) {
    log('No layers are selected.');
  } else {
    // log('Selected layers:');
    for (var i = 0; i < selectedCount; i++) {
      var layer = selectedLayers[i];
      // log((i + 1) + '. ' + layer.name());
      var name = layer.name();

      if (layer.class() == 'MSLayerGroup') {
        const tree = parseGroupLayer(layer);
        // log(`${layer.class()} - ${layer.name()}`);
        log(layer.layers());
        log('-------------------------------');
        log(tree);
      }
    }
  }
}

function parseGroupLayer(groupLayer, tree = []) {
  if (isImageGroupLayer(groupLayer)) {
    tree.push({type: 'image', name: groupLayer.name(), layer: groupLayer});
  } else {
    let nodes = [];
    groupLayer.layers().forEach((layer) => {
      const clas = layer.class();
      log(`clas = ${clas}`);
      if (clas == 'MSLayerGroup') {
        log('handle group');
        parseGroupLayer(layer, nodes);
      }
      else if (clas == 'MSTextLayer') {
          log('handle textlayer');
          nodes.push({type: 'text', text: layer.name(), layer: layer});
      }
      else if (clas == 'MSShapeLayer' || clas == 'MSShapeGroup') {
          log('handle shapelayer');
          nodes.push({type: 'image', name: layer.name(), layer: layer});
      }
    });
    tree.push({group: nodes})
  }
  return tree;
}

function isImageGroupLayer(groupLayer) {
  if (groupLayer.layers().length <= 0) {
    return false;
  }

  let layers = groupLayer.layers();
  for (var i = 0; i < layers.count(); i++) {
    const c = layers[i].class();
    log(c);
    if (c == 'MSLayerGroup' || c == 'MSTextLayer') {
      return false;
    }
  }

  return true;
}

var onRunOld = function (context) {
  // log('This is an example Sketch script.');

  var documentName = context.document.displayName();
  // log('The current document is named: ' + documentName);

  var selectedLayers = context.selection;
  var selectedCount = selectedLayers.count();

  if (selectedCount == 0) {
    log('No layers are selected.');
  } else {
    // log('Selected layers:');
    for (var i = 0; i < selectedCount; i++) {
      var layer = selectedLayers[i];
      // log((i + 1) + '. ' + layer.name());
      var name = layer.name();

      var layerClass = layer.class();
      if (layerClass == "MSTextLayer") {
          var info = {
              text: name,
              frame: {
                x: layer.frame().x()/2,
                y: layer.frame().y()/2,
                width: layer.frame().width()/2,
                height: layer.frame().height()/2
              },
              font: {
                  name: layer.fontPostscriptName(),
                  size: layer.fontSize()/2, 
                  color: { 
                    red: layer.textColor().red(), 
                    green: layer.textColor().green(), 
                    blue: layer.textColor().blue() 
                  }
              }
          };
          const label = UILabelXML(info);
          log(label);
          // log(info);
      }
    }
  };

};

function rgbToHex(r, g, b) {
  var rInt = 255 * r;
  var gInt = 255 * g;
  var bInt = 255 * b;
  
  return "#" + ((1 << 24) + (rInt << 16) + (gInt << 8) + bInt).toString(16).slice(1);
}

function UILabelXML(labelInfo) {
  const color = labelInfo.font.color;
  const frame = labelInfo.frame;
  return `
  <label opaque="NO" userInteractionEnabled="NO" contentMode="left" horizontalHuggingPriority="251" verticalHuggingPriority="251" fixedFrame="YES" text="${labelInfo.text}" textAlignment="natural" lineBreakMode="tailTruncation" baselineAdjustment="alignBaselines" adjustsFontSizeToFit="NO" translatesAutoresizingMaskIntoConstraints="NO">
      <rect key="frame" x="${frame.x}" y="${frame.y}" width="${frame.width}" height="${frame.height}"/>
      <autoresizingMask key="autoresizingMask" flexibleMaxX="YES" flexibleMaxY="YES"/>
      <fontDescription key="fontDescription" name="${labelInfo.font.name}" pointSize="${labelInfo.font.size}"/>
      <color key="textColor" red="${color.red}" green="${color.green}" blue="${color.blue}" alpha="1" colorSpace="custom" customColorSpace="sRGB"/>
      <nil key="highlightedColor"/>
  </label>
`;
}