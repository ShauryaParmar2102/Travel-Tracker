
/*
    Travel Tracker - All My Trips Controller

    This controller handles:
    - Loading locally saved trips
    - Displaying trip information
    - Calculating total nights stayed
    - Navigating to the Edit Trip page
    - Navigating to the Trip Summary page
    - Deleting locally saved trips
*/

import { TripModel } from "../../models/TripModel.mjs";

export class allMyTripsController {

    static newButton;
    static DestinationsContainer;


    // ==========================================
    // INITIALIZE THE PAGE
    // ==========================================

    static Initialize() {

        // Find the New Trip button and trip container.
        this.newButton = document.getElementById("new");

        this.DestinationsContainer =
            document.getElementById("DestinationsContainer");

        // Redirect to the New Trip page when clicked.
        if (this.newButton) {

            this.newButton.addEventListener("click", () => {
                window.location.href = "/views/newEditTrip.html";
            });
        }

        // Load and display saved trips.
        this.RenderPage();
    }


    // ==========================================
    // RENDER ALL SAVED TRIPS
    // ==========================================

    static RenderPage() {

        // Stop if the trip container doesn't exist.
        if (!this.DestinationsContainer) {
            return;
        }

        // Clear existing cards before rendering.
        this.DestinationsContainer.innerHTML = "";

        // Retrieve trips from local storage.
        const trips = TripModel.GetAllTrips();


        // ======================================
        // NO TRIPS FOUND
        // ======================================

        if (trips.length === 0) {

            const emptyMessage = document.createElement("div");

            emptyMessage.classList.add("empty-trips");

            emptyMessage.innerHTML = `
                <h2>No trips found</h2>
                <p>
                    You haven't saved any trips yet.
                    Start by creating your first adventure!
                </p>
            `;

            this.DestinationsContainer.appendChild(emptyMessage);

            return;
        }


        // ======================================
        // CREATE A CARD FOR EACH TRIP
        // ======================================

        trips.forEach(trip => {

            // Create the main trip card.
            const card = document.createElement("div");

            // Apply the professional card CSS.
            card.classList.add("trip-card");


            // ==================================
            // CALCULATE TRIP INFORMATION
            // ==================================

            // Get the destinations saved in the trip.
            const destinations =
                Array.isArray(trip.listOfDestinations)
                    ? trip.listOfDestinations
                    : [];

            // Count the number of destinations.
            const destinationCount = destinations.length;

            // Calculate total nights using reduce().
            const totalNights = destinations.reduce(
                (total, destination) => {
                    return total +
                        (Number(destination.nights) || 0);
                },
                0
            );


            // ==================================
            // DISPLAY TRIP DETAILS
            // ==================================

            // Create the trip title.
            const title = document.createElement("h2");

            // Use textContent to display the name safely.
            title.textContent = trip.name || "Untitled Trip";

            card.appendChild(title);


            // Create a container for the statistics.
            const stats = document.createElement("div");

            stats.classList.add("trip-card-stats");

            // Create the destination statistic.
            const destinationStat = document.createElement("p");

            destinationStat.innerHTML = `
                <strong>Number of destinations:</strong>
                ${destinationCount}
            `;

            // Create the nights statistic.
            const nightsStat = document.createElement("p");

            nightsStat.innerHTML = `
                <strong>Total nights stayed:</strong>
                ${totalNights}
            `;

            // Add statistics to their container.
            stats.appendChild(destinationStat);
            stats.appendChild(nightsStat);

            // Add the statistics to the card.
            card.appendChild(stats);


            // ==================================
            // CREATE ACTION BUTTON CONTAINER
            // ==================================

            const actions = document.createElement("div");

            actions.classList.add("trip-card-actions");


            // ==================================
            // EDIT BUTTON
            // ==================================

            const editButton = document.createElement("input");

            editButton.type = "button";
            editButton.value = "Edit";

            editButton.classList.add("edit-button");

            // Navigate to the editor with the trip ID.
            editButton.addEventListener("click", () => {

                window.location.href =
                    `/views/newEditTrip.html?id=${encodeURIComponent(trip.id)}`;
            });

            actions.appendChild(editButton);


            // ==================================
            // VIEW BUTTON
            // ==================================

            const viewButton = document.createElement("input");

            viewButton.type = "button";
            viewButton.value = "View";

            viewButton.classList.add("view-button");

            // Open the Trip Summary page.
            viewButton.addEventListener("click", () => {

                window.location.href =
                    `/views/mySummary.html?id=${encodeURIComponent(trip.id)}`;
            });

            actions.appendChild(viewButton);


            // ==================================
            // DELETE BUTTON
            // ==================================

            const deleteButton = document.createElement("input");

            deleteButton.type = "button";
            deleteButton.value = "Delete";

            // Apply the red Delete button styling.
            deleteButton.classList.add("delete-button");

            // Delete the trip and refresh the cards.
            deleteButton.addEventListener("click", () => {

                // Ask for confirmation before deleting.
                const confirmed = window.confirm(
                    `Are you sure you want to delete "${trip.name}"?`
                );

                // Cancel deletion if the user selects Cancel.
                if (!confirmed) {
                    return;
                }

                // Delete the trip from local storage.
                TripModel.DeleteTrip(trip.id);

                // Refresh the saved trip cards.
                this.RenderPage();
            });

            actions.appendChild(deleteButton);


            // ==================================
            // ASSEMBLE THE CARD
            // ==================================

            // Add the action buttons to the trip card.
            card.appendChild(actions);

            // Add the completed card to the page.
            this.DestinationsContainer.appendChild(card);

        });
    }
}


// ==========================================
// START CONTROLLER WHEN PAGE LOADS
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    allMyTripsController.Initialize();

});
