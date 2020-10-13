export default class LocationData {
    constructor(map, placeService, location) {
        this.mapMarkers = [];
        this.infowindow = null;
        this.map = map;
        this.placeService = placeService;
        this.location = location;
    }
    
    // Performs a search of locations using Place API and creates map markers
    populateMap(input) {
        // Clear previous markers
        this.clearMarkers();

        // Build our request
        let request = {
            location: this.location,
            radius: '500',
            query: input
        };

        // Perform a search using Places API and built request
        this.placeService.textSearch(request, (results, status) => {
            // Callback function for Place API loacation search
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                
                // Create a marker for each location Place API returns
                for(let i = 0; i < results.length; i++) {
                    this.createMarker(results[i]);
                }

                // Extend bounds of map to fit all locations
                if(this.mapMarkers.length > 0) {
                    let bounds = new google.maps.LatLngBounds();

                    for(let marker of this.mapMarkers) {
                        bounds.extend(marker.getPosition());
                    }

                    this.map.fitBounds(bounds);
                    
                    window.scrollTo(0, window.innerHeight);
                }
            }
        });
    }
    
    // Creates a google map marker at a specified location
    createMarker(place) {
        let marker = new google.maps.Marker({
            position: place.geometry.location,
            map: this.map,
            title: place.name
        });

        // Display infowindow about location on click, closes previous infowindow
        marker.addListener('click', _ => {
            if(this.infowindow != null) this.infowindow.close();

            this.infowindow = new google.maps.InfoWindow({
                content: place.name
            });

            this.infowindow.open(map, marker);
        });

        this.mapMarkers.push(marker);
    }
    
    // Clear the map of all markers and reset the array
    clearMarkers() {
        for(let marker of this.mapMarkers) {
            marker.setMap(null);
        }

        this.mapMarkers = [];
    }
}