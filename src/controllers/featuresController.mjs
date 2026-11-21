
/*
    Travel Tracker - Features Controller

    This controller handles:

    1. Public Leaderboard
       - Retrieves submitted trips
       - Calculates total distance travelled
       - Calculates total nights stayed
       - Counts hotels and destinations
       - Provides the complete itinerary
       - Sorts trips by distance travelled

    2. Public Statistics
       - Counts submitted trips
       - Counts destination visits
       - Finds the most popular destination
*/

import { ServerTripModel } from "../models/ServerTripModel.mjs";


// ======================================================
// HELPER FUNCTION - CALCULATE TRIP TOTALS
// ======================================================

function calculateTripTotals(trip) {

    // Check that the trip contains a destinations array.
    if (!Array.isArray(trip.listOfDestinations)) {
        return {
            distanceTravelled: 0,
            nightsStayed: 0,
            numberOfHotels: 0
        };
    }

    // Calculate total flight distance using reduce().
    const distanceTravelled = trip.listOfDestinations.reduce(
        (total, destination) => {

            // Ignore invalid destination objects.
            if (
                !destination ||
                typeof destination !== "object"
            ) {
                return total;
            }

            // Add the actual flight distance.
            return total +
                (Number(destination.distance_km) || 0);

        }, 0
    );


    // Calculate the total number of nights stayed.
    const nightsStayed = trip.listOfDestinations.reduce(
        (total, destination) => {

            if (
                !destination ||
                typeof destination !== "object"
            ) {
                return total;
            }

            // Add the nights for this destination.
            return total +
                (Number(destination.nights) || 0);

        }, 0
    );


    // Count destinations that have a selected hotel.
    const numberOfHotels = trip.listOfDestinations.filter(
        destination =>
            destination &&
            typeof destination === "object" &&
            destination.hotel
    ).length;


    // Return the calculated totals.
    return {
        distanceTravelled,
        nightsStayed,
        numberOfHotels
    };
}


// ======================================================
// FEATURES CONTROLLER
// ======================================================

export const featuresController = {


    // ==================================================
    // PUBLIC LEADERBOARD
    // ==================================================

    RenderPublicLeaderboard: (req, res) => {

        try {

            // Retrieve all trips submitted to the server.
            const trips = ServerTripModel.GetAll() || [];

            // Convert each trip into leaderboard information.
            const leaderboardData = trips.map(trip => {

                // Calculate the trip totals.
                const totals = calculateTripTotals(trip);

                // Retrieve the destinations array.
                const destinations =
                    Array.isArray(trip.listOfDestinations)
                        ? trip.listOfDestinations
                        : [];

                // Count the destinations.
                const numberOfDestinations =
                    destinations.length;

                // Create the leaderboard object.
                return {

                    // Trip identification.
                    id: trip.id,
                    name: trip.name || "Untitled Trip",

                    // Number of destinations.
                    numberOfDestinations,

                    // Total distance travelled.
                    distanceTravelled:
                        totals.distanceTravelled,

                    // Total nights stayed.
                    nightsStayed:
                        totals.nightsStayed,

                    // Number of selected hotels.
                    numberOfHotels:
                        totals.numberOfHotels,

                    // Complete itinerary.
                    // Includes from, to, hotel,
                    // distance_km and nights.
                    destinations: destinations,

                    // Number of travellers, if available.
                    travellers:
                        Number(trip.travellers) || 1

                };
            });


            // Sort trips by distance travelled.
            // The longest trip appears first.
            leaderboardData.sort(
                (a, b) =>
                    b.distanceTravelled - a.distanceTravelled
            );


            // Render the public leaderboard EJS view.
            res.render("publicLeaderboard", {
                leaderboardData
            });

        } catch (error) {

            // Display errors in the server terminal.
            console.error("Leaderboard Error:", error);

            // Send an error response.
            res.status(500).send(
                "Error loading leaderboard"
            );
        }
    },


    // ==================================================
    // PUBLIC STATISTICS
    // ==================================================

    RenderPublicStatistics: (req, res) => {

        try {

            // Retrieve all submitted trips.
            const trips = ServerTripModel.GetAll() || [];

            // Store how often each destination is visited.
            const destinationFrequency = {};


            // Loop through every submitted trip.
            trips.forEach(trip => {

                // Check that destinations exist.
                if (!Array.isArray(trip.listOfDestinations)) {
                    return;
                }


                // Loop through each destination.
                trip.listOfDestinations.forEach(destination => {

                    // Default destination label.
                    let label = "Unknown";

                    // Handle destination objects.
                    if (
                        destination &&
                        typeof destination === "object"
                    ) {

                        // Use the arrival country.
                        label =
                            destination.to ||
                            destination.name ||
                            "Unknown";

                    } else if (
                        typeof destination === "string"
                    ) {

                        // Support older trips stored as strings.
                        label = destination;
                    }


                    // Increase the destination visit count.
                    destinationFrequency[label] =
                        (destinationFrequency[label] || 0) + 1;

                });
            });


            // Convert destination counts into an array.
            const sortedDestinations =
                Object.entries(destinationFrequency);


            // Sort by number of visits.
            sortedDestinations.sort(
                (a, b) => b[1] - a[1]
            );


            // Find the most popular destination.
            const mostPopularDestination =
                sortedDestinations.length > 0
                    ? sortedDestinations[0][0]
                    : "None";


            // Render the statistics EJS page.
            res.render("publicStatistics", {

                // Number of submitted trips.
                totalTrips: trips.length,

                // Most visited destination.
                mostPopularDestination,

                // Destination visit counts.
                destinationFrequency

            });

        } catch (error) {

            // Log the error.
            console.error("Statistics Error:", error);

            // Send an error response.
            res.status(500).send(
                "Error loading statistics"
            );
        }
    }

};
