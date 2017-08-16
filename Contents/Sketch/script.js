var onRun = function (context) {
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