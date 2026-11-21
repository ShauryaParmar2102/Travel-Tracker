
/*
    ==========================================
    TRAVEL TRACKER - ALL MY TRIPS CONTROLLER
    ==========================================

    This controller manages the All My Trips page.

    Responsibilities:
    1. Retrieve saved trips from local storage.
    2. Display each trip as a card.
    3. Calculate destinations and total nights.
    4. Allow users to create new trips.
    5. Navigate to the Edit Trip page.
    6. Navigate to the Trip Summary page.
    7. Delete locally saved trips.
*/

// Import TripModel to access the saved trip data.
import { TripModel } from "../../models/TripModel.mjs";

// Create the controller class.
export class allMyTripsController {

    // Store references to HTML elements.
    static newButton;
    static DestinationsContainer;


    // ==========================================
    // INITIALIZE THE PAGE
    // ==========================================

    // This method runs when the page has loaded.
    static Initialize() {

        // Find the New Trip button using its HTML ID.
        this.newButton = document.getElementById("new");

        // Find the container where trip cards are displayed.
        this.DestinationsContainer =
            document.getElementById("DestinationsContainer");

        // Check whether the New Trip button exists.
        if (this.newButton) {

            // addEventListener() listens for a button click.
            this.newButton.addEventListener("click", () => {

                // Redirect the browser to the New Trip page.
                window.location.href = "/views/newEditTrip.html";
            });
        }

        // Load and display the user's saved trips.
        this.RenderPage();
    }


    // ==========================================
    // RENDER ALL SAVED TRIPS
    // ==========================================

    static RenderPage() {

        // Stop if the destination container is missing.
        //
        // The ! operator means NOT.
        // return exits the current method.
        if (!this.DestinationsContainer) {
            return;
        }

        // Remove existing HTML content before rendering.
        //
        // This prevents duplicate trip cards.
        this.DestinationsContainer.innerHTML = "";

        // GetAllTrips() retrieves the trips saved
        // locally through the TripModel.
        const trips = TripModel.GetAllTrips();


        // ======================================
        // DISPLAY MESSAGE IF NO TRIPS EXIST
        // ======================================

        // .length returns the number of items in an array.
        //
        // If the array contains zero trips,
        // display a message instead of trip cards.
        if (trips.length === 0) {

            // Create a new div element.
            const emptyMessage = document.createElement("div");

            // Add a CSS class for styling.
            emptyMessage.classList.add("empty-trips");

            // Insert HTML content into the div.
            emptyMessage.innerHTML = `
                <h2>No trips found</h2>
                <p>
                    You haven't saved any trips yet.
                    Start by creating your first adventure!
                </p>
            `;

            // Append the message to the page.
            this.DestinationsContainer.appendChild(emptyMessage);

            // Stop because there are no trips to display.
            return;
        }


        // ======================================
        // LOOP THROUGH SAVED TRIPS
        // ======================================

        // forEach() executes a callback function
        // for every item in an array.
        //
        // trip represents the current saved trip.
        trips.forEach(trip => {

            // ==================================
            // CREATE TRIP CARD
            // ==================================

            // Create a new div for the trip card.
            const card = document.createElement("div");

            // Add the CSS class used to style trip cards.
            card.classList.add("trip-card");


            // ==================================
            // GET DESTINATIONS
            // ==================================

            // Array.isArray() checks whether
            // listOfDestinations is actually an array.
            //
            // The ternary operator works like
            // a shorter if...else statement.
            //
            // If the property is an array, use it.
            // Otherwise, use an empty array.
            const destinations =
                Array.isArray(trip.listOfDestinations)
                    ? trip.listOfDestinations
                    : [];

            // Count the destinations using .length.
            const destinationCount = destinations.length;


            // ==================================
            // CALCULATE TOTAL NIGHTS
            // ==================================

            // reduce() combines values from an array
            // into one final result.
            //
            // total = running total of nights.
            // destination = current destination.
            //
            // Number() converts the nights value
            // into a number.
            //
            // || 0 provides a fallback of zero.
            //
            // The final argument, 0, is the
            // initial value of the accumulator.
            const totalNights = destinations.reduce(
                (total, destination) => {
                    return total +
                        (Number(destination.nights) || 0);
                },
                0
            );


            // ==================================
            // DISPLAY TRIP NAME
            // ==================================

            // Create an h2 heading.
            const title = document.createElement("h2");

            // Display the saved trip name.
            //
            // If no name exists, show "Untitled Trip".
            //
            // textContent inserts text rather than HTML,
            // helping prevent HTML injection.
            title.textContent = trip.name || "Untitled Trip";

            // Add the heading to the trip card.
            card.appendChild(title);


            // ==================================
            // CREATE STATISTICS CONTAINER
            // ==================================

            // Create a div to hold the trip statistics.
            const stats = document.createElement("div");

            // Apply the statistics CSS class.
            stats.classList.add("trip-card-stats");


            // ==================================
            // DISPLAY DESTINATION COUNT
            // ==================================

            // Create a paragraph for destination count.
            const destinationStat = document.createElement("p");

            // Use a template literal to insert
            // the calculated destination count.
            //
            // <strong> makes the label bold.
            destinationStat.innerHTML = `
                <strong>Number of destinations:</strong>
                ${destinationCount}
            `;


            // ==================================
            // DISPLAY TOTAL NIGHTS
            // ==================================

            // Create another paragraph.
            const nightsStat = document.createElement("p");

            // Display the total nights calculated
            // earlier using reduce().
            nightsStat.innerHTML = `
                <strong>Total nights stayed:</strong>
                ${totalNights}
            `;


            // ==================================
            // ASSEMBLE STATISTICS
            // ==================================

            // Append both paragraphs to the stats div.
            stats.appendChild(destinationStat);
            stats.appendChild(nightsStat);

            // Append the stats div to the trip card.
            card.appendChild(stats);


            // ==================================
            // CREATE ACTION BUTTON CONTAINER
            // ==================================

            // Create a container for Edit, View and Delete.
            const actions = document.createElement("div");

            // Apply the CSS class used to
            // arrange and style the buttons.
            actions.classList.add("trip-card-actions");


            // ==================================
            // EDIT BUTTON
            // ==================================

            // Create an input element.
            const editButton = document.createElement("input");

            // Set the input type to button.
            editButton.type = "button";

            // Set the text displayed on the button.
            editButton.value = "Edit";

            // Apply the Edit button CSS class.
            editButton.classList.add("edit-button");


            // Listen for a click on the Edit button.
            editButton.addEventListener("click", () => {

                // Navigate to the New/Edit Trip page.
                //
                // The trip ID is included in the URL
                // so the editor knows which trip to load.
                //
                // encodeURIComponent() safely encodes
                // the ID for use in a URL query parameter.
                //
                // Example:
                // /views/newEditTrip.html?id=123
                window.location.href =
                    `/views/newEditTrip.html?id=${encodeURIComponent(trip.id)}`;
            });

            // Add the Edit button to the actions container.
            actions.appendChild(editButton);


            // ==================================
            // VIEW BUTTON
            // ==================================

            // Create the View button.
            const viewButton = document.createElement("input");

            // Set its type and visible text.
            viewButton.type = "button";
            viewButton.value = "View";

            // Apply the View button CSS class.
            viewButton.classList.add("view-button");


            // Listen for the View button click.
            viewButton.addEventListener("click", () => {

                // Navigate to the Trip Summary page.
                //
                // Pass the selected trip ID in the URL
                // so MySummaryController can find it.
                window.location.href =
                    `/views/mySummary.html?id=${encodeURIComponent(trip.id)}`;
            });

            // Add the View button to the actions container.
            actions.appendChild(viewButton);


            // ==================================
            // DELETE BUTTON
            // ==================================

            // Create the Delete button.
            const deleteButton = document.createElement("input");

            // Set the input type.
            deleteButton.type = "button";

            // Set the visible button text.
            deleteButton.value = "Delete";

            // Apply the Delete button CSS styling.
            deleteButton.classList.add("delete-button");


            // Listen for a click on the Delete button.
            deleteButton.addEventListener("click", () => {

                // ==================================
                // CONFIRM DELETION
                // ==================================

                // window.confirm() displays a browser
                // confirmation dialog.
                //
                // It returns:
                // true  = user selected OK.
                // false = user selected Cancel.
                const confirmed = window.confirm(
                    `Are you sure you want to delete "${trip.name}"?`
                );


                // If the user selects Cancel,
                // stop without deleting the trip.
                if (!confirmed) {
                    return;
                }


                // ==================================
                // DELETE SAVED TRIP
                // ==================================

                // DeleteTrip() removes the trip
                // matching the supplied ID
                // from local storage.
                TripModel.DeleteTrip(trip.id);


                // ==================================
                // REFRESH THE PAGE CONTENT
                // ==================================

                // Call RenderPage() again to rebuild
                // the cards using the remaining trips.
                //
                // This updates the display without
                // requiring a full browser refresh.
                this.RenderPage();
            });

            // Add the Delete button to the actions container.
            actions.appendChild(deleteButton);


            // ==================================
            // ASSEMBLE THE COMPLETED TRIP CARD
            // ==================================

            // Add the Edit, View and Delete buttons.
            card.appendChild(actions);

            // Append the completed card to the page.
            this.DestinationsContainer.appendChild(card);

        });
    }
}


// ==========================================
// INITIALIZE WHEN THE HTML DOCUMENT IS READY
// ==========================================

// DOMContentLoaded fires after the browser
// finishes parsing the HTML document.
//
// This ensures the page elements exist before
// the controller attempts to access them.
document.addEventListener("DOMContentLoaded", () => {

    // Start the All My Trips controller.
    allMyTripsController.Initialize();

});
