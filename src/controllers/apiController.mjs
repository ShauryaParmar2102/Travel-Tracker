
/*
    Travel Tracker - API Controller

    This controller handles:
    - Getting flight destinations
    - Getting hotel information
    - Getting submitted trips
    - Creating a new trip
    - Updating an existing trip
    - Deleting a trip
*/

import { DestinationsModel } from "../models/DestinationsModel.mjs";
import { HotelModel } from "../models/HotelModel.mjs";
import { ServerTripModel } from "../models/ServerTripModel.mjs";

export class ApiController {

    // ==========================================
    // GET ALL DESTINATIONS
    // ==========================================

    static GetAllDestinations(req, res) {

        // Return the flight destinations dataset.
        res.status(200).json(DestinationsModel.GetAll());
    }


    // ==========================================
    // GET ALL HOTELS
    // ==========================================

    static GetAllHotels(req, res) {

        // Return the hotel dataset.
        res.status(200).json(HotelModel.hotelData);
    }


    // ==========================================
    // GET ALL TRIPS
    // ==========================================

    static GetAllTrips(req, res) {

        // Retrieve all trips stored on the server.
        res.status(200).json(ServerTripModel.GetAll());
    }


    // ==========================================
    // CREATE A NEW TRIP
    // ==========================================

    static NewTrip(req, res) {

        try {

            // Get the trip submitted by the frontend.
            const data = req.body;

            // Check that the required trip information exists.
            if (
                !data ||
                typeof data.id !== "string" ||
                !data.id.trim() ||
                typeof data.name !== "string" ||
                !data.name.trim() ||
                !Array.isArray(data.listOfDestinations) ||
                data.listOfDestinations.length === 0
            ) {
                return res.status(400).json({
                    message: "Missing or invalid trip data"
                });
            }

            // Validate each destination.
            // The server needs complete objects, not strings.
            const validDestinations =
                data.listOfDestinations.every(destination =>
                    destination &&
                    typeof destination === "object" &&
                    !Array.isArray(destination) &&
                    typeof destination.from === "string" &&
                    typeof destination.to === "string" &&
                    Number.isFinite(Number(destination.distance_km)) &&
                    Number(destination.distance_km) >= 0 &&
                    Number.isInteger(Number(destination.nights)) &&
                    Number(destination.nights) >= 0
                );

            if (!validDestinations) {
                return res.status(400).json({
                    message: "Invalid destination information"
                });
            }

            // Check if this trip is already on the server.
            const exists = ServerTripModel.GetAll().some(
                trip => trip.id === data.id
            );

            if (exists) {
                return res.status(409).json({
                    message: "Trip already exists"
                });
            }

            // Preserve all destination details.
            // Previously map(d => d.name) removed
            // distance, hotel and nights information.
            const destinations = data.listOfDestinations.map(
                destination => ({
                    name: destination.name,
                    from: destination.from,
                    to: destination.to,
                    distance_km: Number(destination.distance_km),
                    hotel: destination.hotel || null,
                    nights: Number(destination.nights)
                })
            );

            // Create the server trip object.
            const newTrip = new ServerTripModel(
                data.id,
                data.name,
                destinations
            );

            // Save the trip on the server.
            ServerTripModel.Add(newTrip);

            // Return a successful response.
            return res.status(201).json({
                message: "success",
                trip: newTrip
            });

        } catch (error) {

            console.error("Error creating trip:", error);

            return res.status(500).json({
                message: "Internal server error"
            });
        }
    }


    // ==========================================
    // UPDATE AN EXISTING TRIP
    // ==========================================

    static UpdateTrip(req, res) {

        try {

            // Read the updated trip information.
            const data = req.body;

            if (
                !data ||
                typeof data.id !== "string" ||
                !data.id.trim() ||
                typeof data.name !== "string" ||
                !data.name.trim() ||
                !Array.isArray(data.listOfDestinations) ||
                data.listOfDestinations.length === 0
            ) {
                return res.status(400).json({
                    message: "Missing or invalid trip data"
                });
            }

            // Ensure the updated destinations contain
            // all the fields needed by the leaderboard.
            const validDestinations =
                data.listOfDestinations.every(destination =>
                    destination &&
                    typeof destination === "object" &&
                    !Array.isArray(destination) &&
                    typeof destination.from === "string" &&
                    typeof destination.to === "string" &&
                    Number.isFinite(Number(destination.distance_km)) &&
                    Number(destination.distance_km) >= 0 &&
                    Number.isInteger(Number(destination.nights)) &&
                    Number(destination.nights) >= 0
                );

            if (!validDestinations) {
                return res.status(400).json({
                    message: "Invalid destination information"
                });
            }

            // Keep the complete destination objects.
            const destinations = data.listOfDestinations.map(
                destination => ({
                    name: destination.name,
                    from: destination.from,
                    to: destination.to,
                    distance_km: Number(destination.distance_km),
                    hotel: destination.hotel || null,
                    nights: Number(destination.nights)
                })
            );

            // Create the updated trip object.
            const updatedTrip = new ServerTripModel(
                data.id,
                data.name,
                destinations
            );

            // Update the trip in server storage.
            const updated = ServerTripModel.Update(updatedTrip);

            if (updated === false) {
                return res.status(404).json({
                    message: "Trip not found"
                });
            }

            // Confirm the update.
            return res.status(200).json({
                message: "success"
            });

        } catch (error) {

            console.error("Error updating trip:", error);

            return res.status(500).json({
                message: "Internal server error"
            });
        }
    }


    // ==========================================
    // DELETE A TRIP
    // ==========================================

    static DeleteTrip(req, res) {

        try {

            // Read the ID of the trip to delete.
            const idToDelete = req.params.id;

            if (!idToDelete) {
                return res.status(400).json({
                    message: "Missing trip id"
                });
            }

            // Remove the trip from server storage.
            const deleted = ServerTripModel.Delete(idToDelete);

            // Return an error if the trip does not exist.
            if (!deleted) {
                return res.status(404).json({
                    message: "Trip not found"
                });
            }

            // Confirm the trip was deleted.
            return res.status(200).json({
                message: "deleted"
            });

        } catch (error) {

            console.error("Error deleting trip:", error);

            return res.status(500).json({
                message: "Internal server error"
            });
        }
    }
}
