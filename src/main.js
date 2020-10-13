import "./vue-components.js";
import {initMap, initDatabase} from "./utils.js";
export {init};

// Holds Vue application
let app;

// Holds all map data
let locationData;

// Used by local storage
const prefix = "jcs1738-";

// Initialize all API and Vue resources
function init() {
    app = new Vue({
        el: '#app',
        data: {
            title: 'Boredom Breaker',
            status: 'Click button to search',
            url: '',
            activityType: '',
            numParticipants: '',
            minPrice: '',
            maxPrice: '',
            result: {},
            locations: ''
        },
        methods: {
            //Performs search using Google Maps API, Place API, and BoredAPI
            search() {
                this.status = "Searching...";
                this.url = "https://www.boredapi.com/api/activity?";
                let userData = {};
                
                // If terms are not empty, add them to query url and database tuple
                if(this.activityType != "") {
                    this.url += "type=" + this.activityType + "&";
                }
                userData.activityType = this.activityType;
                
                if(this.numParticipants != "") {
                    this.url += "participants=" + this.numParticipants + "&";
                }
                userData.numParticipants = this.numParticipants;
                
                if((this.maxPrice != "" && !isNaN(this.maxPrice)) && (this.minPrice != "" && !isNaN(this.minPrice))) {
                    this.url += "minprice=" + this.minPrice + "&maxprice=" + this.maxPrice;
                }
                userData.minPrice = this.minPrice;
                userData.maxPrice = this.maxPrice;
                
                // Add current time to database tuple
                let date = new Date();
                userData.timestamp = date.toUTCString();
                
                // Save search terms to local storage
                localStorage.setItem(prefix + "activityType", this.activityType);
                localStorage.setItem(prefix + "numParticipants", this.numParticipants);
                localStorage.setItem(prefix + "minPrice", this.minPrice);
                localStorage.setItem(prefix + "maxPrice", this.maxPrice);
                
                // Use Fetch to get data from our query URL
                fetch(this.url)
                .then(response => {
                    if(!response.ok) {
                        throw Error(`ERROR: ${response.statusText}`);
                    }
                    return response.json();
                }).then(json => {
                    this.result = json;
                    
                    // If any activities are returned add potential locations to map
                    if(!this.result.error) {
                        locationData.populateMap(this.result.activity);
                        this.locations = locationData.mapMarkers;
                        this.status = "Click button to search";
                    }
                    else {
                        this.status = "No activities found!";
                        locationData.clearMarkers();
                        this.locations = [];
                    }
                    
                    // Add user search to database
                    firebase.database().ref('searches').push(userData);
                });   
            }
        },
        created() {        
            // Load user's previous search terms if they exist
            if(localStorage.getItem(prefix + "activityType")) this.activityType = localStorage.getItem(prefix + "activityType");
            if(localStorage.getItem(prefix + "numParticipants")) this.numParticipants = localStorage.getItem(prefix + "numParticipants");
            if(localStorage.getItem(prefix + "minPrice")) this.minPrice = localStorage.getItem(prefix + "minPrice");
            if(localStorage.getItem(prefix + "maxPrice")) this.maxPrice = localStorage.getItem(prefix + "maxPrice");
            
            // Initialize map and database APIs and perform search
            locationData = initMap();
            initDatabase();
            this.search();
        }
    });
}