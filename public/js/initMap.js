var neighborhoods = [
                ['Centraal', 52.3782623, 4.8973583],
                ['West', 52.372861, 4.858998],
                ['Zuid', 52.337345, 4.873607],
                ['Oost', 52.354536, 4.929004],
                ['Noord', 52.388783, 4.909742],
                ['De Wallen', 52.371736, 4.894630],
                ['De Pijp', 52.351673, 4.894359]
              ];
              
          function initMap() {
              var mapDiv = document.getElementById('map');
              var map = new google.maps.Map(mapDiv, {
                center: {lat: 52.369359, lng: 4.893589},
                zoom: 14
              });

              var contentString = '<div id="content">'+
                          '<h2 id="firstHeading" class="firstHeading">Deliver Box</h2>'+
                          '<div id="bodyContent">'+
                          '<p><b>Busy boxes: </b><span id="busyBoxes">0</span></p>'+
                          '<p><b>Boxes Available: </b><span id="avalable">2</span></p>'+
                          '<p><button class="btn btn-primary" id="deliverItem" type="submit">Deliver Item</button></p>'+
                          '</div></div>';

                var infowindow = new google.maps.InfoWindow({ content: contentString });

                for (var i = 0; i < neighborhoods.length; i++) {
                  var neighbor = neighborhoods[i];
                  var marker = new google.maps.Marker({
                                position: {lat:neighbor[1], lng:neighbor[2]},
                                map: map,
                                title: neighbor[0]
                              });
                  marker.addListener('click', function() {
                      infowindow.open(map, marker);
                  });
                }

            }