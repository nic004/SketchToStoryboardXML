
var onMulti = function (context) {
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
    tree.push({type: 'image', name: groupLayer.name(), layer: groupLayer.class()});
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
          nodes.push({type: 'text', text: layer.name(), layer: layer.class()});
      }
      else if (clas == 'MSShapeLayer' || clas == 'MSShapeGroup') {
          log('handle shapelayer');
          nodes.push({type: 'image', name: layer.name(), layer: layer.class()});
      }
    });
    tree.push({group: { name: groupLayer.name(), children:  nodes} });
  }
  return tree;
}

function isImageGroupLayer(groupLayer) {
  if (groupLayer.children().length <= 0) {
    return false;
  }

  let layers = groupLayer.children();
  for (var i = 0; i < layers.count(); i++) {
    const c = layers[i].class();
    log(c);
    if (c == 'MSTextLayer') {
      return false;
    }
  }

  return true;
}

var onLabel = function (context) {
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
      // log(`${layer.name()} - ${layer.class()}`);
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


var onBorderableButton = function (context) {
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
      // log(`${layer.name()} - ${layer.class()}`);
      var name = layer.name();

      if (layer.class() == "MSLayerGroup") {
        const o = layer.layers().reduce((obj, cv) => {
          if (cv.class() == "MSShapeGroup") {
            obj.bg = cv;
          } else if (cv.class() == "MSTextLayer") {
            obj.text = cv;
          } else if (cv.class() == "MSLayerGroup") {
            obj.image = cv;
          }
          return obj;
        }, {});

        const info = {
          text: o.text.name(),
          frame: {
            x: layer.frame().x() / 2,
            y: layer.frame().y() / 2,
            width: layer.frame().width() / 2,
            height: layer.frame().height() / 2
          },
          font: {
              name: o.text.fontPostscriptName(),
              size: o.text.fontSize()/2, 
          },
          color: { 
            red: o.text.textColor().red(), 
            green: o.text.textColor().green(), 
            blue: o.text.textColor().blue() 
          },
          stroke: {
            width: 1
          }
        };

        if (o.image) {
          info.image = { name: camel(o.image.name()) };
        }

        // log(info);
        const button = BorderableButtonXML(info);
        log(button);
      }

    }
  }
}


function rgbToHex(r, g, b) {
  var rInt = 255 * r;
  var gInt = 255 * g;
  var bInt = 255 * b;
  
  return "#" + ((1 << 24) + (rInt << 16) + (gInt << 8) + bInt).toString(16).slice(1);
}

function camel(str) {
  return str.replace(/_([a-z])/g, function (g) { return g[1].toUpperCase(); });
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

function BorderableButtonXML(info) {
  const color = info.color;
  const frame = info.frame;
  const font = info.font;
  const image = info.image ? `image="${info.image.name}"` : '';
  return `
<button opaque="NO" contentMode="scaleToFill" fixedFrame="YES" contentHorizontalAlignment="center" contentVerticalAlignment="center" lineBreakMode="middleTruncation" translatesAutoresizingMaskIntoConstraints="NO" customClass="BorderableButton" customModule="CanGoToDev" customModuleProvider="target">
  <rect key="frame" x="${frame.x}" y="${frame.y}" width="${frame.width}" height="${frame.height}"/>
  <autoresizingMask key="autoresizingMask" flexibleMaxX="YES" flexibleMaxY="YES"/>
  <fontDescription key="fontDescription" name="${font.name}" pointSize="${font.size}"/>
  <state key="normal" title="${info.text}" ${image}>
      <color key="titleColor" red="0.40000000600000002" green="0.40000000600000002" blue="0.40000000600000002" alpha="1" colorSpace="deviceRGB"/>
  </state>
  <userDefinedRuntimeAttributes>
      <userDefinedRuntimeAttribute type="number" keyPath="borderTop">
          <real key="value" value="${info.stroke.width}"/>
      </userDefinedRuntimeAttribute>
      <userDefinedRuntimeAttribute type="number" keyPath="borderLeft">
          <real key="value" value="${info.stroke.width}"/>
      </userDefinedRuntimeAttribute>
      <userDefinedRuntimeAttribute type="number" keyPath="borderBottom">
          <real key="value" value="${info.stroke.width}"/>
      </userDefinedRuntimeAttribute>
      <userDefinedRuntimeAttribute type="number" keyPath="borderRight">
          <real key="value" value="${info.stroke.width}"/>
      </userDefinedRuntimeAttribute>
      <userDefinedRuntimeAttribute type="color" keyPath="borderColor">
          <color key="value" red="0.91440784929999996" green="0.91440784929999996" blue="0.91440784929999996" alpha="1" colorSpace="deviceRGB"/>
      </userDefinedRuntimeAttribute>
  </userDefinedRuntimeAttributes>
</button>
`
}