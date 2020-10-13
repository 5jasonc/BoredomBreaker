import LocationData from "./classes.js";
export {initMap, initDatabase};

// Initialize Google Maps API and Places API
function initMap() {
    // Start location at RIT
    let startLocation = new google.maps.LatLng(43.0846, -77.6743);
    
    // Initialize map
    let map = new google.maps.Map(document.querySelector("#map"), {
        center: startLocation,
        zoom: 14
    });
    
    // Initialize Places API on our map
    let service = new google.maps.places.PlacesService(map);
    
    let locationData = new LocationData(map, service, startLocation);
    
    return locationData;
}

// Initialize FireBase API
function initDatabase() {
    // Firebase config
    let firebaseConfig = {
        apiKey: "AIzaSyAxIOHMDNGth0-15A9F_ppB8ISUbzk8HEQ",
        authDomain: "boredom-breaker.firebaseapp.com",
        databaseURL: "https://boredom-breaker.firebaseio.com",
        projectId: "boredom-breaker",
        storageBucket: "boredom-breaker.appspot.com",
        messagingSenderId: "24356562689",
        appId: "1:24356562689:web:71d61ff55f914f32139d00"
    };
    
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    
    let database = firebase.database();
}