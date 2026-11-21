// controllers/newEditController.mjs
import { TripModel } from "../models/TripModel.mjs";

export class NewEditController {
    static allDestinations = [];
    static allHotels = [];
    static trip = null;
    static id = new URLSearchParams(window.location.search).get('id') ?? null;

    // DOM elements
    static inpDestinationName = document.getElementById('inpDestinationName');
    static selectDestination = document.getElementById('SelectDestinationBox');
    static btnAddDestination = document.getElementById('btnAddDestination');
    static selectHotel = document.getElementById('SelectHotelBox');
    static btnAddHotel = document.getElementById('btnAddHotel');
    static divDestinationsContainer = document.getElementById('divDestinationsContainer');
    static btnSave = document.getElementById('btnSave');
    static btnPost = document.getElementById('btnPost');

    static {
    // Initialize trip
    this.trip = this.id 
        ? TripModel.FindById(this.id) 
        : new TripModel(null, "");

    if (!this.trip.listOfDestinations) {
        this.trip.listOfDestinations = [];
    }

    // Fetch destinations and hotels from backend
    Promise.all([
        fetch('/api/getAllDestinationData').then(res => res.json()),
        fetch('/api/getAllHotelData').then(res => res.json())
    ])
    .then(([destinations, hotels]) => {

        // Store destinations
        this.allDestinations = destinations;

        // Convert grouped hotel data into flat array
        this.allHotels = hotels.flatMap(country =>
            country.hotels.map(hotel => ({
                name: hotel.name,
                country: country.country,
                price_per_night: hotel.price_per_night
            }))
        );

        // Render page after data is loaded
        this.RenderPage();

    })
    .catch(error => {
        console.error("Error loading travel data:", error);
    });
}

    static RenderPage() {

          // Show existing trip name (if editing)
    this.inpDestinationName.value = this.trip.name || "";

    
        this.populateDestinationDropdown();
        this.populateHotelDropdown();
        this.renderDestinationsContainer();
        this.setupEventListeners();
    }
//Loops through all destinations from the server and fills the “Add Destination” dropdown with every available route.
    static populateDestinationDropdown() {
        this.selectDestination.innerHTML = "";

        //ForEach Loop - Loops through all destinations fetched from the server.
        this.allDestinations.forEach(dest => {
            const opt = document.createElement('option');
            opt.value = `${dest.from}|${dest.to}|${dest.distance_km}`;
            opt.textContent = `${dest.from} → ${dest.to} | Distance: ${dest.distance_km} km`;
            this.selectDestination.appendChild(opt);
        });
    }

    static populateHotelDropdown() {
        this.selectHotel.innerHTML = "";

            //ForEach Loop - Loops through all available hotels

            //Adds each hotel to the hotel dropdown so the user can select it for a destination.
        this.allHotels.forEach(hotel => {
            const opt = document.createElement('option');
            opt.value = hotel.name;
            opt.textContent = `${hotel.name} – ${hotel.country} ($${hotel.price_per_night}/night)`;
            this.selectHotel.appendChild(opt);
        });
    }

    static setupEventListeners() {
        // Add destination
        this.btnAddDestination.addEventListener('click', () => {
            const idx = this.selectDestination.selectedIndex;
            if (idx < 0) return;
            const dest = this.allDestinations[idx];
            this.trip.AddNewDestination({
                id: crypto.randomUUID(),
                name: `${dest.from} → ${dest.to}`,
                from: dest.from,
                to: dest.to,
                distance_km: dest.distance_km,
                hotel: null,
                nights: 1
            });
            this.renderDestinationsContainer();
        });

        // Add hotel to last destination
        this.btnAddHotel.addEventListener('click', () => {
            const idx = this.selectHotel.selectedIndex;
            if (idx < 0) return;
            const hotel = this.allHotels[idx];
            if (!hotel) return;

            const lastDest = this.trip.listOfDestinations[this.trip.listOfDestinations.length - 1];
            if (!lastDest) {
                alert("Add a destination first!");
                return;
            }

            lastDest.hotel = hotel.name;
            this.renderDestinationsContainer();
        });

        // Saves trip to All my Trips Page
        this.btnSave.addEventListener('click', () => {
            const tripName = this.inpDestinationName.value.trim();
            if (!tripName) {
                alert("Please enter a trip name before saving.");
                return;
            }
            this.trip.name = tripName;
            this.calculateTripSummary();
            TripModel.Update(this.trip);
            window.location = '/views/allMyTrips.html';
        });

        // Posts trip to public leaderboard
        this.btnPost.addEventListener('click', () => {
            const tripName = this.inpDestinationName.value.trim();
            if (!tripName) {
                alert("Please enter a trip name before posting to the leaderboard.");
                return;
            }
            this.trip.name = tripName;
            this.calculateTripSummary();
            TripModel.Update(this.trip);

            if (!this.trip.idOnServer) {
                const postData = {
                    id: this.trip.id,
                    name: this.trip.name,
                    numberOfHotels: this.trip.numberOfHotels,
                    nightsStayed: this.trip.nightsStayed,
                    distanceTravelled: this.trip.distanceTravelled,
                    totalCost: this.trip.totalCost,
                    listOfDestinations: this.trip.listOfDestinations.map(d => ({
                        name: d.name,
                        from: d.from,
                        to: d.to,
                        distance_km: d.distance_km,
                        hotel: d.hotel,
                        nights: d.nights
                    }))
                };

                fetch('/api/NewTrip', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(postData)
                })
                .then(res => res.json())
                
.then(data => {
    if (data.message === "success") {
        this.trip.idOnServer = true;
        this.trip.postedToLeaderboard = true;

        TripModel.Update(this.trip);

        // Redirect immediately after a successful POST
        window.location.replace('/features/publicLeaderboard');
    } else {
        alert(data.message || "Failed to post trip");
    }
})

                .catch(err => {
                    console.error("Error posting trip:", err);
                    alert("Failed to post trip");
                });
            } else {
                alert("Trip already posted!");
                window.location.href = '/features/publicLeaderboard';
            }
        });
    }

    static renderDestinationsContainer() {
        this.divDestinationsContainer.innerHTML = "";


    //ForEach Loop - Loops through destinations added to a trip
        this.trip.listOfDestinations.forEach(dest => {
            const div = document.createElement('div');
            const hotel = this.allHotels.find(h => h.name === dest.hotel);
            const pricePerNight = hotel ? hotel.price_per_night : 0;
            const nights = dest.nights || 1;
            const cost = pricePerNight * nights;

            div.innerHTML = `
                <h3>${dest.name}</h3>
                <p>From: ${dest.from}</p>
                <p>To: ${dest.to}</p>
                <p>Distance: ${dest.distance_km} km</p>
                <p>Hotel: ${dest.hotel || "None"} | Price per night: $${pricePerNight}</p>
                <p>Total for ${nights} night(s): $${cost}</p>
            `;

        // ForLoop - Generates the number-of-nights dropdown for each destination.
            const select = document.createElement('select');
            for (let i = 1; i <= 20; i++) {
                const opt = document.createElement('option');
                opt.value = i;
                opt.textContent = i;
                if (i === nights) opt.selected = true;
                select.appendChild(opt);
            }
            select.addEventListener('change', () => {
                dest.nights = parseInt(select.value);
                this.renderDestinationsContainer();
            });
            div.appendChild(select);

            // Delete button
            const delBtn = document.createElement('input');
            delBtn.type = 'button';
            delBtn.value = 'Delete';
            delBtn.addEventListener('click', () => {
                this.trip.RemoveDestination(dest.id);
                TripModel.Update(this.trip);
                this.renderDestinationsContainer();
            });
            div.appendChild(delBtn);

            this.divDestinationsContainer.appendChild(div);
        });
    }

    // Static class method - Calculates trip totals
    static calculateTripSummary() {
        // Filter Function - keeps only destinations that have a hotel selected
        this.trip.numberOfHotels = this.trip.listOfDestinations.filter(d => d.hotel).length;

        this.trip.nightsStayed = this.trip.listOfDestinations.reduce((sum, d) => sum + (d.nights || 1), 0);
        this.trip.distanceTravelled = this.trip.listOfDestinations.reduce((sum, d) => sum + (d.distance_km || 0), 0);
        this.trip.totalCost = this.trip.listOfDestinations.reduce((sum, d) => {
            const hotel = this.allHotels.find(h => h.name === d.hotel);
            return sum + (hotel ? hotel.price_per_night * (d.nights || 1) : 0);
        }, 0);
    }
}
