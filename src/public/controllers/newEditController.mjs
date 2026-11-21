
/*
    ==========================================
    TRAVEL TRACKER - NEW / EDIT CONTROLLER
    ==========================================

    This controller manages the trip planning page.

    Main responsibilities:
    1. Load destination and hotel data from the server.
    2. Create new trips or load existing trips.
    3. Populate the destination and hotel dropdowns.
    4. Add destinations to an itinerary.
    5. Assign hotels to destinations.
    6. Change the number of nights stayed.
    7. Remove destinations from an itinerary.
    8. Calculate trip statistics and costs.
    9. Save trips using the TripModel.
    10. Submit trips to the public leaderboard.
*/

// Import TripModel, which handles locally stored trips.
import { TripModel } from "../models/TripModel.mjs";

export class NewEditController {

    // ==========================================
    // CLASS PROPERTIES
    // ==========================================

    // Store destination data received from the backend.
    static allDestinations = [];

    // Store hotel data received from the backend.
    static allHotels = [];

    // Store the trip currently being created or edited.
    static trip = null;

    // Read the trip ID from the URL query string.
    //
    // Example:
    // newEditTrip.html?id=123
    //
    // If no ID is provided, use null.
    static id = new URLSearchParams(
        window.location.search
    ).get('id') ?? null;


    // ==========================================
    // HTML ELEMENT REFERENCES
    // ==========================================

    // getElementById() retrieves an HTML element
    // so JavaScript can interact with it.

    // Trip name input field.
    static inpDestinationName =
        document.getElementById('inpDestinationName');

    // Dropdown containing available destinations.
    static selectDestination =
        document.getElementById('SelectDestinationBox');

    // Button for adding a destination.
    static btnAddDestination =
        document.getElementById('btnAddDestination');

    // Dropdown containing available hotels.
    static selectHotel =
        document.getElementById('SelectHotelBox');

    // Button for adding a hotel.
    static btnAddHotel =
        document.getElementById('btnAddHotel');

    // Container displaying the current itinerary.
    static divDestinationsContainer =
        document.getElementById('divDestinationsContainer');

    // Button for saving the trip.
    static btnSave =
        document.getElementById('btnSave');

    // Button for submitting the trip to the leaderboard.
    static btnPost =
        document.getElementById('btnPost');


    // ==========================================
    // STATIC INITIALIZATION BLOCK
    // ==========================================

    // A static initialization block runs automatically
    // when the class is evaluated.
    //
    // It prepares the trip and loads the data needed
    // by the page.

    static {

        // ======================================
        // LOAD OR CREATE A TRIP
        // ======================================

        // The ternary operator checks whether
        // a trip ID exists.
        //
        // If an ID exists:
        // Find the previously saved trip.
        //
        // Otherwise:
        // Create a new TripModel object.
        this.trip = this.id
            ? TripModel.FindById(this.id)
            : new TripModel(null, "");


        // Ensure the trip has a destinations array.
        //
        // This prevents errors when adding destinations
        // to a trip that has no itinerary yet.
        if (!this.trip.listOfDestinations) {
            this.trip.listOfDestinations = [];
        }


        // ======================================
        // FETCH DESTINATIONS AND HOTELS
        // ======================================

        // Promise.all() runs multiple asynchronous
        // operations and waits for all of them.
        //
        // Here, two HTTP GET requests are made:
        //
        // 1. Get all destinations.
        // 2. Get all hotels.
        //
        // fetch() sends the HTTP request.
        // res.json() converts the JSON response
        // into JavaScript data.

        Promise.all([

            fetch('/api/getAllDestinationData')
                .then(res => res.json()),

            fetch('/api/getAllHotelData')
                .then(res => res.json())

        ])

        // .then() runs when both requests complete.
        //
        // Array destructuring assigns the first
        // result to destinations and the second
        // result to hotels.
        .then(([destinations, hotels]) => {

            // Save the destination data.
            this.allDestinations = destinations;


            // ==================================
            // CONVERT GROUPED HOTELS INTO ONE ARRAY
            // ==================================

            // The backend groups hotels by country.
            //
            // flatMap() loops through each country
            // and combines its hotels into one array.
            //
            // map() transforms each hotel into
            // an object containing the fields
            // needed by this controller.

            this.allHotels = hotels.flatMap(country =>

                country.hotels.map(hotel => ({

                    // Hotel name.
                    name: hotel.name,

                    // Country where the hotel is located.
                    country: country.country,

                    // Accommodation cost per night.
                    price_per_night: hotel.price_per_night

                }))
            );


            // Now that the data has loaded,
            // display the trip planning page.
            this.RenderPage();

        })

        // Handle errors when loading travel data.
        .catch(error => {

            // Display the error in the browser console.
            console.error(
                "Error loading travel data:",
                error
            );

        });
    }


    // ==========================================
    // RENDER THE TRIP PLANNING PAGE
    // ==========================================

    static RenderPage() {

        // Display the existing trip name when editing.
        //
        // If the trip has no name, display an empty string.
        this.inpDestinationName.value =
            this.trip.name || "";


        // Fill the destination dropdown.
        this.populateDestinationDropdown();

        // Fill the hotel dropdown.
        this.populateHotelDropdown();

        // Display destinations already added to the trip.
        this.renderDestinationsContainer();

        // Register the button click event listeners.
        this.setupEventListeners();
    }


    // ==========================================
    // POPULATE DESTINATION DROPDOWN
    // ==========================================

    static populateDestinationDropdown() {

        // Clear existing dropdown options.
        this.selectDestination.innerHTML = "";


        // forEach() loops through every destination
        // retrieved from the server.
        //
        // dest represents the current destination.
        this.allDestinations.forEach(dest => {

            // Create a new HTML option element.
            const opt = document.createElement('option');


            // Store the route information as its value.
            //
            // Template literals use backticks.
            //
            // ${variable} inserts a JavaScript value
            // into a string.
            opt.value =
                `${dest.from}|${dest.to}|${dest.distance_km}`;


            // Display the route and distance
            // as the text visible in the dropdown.
            opt.textContent =
                `${dest.from} → ${dest.to} | Distance: ${dest.distance_km} km`;


            // Add the option to the dropdown.
            this.selectDestination.appendChild(opt);

        });
    }


    // ==========================================
    // POPULATE HOTEL DROPDOWN
    // ==========================================

    static populateHotelDropdown() {

        // Remove existing hotel options.
        this.selectHotel.innerHTML = "";


        // Loop through every available hotel.
        this.allHotels.forEach(hotel => {

            // Create a new option element.
            const opt = document.createElement('option');


            // Use the hotel name as its value.
            opt.value = hotel.name;


            // Display the hotel's name, country
            // and nightly accommodation price.
            opt.textContent =
                `${hotel.name} – ${hotel.country} ($${hotel.price_per_night}/night)`;


            // Add the option to the hotel dropdown.
            this.selectHotel.appendChild(opt);

        });
    }


    // ==========================================
    // SET UP EVENT LISTENERS
    // ==========================================

    // addEventListener() allows JavaScript
    // to respond to user actions such as clicks.

    static setupEventListeners() {


        // ======================================
        // ADD DESTINATION BUTTON
        // ======================================

        this.btnAddDestination.addEventListener('click', () => {

            // Get the position of the selected option.
            const idx = this.selectDestination.selectedIndex;


            // Stop if nothing is selected.
            if (idx < 0) {
                return;
            }


            // Retrieve the selected destination
            // from the destinations array.
            const dest = this.allDestinations[idx];


            // AddNewDestination() is a method
            // provided by the TripModel.
            //
            // It adds a new destination object
            // to the current trip.
            this.trip.AddNewDestination({

                // Generate a unique destination ID.
                id: crypto.randomUUID(),

                // Create a readable route name.
                name: `${dest.from} → ${dest.to}`,

                // Starting location.
                from: dest.from,

                // Arrival location.
                to: dest.to,

                // Distance between locations.
                distance_km: dest.distance_km,

                // No hotel selected initially.
                hotel: null,

                // Default stay is one night.
                nights: 1

            });


            // Refresh the itinerary to show
            // the newly added destination.
            this.renderDestinationsContainer();

        });


        // ======================================
        // ADD HOTEL BUTTON
        // ======================================

        this.btnAddHotel.addEventListener('click', () => {

            // Get the selected hotel index.
            const idx = this.selectHotel.selectedIndex;


            // Stop if no hotel is selected.
            if (idx < 0) {
                return;
            }


            // Retrieve the selected hotel object.
            const hotel = this.allHotels[idx];


            // Stop if the hotel doesn't exist.
            if (!hotel) {
                return;
            }


            // ==================================
            // FIND THE LAST DESTINATION
            // ==================================

            // Arrays use zero-based indexes.
            //
            // The final item is at length - 1.
            //
            // This finds the most recently added
            // destination in the itinerary.
            const lastDest =
                this.trip.listOfDestinations[
                    this.trip.listOfDestinations.length - 1
                ];


            // Prevent users from adding a hotel
            // before adding a destination.
            if (!lastDest) {

                alert("Add a destination first!");

                return;
            }


            // Assign the selected hotel name
            // to the most recent destination.
            lastDest.hotel = hotel.name;


            // Refresh the itinerary display.
            this.renderDestinationsContainer();

        });


        // ======================================
        // SAVE TRIP BUTTON
        // ======================================

        this.btnSave.addEventListener('click', () => {

            // Read the trip name from the input.
            //
            // trim() removes whitespace from
            // the beginning and end of the string.
            const tripName =
                this.inpDestinationName.value.trim();


            // Check whether the trip name is empty.
            if (!tripName) {

                alert(
                    "Please enter a trip name before saving."
                );

                return;
            }


            // Update the current trip's name.
            this.trip.name = tripName;


            // Calculate the trip statistics.
            this.calculateTripSummary();


            // Save or update the trip using TripModel.
            TripModel.Update(this.trip);


            // Redirect the user to All My Trips.
            window.location = '/views/allMyTrips.html';

        });


        // ======================================
        // SEND TO LEADERBOARD BUTTON
        // ======================================

        this.btnPost.addEventListener('click', () => {

            // Read and trim the trip name.
            const tripName =
                this.inpDestinationName.value.trim();


            // Prevent submission without a name.
            if (!tripName) {

                alert(
                    "Please enter a trip name before posting to the leaderboard."
                );

                return;
            }


            // Update the trip name.
            this.trip.name = tripName;


            // Calculate the trip statistics.
            this.calculateTripSummary();


            // Save the trip locally before posting.
            TripModel.Update(this.trip);


            // ==================================
            // CHECK IF TRIP WAS ALREADY POSTED
            // ==================================

            // The ! operator means NOT.
            //
            // If idOnServer is false or missing,
            // the trip has not been marked as posted.
            if (!this.trip.idOnServer) {


                // ==================================
                // PREPARE DATA FOR THE SERVER
                // ==================================

                // Create the object that will
                // be converted into JSON.
                const postData = {

                    // Unique trip ID.
                    id: this.trip.id,

                    // Trip name.
                    name: this.trip.name,

                    // Number of hotels selected.
                    numberOfHotels: this.trip.numberOfHotels,

                    // Total nights stayed.
                    nightsStayed: this.trip.nightsStayed,

                    // Total flight distance.
                    distanceTravelled: this.trip.distanceTravelled,

                    // Calculated trip cost.
                    totalCost: this.trip.totalCost,


                    // map() creates a new array containing
                    // the destination details needed
                    // by the server leaderboard.
                    listOfDestinations:
                        this.trip.listOfDestinations.map(d => ({

                            name: d.name,
                            from: d.from,
                            to: d.to,
                            distance_km: d.distance_km,
                            hotel: d.hotel,
                            nights: d.nights

                        }))
                };


                // ==================================
                // SEND HTTP POST REQUEST
                // ==================================

                // fetch() sends the trip data
                // to the Express backend.
                fetch('/api/NewTrip', {

                    // POST is used to create a resource.
                    method: 'POST',

                    // Tell the server the body contains JSON.
                    headers: {
                        'Content-Type': 'application/json'
                    },

                    // JSON.stringify() converts
                    // the JavaScript object into
                    // a JSON string for transmission.
                    body: JSON.stringify(postData)

                })

                // Convert the response into JavaScript data.
                .then(res => res.json())


                // ==================================
                // HANDLE SERVER RESPONSE
                // ==================================

                .then(data => {

                    // Check whether the server
                    // confirmed a successful submission.
                    if (data.message === "success") {

                        // Mark the trip as posted
                        // to prevent duplicate submissions.
                        this.trip.idOnServer = true;

                        this.trip.postedToLeaderboard = true;


                        // Save the updated status locally.
                        TripModel.Update(this.trip);


                        // Redirect to the leaderboard.
                        //
                        // replace() replaces the current
                        // browser history entry.
                        window.location.replace(
                            '/features/publicLeaderboard'
                        );

                    } else {

                        // Display the server's error message.
                        alert(
                            data.message || "Failed to post trip"
                        );
                    }
                })


                // ==================================
                // HANDLE POST REQUEST ERRORS
                // ==================================

                .catch(err => {

                    // Log the error for debugging.
                    console.error(
                        "Error posting trip:",
                        err
                    );

                    // Inform the user of the failure.
                    alert("Failed to post trip");

                });


            } else {

                // ==================================
                // TRIP ALREADY POSTED
                // ==================================

                // Prevent another submission
                // when the trip is marked as posted.
                alert("Trip already posted!");


                // Redirect to the leaderboard.
                window.location.href =
                    '/features/publicLeaderboard';
            }

        });
    }


    // ==========================================
    // RENDER THE ITINERARY
    // ==========================================

    static renderDestinationsContainer() {

        // Clear the current itinerary display.
        //
        // This prevents duplicate cards when
        // destinations are added or removed.
        this.divDestinationsContainer.innerHTML = "";


        // forEach() loops through every destination
        // currently added to the trip.
        this.trip.listOfDestinations.forEach(dest => {

            // Create a container for the destination.
            const div = document.createElement('div');


            // ==================================
            // FIND THE SELECTED HOTEL
            // ==================================

            // find() searches the hotel array.
            //
            // It returns the first hotel whose
            // name matches dest.hotel.
            const hotel = this.allHotels.find(
                h => h.name === dest.hotel
            );


            // Get the nightly hotel price.
            //
            // If no hotel is selected, use zero.
            const pricePerNight = hotel
                ? hotel.price_per_night
                : 0;


            // Use the destination's nights value.
            //
            // If missing or falsy, default to one.
            const nights = dest.nights || 1;


            // Calculate accommodation cost.
            //
            // Example:
            // $120 per night × 3 nights = $360
            const cost = pricePerNight * nights;


            // ==================================
            // DISPLAY DESTINATION DETAILS
            // ==================================

            // innerHTML inserts HTML markup
            // into the destination container.
            //
            // Template literals allow values
            // to be inserted using ${variable}.
            div.innerHTML = `
                <h3>${dest.name}</h3>
                <p>From: ${dest.from}</p>
                <p>To: ${dest.to}</p>
                <p>Distance: ${dest.distance_km} km</p>
                <p>Hotel: ${dest.hotel || "None"} | Price per night: $${pricePerNight}</p>
                <p>Total for ${nights} night(s): $${cost}</p>
            `;


            // ==================================
            // CREATE NIGHTS DROPDOWN
            // ==================================

            // Create a select element.
            const select = document.createElement('select');


            // A for loop repeats a block of code
            // while a condition is true.
            //
            // Start at 1 night.
            // Continue until 20 nights.
            // Increase i by 1 after each iteration.
            for (let i = 1; i <= 20; i++) {

                // Create an option for each number.
                const opt = document.createElement('option');

                // Set the option value.
                opt.value = i;

                // Set the visible option text.
                opt.textContent = i;


                // Select the option matching
                // the destination's current nights.
                if (i === nights) {
                    opt.selected = true;
                }


                // Add the option to the dropdown.
                select.appendChild(opt);
            }


            // ==================================
            // HANDLE NIGHTS CHANGES
            // ==================================

            // The change event runs when the user
            // selects a different number of nights.
            select.addEventListener('change', () => {

                // parseInt() converts the selected
                // value from a string into an integer.
                dest.nights = parseInt(select.value);


                // Refresh the itinerary so the
                // accommodation cost updates.
                this.renderDestinationsContainer();

            });


            // Add the dropdown to the destination card.
            div.appendChild(select);


            // ==================================
            // DELETE DESTINATION BUTTON
            // ==================================

            // Create a button using an input element.
            const delBtn = document.createElement('input');

            // Set the input type to button.
            delBtn.type = 'button';

            // Set the button's visible text.
            delBtn.value = 'Delete';


            // Add a click event listener.
            delBtn.addEventListener('click', () => {

                // RemoveDestination() removes
                // the destination matching its ID.
                this.trip.RemoveDestination(dest.id);


                // Save the updated trip locally.
                TripModel.Update(this.trip);


                // Refresh the itinerary display.
                this.renderDestinationsContainer();

            });


            // Add the Delete button to the card.
            div.appendChild(delBtn);


            // Add the completed destination card
            // to the itinerary container.
            this.divDestinationsContainer.appendChild(div);

        });
    }


    // ==========================================
    // CALCULATE TRIP SUMMARY
    // ==========================================

    static calculateTripSummary() {

        // ======================================
        // COUNT HOTELS
        // ======================================

        // filter() creates a new array containing
        // only destinations with selected hotels.
        //
        // .length counts the matching destinations.
        this.trip.numberOfHotels =
            this.trip.listOfDestinations.filter(
                d => d.hotel
            ).length;


        // ======================================
        // CALCULATE TOTAL NIGHTS
        // ======================================

        // reduce() combines array values into
        // one accumulated result.
        //
        // sum is the running total.
        // d represents the current destination.
        //
        // The initial value is zero.
        this.trip.nightsStayed =
            this.trip.listOfDestinations.reduce(
                (sum, d) => sum + (d.nights || 1),
                0
            );


        // ======================================
        // CALCULATE TOTAL DISTANCE
        // ======================================

        // Add together the distances
        // of every destination in the trip.
        this.trip.distanceTravelled =
            this.trip.listOfDestinations.reduce(
                (sum, d) => sum + (d.distance_km || 0),
                0
            );


        // ======================================
        // CALCULATE TOTAL HOTEL COST
        // ======================================

        // reduce() loops through the destinations
        // and accumulates their accommodation costs.
        this.trip.totalCost =
            this.trip.listOfDestinations.reduce(

                (sum, d) => {

                    // Find the hotel selected
                    // for the current destination.
                    const hotel = this.allHotels.find(
                        h => h.name === d.hotel
                    );


                    // If a hotel exists:
                    // Multiply its nightly price
                    // by the number of nights.
                    //
                    // Otherwise:
                    // Add zero to the total.
                    return sum + (
                        hotel
                            ? hotel.price_per_night * (d.nights || 1)
                            : 0
                    );

                },

                // Initial accumulator value.
                0
            );
    }
}
