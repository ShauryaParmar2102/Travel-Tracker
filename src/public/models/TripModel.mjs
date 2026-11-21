import {LegModel} from "./LegModel.mjs"

// TripModel.mjs
export class TripModel {
    constructor(id = null, name = "New Trip") {
        this.id = id ?? crypto.randomUUID(); // unique trip ID
        this.name = name;
        this.listOfDestinations = [];        // initialize destinations array
    }

    // Add a destination to this trip
    AddNewDestination(destination) {
        if (!destination.id) {
            destination.id = crypto.randomUUID(); // unique ID for the destination
        }
        this.listOfDestinations.push(destination);
        TripModel.Update(this); // save to localStorage automatically
    }

    // Remove a destination by ID
    RemoveDestination(destinationId) {
        this.listOfDestinations = this.listOfDestinations.filter(d => d.id !== destinationId);
        TripModel.Update(this); // save changes
    }

    // Save or update this trip in localStorage
    static Update(trip) {
        const allTrips = JSON.parse(localStorage.getItem('allTrips')) || [];
        const index = allTrips.findIndex(t => t.id === trip.id);

        if (index >= 0) {
            allTrips[index] = trip; // update existing
        } else {
            allTrips.push(trip); // add new
        }

        localStorage.setItem('allTrips', JSON.stringify(allTrips));
    }

    // Find a trip by ID
    static FindById(id) {
        const allTrips = JSON.parse(localStorage.getItem('allTrips')) || [];
        const tripData = allTrips.find(t => t.id === id);
        if (!tripData) return null;

        const trip = new TripModel(tripData.id, tripData.name);
        trip.listOfDestinations = tripData.listOfDestinations || [];
        return trip;
    }

    // Get all trips
    static GetAllTrips() {
        return JSON.parse(localStorage.getItem('allTrips')) || [];
    }

    // Optional: delete a trip
    static DeleteTrip(id) {
        const allTrips = JSON.parse(localStorage.getItem('allTrips')) || [];
        const updatedTrips = allTrips.filter(t => t.id !== id);
        localStorage.setItem('allTrips', JSON.stringify(updatedTrips));
    }
}
