
/*
    Travel Tracker - Server Trip Model

    This model stores trips submitted to the server.

    It supports:
    - Adding trips
    - Retrieving trips
    - Finding trips by ID
    - Updating trips
    - Deleting trips
*/

export class ServerTripModel {

    // Constructor - Creates a new trip object.
    constructor(id, name, listOfDestinations) {

        this.id = id;
        this.name = name;

        // Store the complete destination objects.
        // This preserves distance, hotels and nights.
        this.listOfDestinations = listOfDestinations || [];
    }

    // Array used to store submitted trips in memory.
    static trips = [];


    // ==========================================
    // ADD A NEW TRIP
    // ==========================================

    static Add(trip) {

        // Check whether a trip with this ID exists.
        const exists = this.trips.some(
            existingTrip => existingTrip.id === trip.id
        );

        // Prevent duplicate trips.
        if (exists) {
            return false;
        }

        // Add the new trip to the array.
        this.trips.push(trip);

        return true;
    }


    // ==========================================
    // GET ALL TRIPS
    // ==========================================

    static GetAll() {

        // Return every submitted trip.
        return this.trips;
    }


    // ==========================================
    // FIND A TRIP BY ID
    // ==========================================

    static FindById(id) {

        // Search for a trip matching the given ID.
        return this.trips.find(
            trip => trip.id === id
        );
    }


    // ==========================================
    // UPDATE AN EXISTING TRIP
    // ==========================================

    static Update(updatedTrip) {

        // Find the position of the trip in the array.
        const index = this.trips.findIndex(
            trip => trip.id === updatedTrip.id
        );

        // Return false if the trip doesn't exist.
        if (index === -1) {
            return false;
        }

        // Replace the existing trip with the updated trip.
        // This preserves the new destination details.
        this.trips[index] = updatedTrip;

        return true;
    }


    // ==========================================
    // DELETE A TRIP
    // ==========================================

    static Delete(id) {

        // Record how many trips exist before deletion.
        const initialLength = this.trips.length;

        // Keep every trip except the matching ID.
        this.trips = this.trips.filter(
            trip => trip.id !== id
        );

        // Return true if a trip was deleted.
        return this.trips.length < initialLength;
    }
}
