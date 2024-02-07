 Code for legend
 
 //Create a control for our layers, and add our overlays to it
  L.control.layers(null, overlaysMaps).addTo(map);

  //Create a legent to display information about our map
  let info = L.control({
    position: "bottomright"
  }); 

  //When the layer control is added, inser a div with the class of "legend".
  info.onAdd = function() {
    let div = L.DomUtil.create("div", "legend");
    return div;
  };

  //Add the info legend to the map
  info.addTo(myMap);