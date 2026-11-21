import { StayModel } from "./StayModel.mjs"


export class HotelModel {
    /**
     * Static dataset of hotel options grouped by country.
     * @type {{ country: string, hotels: StayModel[] }[]}
     */
    static hotelData = [
        {
            country: "Australia",
            hotels: [
                { name: "Koala Rest Inn", price_per_night: 55 },
                { name: "Harbour View Hotel", price_per_night: 140 },
                { name: "Eucalyptus Grand Resort", price_per_night: 390 }
            ]
        },
        {
            country: "Japan",
            hotels: [
                { name: "Sakura Capsule Hotel", price_per_night: 35 },
                { name: "Kyoto Central Stay", price_per_night: 120 },
                { name: "Mount Fuji Imperial Suites", price_per_night: 450 }
            ]
        },
        {
            country: "China",
            hotels: [
                { name: "Panda Backpacker Lodge", price_per_night: 30 },
                { name: "Dragon Pearl Hotel", price_per_night: 100 },
                { name: "Great Wall Palace", price_per_night: 380 }
            ]
        },
        {
            country: "Canada",
            hotels: [
                { name: "Maple Leaf Inn", price_per_night: 45 },
                { name: "Toronto City Lodge", price_per_night: 130 },
                { name: "Rocky Mountain Royal Hotel", price_per_night: 420 }
            ]
        },
        {
            country: "England",
            hotels: [
                { name: "Ye Olde Budget Rooms", price_per_night: 50 },
                { name: "London Bridge Hotel", price_per_night: 150 },
                { name: "Royal Crown Manor", price_per_night: 470 }
            ]
        },
        {
            country: "India",
            hotels: [
                { name: "Spice Route Hostel", price_per_night: 20 },
                { name: "Lotus Garden Hotel", price_per_night: 90 },
                { name: "Taj Serenity Palace", price_per_night: 360 }
            ]
        }
    ]

    /**
     * Create a new HotelModel for a specific country.
     * @param {string} country - Country name.
     * @param {StayModel[]} hotels - List of hotels in the country.
     */
    constructor(country, hotels) {
        this.country = country
        this.hotels = hotels
    }

    /**
     * Static block: converts raw `hotelData` entries into `HotelModel` instances
     * with nested `StayModel` objects.
     */
    static {
        this.hotelData = this.hotelData.map(
            h => new HotelModel(
                h.country,
                h.hotels.map(s => new StayModel(s.name, s.price_per_night))
            )
        )
    }

    /**
     * Returns a copy of all hotel data.
     * @returns {HotelModel[]} List of all countries with their hotels.
     */
    static GetAll() {
        return [...this.hotelData]
    }

    /**
     * Find the price per night of a hotel by its name.
     * Searches through all countries and hotels.
     *
     * @param {string} name - Hotel name to search for.
     * @returns {number|null} Price per night, or `null` if not found.
     */
    static FindPriceByName(name) {
        for (const country of this.hotelData) {
            const found = country.hotels.find(h => h.name === name)
            if (found) {
                return found.price_per_night
            }
        }
        return null
    }
}
