
import { TripModel } from "../models/TripModel.mjs";

export class MySummaryController {
    static id = new URLSearchParams(window.location.search).get("id");
    static trip = TripModel.FindById(MySummaryController.id);

    static TripName = document.getElementById("TripName");
    static numberOfHotels = document.getElementById("numberOfHotels");
    static totalNights = document.getElementById("totalNights");
    static totalDistance = document.getElementById("totalDistance");
    static totalCost = document.getElementById("totalCost");
    static DestinationsContainer =
        document.getElementById("DestinationsContainer");

    static allHotels = [];

    static async Initialize() {
        if (!this.trip) {
            console.error("Trip not found!");
            return;
        }

        try {
            // Load hotel data from the backend
            const response = await fetch("/api/getAllHotelData");

            if (!response.ok) {
                throw new Error("Failed to load hotel data");
            }

            const hotelGroups = await response.json();

            // Convert grouped hotels into one array
            this.allHotels = hotelGroups.flatMap(country =>
                country.hotels.map(hotel => ({
                    name: hotel.name,
                    country: country.country,
                    price_per_night: hotel.price_per_night
                }))
            );

            this.RenderPage();

        } catch (error) {
            console.error("Error loading hotel data:", error);
            this.DestinationsContainer.textContent =
                "Unable to load hotel prices. Please try again.";
        }
    }

    static RenderPage() {
        this.TripName.textContent = this.trip.name;

        this.numberOfHotels.textContent =
            `Number of hotels: ${
                this.trip.listOfDestinations.filter(d => d.hotel).length
            }`;

        let totalHotelCost = 0;
        let totalNights = 0;
        let totalDistance = 0;

        this.DestinationsContainer.innerHTML = "";

        this.trip.listOfDestinations.forEach(dest => {
            const hotelName = dest.hotel || "None";
            const nights = Number(dest.nights) || 1;
            const distance = Number(dest.distance_km) || 0;

            totalNights += nights;
            totalDistance += distance;

            // Find the selected hotel in the backend data
            const hotel = this.allHotels.find(
                h => h.name === hotelName
            );

            const pricePerNight = hotel
                ? hotel.price_per_night
                : 0;

            const hotelCost = pricePerNight * nights;
            totalHotelCost += hotelCost;

            // Create a card for each destination
            const div = document.createElement("div");
            div.className = "destination-item";

            const heading = document.createElement("h3");
            heading.textContent = dest.name;

            const details = [
                `From: ${dest.from}`,
                `To: ${dest.to}`,
                `Distance: ${distance} km`,
                `Hotel: ${hotelName}`,
                `Price per night: $${pricePerNight.toFixed(2)}`,
                `Total for ${nights} night(s): $${hotelCost.toFixed(2)}`
            ];

            div.appendChild(heading);

            details.forEach(detail => {
                const paragraph = document.createElement("p");
                paragraph.textContent = detail;
                div.appendChild(paragraph);
            });

            this.DestinationsContainer.appendChild(div);
        });

        // Flight cost: $0.11 per kilometre per person
        const flightCostPerPerson = totalDistance * 0.11;

        // Assume one traveler until the traveler field is connected
        const travelers = Math.max(1, Number(this.trip.travelers) || 1);

        // Split hotel cost between travelers
        const totalCostPerPerson =
            flightCostPerPerson + (totalHotelCost / travelers);

        const co2PerPerson = totalDistance * 0.255;

        this.totalNights.textContent =
            `Total nights stayed: ${totalNights}`;

        this.totalDistance.textContent =
            `Total distance travelled: ${totalDistance} km`;

        this.totalCost.textContent =
            `Total cost per person: $${totalCostPerPerson.toFixed(2)}`;

        console.log("Trip Summary:", {
            totalHotelCost,
            flightCostPerPerson,
            totalCostPerPerson,
            co2PerPerson
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    MySummaryController.Initialize();
});
