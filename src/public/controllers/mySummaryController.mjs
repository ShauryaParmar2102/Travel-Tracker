
/*
    ==========================================
    TRAVEL TRACKER - MY SUMMARY CONTROLLER
    ==========================================

    Purpose:
    This controller displays a summary of a
    trip that the user has previously saved.

    It handles:
    1. Finding the selected trip by its ID.
    2. Fetching hotel prices from the backend.
    3. Displaying the trip name and itinerary.
    4. Calculating the number of hotels.
    5. Calculating total nights stayed.
    6. Calculating total distance travelled.
    7. Calculating hotel and flight costs.
    8. Calculating estimated CO2 emissions.
*/

// Import the TripModel class.
//
// TripModel manages the trips saved locally
// in the user's browser.
import { TripModel } from "../models/TripModel.mjs";


// Create a controller class to manage
// the Trip Summary page.
export class MySummaryController {

    // ==========================================
    // GET THE SELECTED TRIP
    // ==========================================

    // URLSearchParams reads information from
    // the query string in the current URL.
    //
    // Example:
    // mySummary.html?id=12345
    //
    // .get("id") retrieves the value "12345".
    static id = new URLSearchParams(
        window.location.search
    ).get("id");


    // FindById() searches for the trip
    // matching the ID retrieved from the URL.
    //
    // The selected trip is stored in
    // the static "trip" property.
    static trip = TripModel.FindById(MySummaryController.id);


    // ==========================================
    // GET HTML ELEMENTS
    // ==========================================

    // document.getElementById() finds an HTML
    // element using its unique ID.
    //
    // These properties allow JavaScript to
    // update the page dynamically.

    // Element displaying the trip name.
    static TripName = document.getElementById("TripName");

    // Element displaying the number of hotels.
    static numberOfHotels =
        document.getElementById("numberOfHotels");

    // Element displaying the total nights.
    static totalNights =
        document.getElementById("totalNights");

    // Element displaying the distance travelled.
    static totalDistance =
        document.getElementById("totalDistance");

    // Element displaying the total trip cost.
    static totalCost =
        document.getElementById("totalCost");

    // Container where the destination cards
    // will be inserted dynamically.
    static DestinationsContainer =
        document.getElementById("DestinationsContainer");


    // ==========================================
    // HOTEL DATA
    // ==========================================

    // This array stores hotel information
    // retrieved from the backend API.
    //
    // Initially, the array is empty.
    static allHotels = [];


    // ==========================================
    // INITIALIZE THE SUMMARY PAGE
    // ==========================================

    // The async keyword allows this method
    // to use await when fetching data.
    static async Initialize() {

        // Check whether the selected trip exists.
        //
        // The ! operator means "NOT".
        // If no trip was found, stop the method.
        if (!this.trip) {

            console.error("Trip not found!");

            return;
        }

        // try...catch handles errors that
        // might occur when requesting data.
        try {

            // ==================================
            // FETCH HOTEL DATA
            // ==================================

            // fetch() sends an HTTP GET request
            // to the backend API endpoint.
            //
            // await pauses this async method
            // until the response is received.
            const response = await fetch(
                "/api/getAllHotelData"
            );


            // response.ok is true when the
            // HTTP response indicates success.
            //
            // If the request fails, throw an error.
            if (!response.ok) {

                throw new Error(
                    "Failed to load hotel data"
                );
            }


            // Convert the JSON response into
            // a JavaScript object or array.
            const hotelGroups = await response.json();


            // ==================================
            // CONVERT HOTEL DATA INTO ONE ARRAY
            // ==================================

            // The backend groups hotels by country.
            //
            // flatMap() loops through each country,
            // creates an array of its hotels and
            // combines all those arrays into one.
            //
            // Example result:
            //
            // [
            //   {
            //     name: "Example Hotel",
            //     country: "Japan",
            //     price_per_night: 100
            //   }
            // ]

            this.allHotels = hotelGroups.flatMap(country =>

                // map() transforms each hotel into
                // an object containing the fields
                // needed for the trip summary.
                country.hotels.map(hotel => ({

                    // Name of the hotel.
                    name: hotel.name,

                    // Country where the hotel is located.
                    country: country.country,

                    // Cost of staying one night.
                    price_per_night: hotel.price_per_night

                }))
            );


            // Hotel data has loaded successfully.
            //
            // RenderPage() can now calculate costs
            // and display the trip information.
            this.RenderPage();


        } catch (error) {

            // ==================================
            // HANDLE FETCH ERRORS
            // ==================================

            // Display the error in the browser console.
            console.error(
                "Error loading hotel data:",
                error
            );

            // Show a user-friendly error message.
            this.DestinationsContainer.textContent =
                "Unable to load hotel prices. Please try again.";
        }
    }


    // ==========================================
    // RENDER THE TRIP SUMMARY
    // ==========================================

    static RenderPage() {

        // Display the selected trip's name.
        //
        // textContent updates the text inside
        // an HTML element.
        this.TripName.textContent = this.trip.name;


        // ======================================
        // COUNT THE NUMBER OF HOTELS
        // ======================================

        // filter() creates a new array containing
        // only destinations that have a hotel.
        //
        // d represents the current destination.
        //
        // d.hotel checks whether a hotel exists.
        //
        // .length counts the matching destinations.
        this.numberOfHotels.textContent =
            `Number of hotels: ${
                this.trip.listOfDestinations.filter(
                    d => d.hotel
                ).length
            }`;


        // ======================================
        // INITIALIZE TOTALS
        // ======================================

        // These variables will accumulate totals
        // while looping through the destinations.

        // Total accommodation cost.
        let totalHotelCost = 0;

        // Total number of nights.
        let totalNights = 0;

        // Total distance in kilometres.
        let totalDistance = 0;


        // ======================================
        // CLEAR EXISTING DESTINATION CARDS
        // ======================================

        // Remove any previously rendered content.
        //
        // This prevents duplicate destination cards
        // if RenderPage() runs more than once.
        this.DestinationsContainer.innerHTML = "";


        // ======================================
        // LOOP THROUGH TRIP DESTINATIONS
        // ======================================

        // forEach() executes the callback once
        // for every destination in the array.
        //
        // dest represents the current destination.
        this.trip.listOfDestinations.forEach(dest => {

            // ==================================
            // GET DESTINATION INFORMATION
            // ==================================

            // Use the selected hotel name.
            //
            // If no hotel is selected,
            // display "None" instead.
            const hotelName = dest.hotel || "None";


            // Convert the nights value to a number.
            //
            // Number() converts values such as
            // "4" from a string into the number 4.
            //
            // || 1 provides a default of one night
            // if the value is missing or falsy.
            const nights = Number(dest.nights) || 1;


            // Convert the distance to a number.
            //
            // If no valid numeric value exists,
            // use zero as the fallback.
            const distance =
                Number(dest.distance_km) || 0;


            // ==================================
            // UPDATE TRIP TOTALS
            // ==================================

            // Add the destination's nights
            // to the running total.
            totalNights += nights;

            // Add the flight distance
            // to the running total.
            totalDistance += distance;


            // ==================================
            // FIND THE SELECTED HOTEL
            // ==================================

            // find() searches the allHotels array.
            //
            // It returns the first hotel whose
            // name matches the selected hotel.
            //
            // If no match exists, it returns
            // undefined.
            const hotel = this.allHotels.find(
                h => h.name === hotelName
            );


            // Get the hotel's nightly price.
            //
            // The ternary operator works like
            // a short if...else statement.
            //
            // If hotel exists:
            //     use hotel.price_per_night
            //
            // Otherwise:
            //     use 0
            const pricePerNight = hotel
                ? hotel.price_per_night
                : 0;


            // ==================================
            // CALCULATE HOTEL COST
            // ==================================

            // Multiply the nightly price
            // by the number of nights stayed.
            //
            // Example:
            // $100 per night × 4 nights = $400
            const hotelCost =
                pricePerNight * nights;


            // Add this hotel's cost to the
            // total accommodation cost.
            totalHotelCost += hotelCost;


            // ==================================
            // CREATE DESTINATION CARD
            // ==================================

            // document.createElement() creates
            // a new HTML element using JavaScript.
            const div = document.createElement("div");


            // Assign the CSS class used to
            // style destination cards.
            div.className = "destination-item";


            // Create an h3 heading for
            // the destination name.
            const heading = document.createElement("h3");


            // Display the destination name.
            heading.textContent = dest.name;


            // ==================================
            // PREPARE DESTINATION DETAILS
            // ==================================

            // Store the information to display
            // inside an array of strings.
            //
            // Backticks (` `) create template literals.
            //
            // ${variable} inserts a JavaScript
            // value into the string.
            const details = [

                // Starting country or airport.
                `From: ${dest.from}`,

                // Destination country or airport.
                `To: ${dest.to}`,

                // Distance travelled.
                `Distance: ${distance} km`,

                // Selected accommodation.
                `Hotel: ${hotelName}`,

                // Nightly accommodation price.
                //
                // toFixed(2) formats the number
                // with two decimal places.
                `Price per night: $${pricePerNight.toFixed(2)}`,

                // Total accommodation cost
                // for this destination.
                `Total for ${nights} night(s): $${hotelCost.toFixed(2)}`
            ];


            // ==================================
            // ADD CONTENT TO DESTINATION CARD
            // ==================================

            // Add the heading to the card.
            div.appendChild(heading);


            // Loop through the details array.
            details.forEach(detail => {

                // Create a paragraph element.
                const paragraph =
                    document.createElement("p");


                // Insert the current detail.
                paragraph.textContent = detail;


                // Add the paragraph to the card.
                div.appendChild(paragraph);
            });


            // ==================================
            // DISPLAY THE COMPLETED CARD
            // ==================================

            // Append the destination card
            // to the itinerary container.
            this.DestinationsContainer.appendChild(div);

        });


        // ==========================================
        // CALCULATE FLIGHT COST
        // ==========================================

        // Estimate flight cost using a fixed rate
        // of $0.11 per kilometre per person.
        //
        // Example:
        // 1,000 km × $0.11 = $110
        const flightCostPerPerson =
            totalDistance * 0.11;


        // ==========================================
        // GET NUMBER OF TRAVELERS
        // ==========================================

        // Read the travelers property from the trip.
        //
        // Number() converts the value to a number.
        //
        // || 1 defaults to one traveler.
        //
        // Math.max(1, ...) ensures the value
        // cannot be less than one.
        const travelers = Math.max(
            1,
            Number(this.trip.travelers) || 1
        );


        // ==========================================
        // CALCULATE TOTAL COST PER PERSON
        // ==========================================

        // Divide the total hotel cost
        // by the number of travelers.
        //
        // Then add the flight cost per person.
        //
        // Formula:
        //
        // Total cost per person =
        // Flight cost per person
        // + (Hotel cost / Travelers)
        const totalCostPerPerson =
            flightCostPerPerson +
            (totalHotelCost / travelers);


        // ==========================================
        // CALCULATE ESTIMATED CO2 EMISSIONS
        // ==========================================

        // Estimate carbon dioxide emissions
        // using 0.255 kg per kilometre.
        //
        // Example:
        // 1,000 km × 0.255 = 255 kg CO2
        //
        // This is a simplified estimate,
        // not an exact flight emissions model.
        const co2PerPerson =
            totalDistance * 0.255;


        // ==========================================
        // UPDATE SUMMARY STATISTICS
        // ==========================================

        // Display the total nights stayed.
        this.totalNights.textContent =
            `Total nights stayed: ${totalNights}`;


        // Display the total distance travelled.
        this.totalDistance.textContent =
            `Total distance travelled: ${totalDistance} km`;


        // Display the estimated total cost
        // per person, formatted as currency.
        this.totalCost.textContent =
            `Total cost per person: $${totalCostPerPerson.toFixed(2)}`;


        // ==========================================
        // DEBUGGING INFORMATION
        // ==========================================

        // Log calculated values to the console.
        //
        // This helps developers verify that
        // the trip calculations are correct.
        //
        // These values are not displayed
        // directly on the webpage.
        console.log("Trip Summary:", {

            totalHotelCost,
            flightCostPerPerson,
            totalCostPerPerson,
            co2PerPerson

        });
    }
}


// ==========================================
// RUN CONTROLLER WHEN HTML IS READY
// ==========================================

// DOMContentLoaded fires when the browser
// has finished parsing the HTML document.
//
// This ensures the HTML elements exist
// before the controller tries to access them.
document.addEventListener("DOMContentLoaded", () => {

    // Start the Trip Summary controller.
    MySummaryController.Initialize();

});
