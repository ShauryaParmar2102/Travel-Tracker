/**
 * Destination model for storing distances between two locations, including a hotel.
 */
export class DestinationsModel {
    static destinationData = [
    // Australia 
    { from: "Australia", to: "Japan", distance_km: 6821, hotel: "Koala Rest Inn" },
    { from: "Australia", to: "China", distance_km: 7448, hotel: "Harbour View Hotel" },
    { from: "Australia", to: "Canada", distance_km: 14144, hotel: "Maple Leaf Inn" },
    { from: "Australia", to: "England", distance_km: 15201, hotel: "London Bridge Hotel" },
    { from: "Australia", to: "India", distance_km: 7802, hotel: "Taj Serenity Palace" },

    // Japan
    { from: "Japan", to: "Australia", distance_km: 6821, hotel: "Sakura Capsule Hotel" },
    { from: "Japan", to: "China", distance_km: 3054, hotel: "Sakura Capsule Hotel" },
    { from: "Japan", to: "Canada", distance_km: 8103, hotel: "Kyoto Central Stay" },
    { from: "Japan", to: "England", distance_km: 9224, hotel: "Mount Fuji Imperial Suites" },
    { from: "Japan", to: "India", distance_km: 5968, hotel: "Lotus Garden Hotel" },

    // China 
    { from: "China", to: "Australia", distance_km: 7448, hotel: "Dragon Pearl Hotel" },
    { from: "China", to: "Japan", distance_km: 3054, hotel: "Dragon Pearl Hotel" },
    { from: "China", to: "Canada", distance_km: 9410, hotel: "Dragon Pearl Hotel" },
    { from: "China", to: "England", distance_km: 7799, hotel: "Great Wall Palace" },
    { from: "China", to: "India", distance_km: 2984, hotel: "Spice Route Hostel" },

    // Canada 
    { from: "Canada", to: "Australia", distance_km: 14144, hotel: "Rocky Mountain Royal Hotel" },
    { from: "Canada", to: "Japan", distance_km: 8103, hotel: "Rocky Mountain Royal Hotel" },
    { from: "Canada", to: "China", distance_km: 9410, hotel: "Toronto City Lodge" },
    { from: "Canada", to: "England", distance_km: 5710, hotel: "Toronto City Lodge" },
    { from: "Canada", to: "India", distance_km: 11488, hotel: "Rocky Mountain Royal Hotel" },

    // England 
    { from: "England", to: "Australia", distance_km: 15201, hotel: "Royal Crown Manor" },
    { from: "England", to: "Japan", distance_km: 9224, hotel: "Royal Crown Manor" },
    { from: "England", to: "China", distance_km: 7799, hotel: "Royal Crown Manor" },
    { from: "England", to: "Canada", distance_km: 5710, hotel: "Royal Crown Manor" },
    { from: "England", to: "India", distance_km: 7672, hotel: "Royal Crown Manor" },

    // India
    { from: "India", to: "Australia", distance_km: 7802, hotel: "Taj Serenity Palace" },
    { from: "India", to: "Japan", distance_km: 5968, hotel: "Lotus Garden Hotel" },
    { from: "India", to: "China", distance_km: 2984, hotel: "Spice Route Hostel" },
    { from: "India", to: "Canada", distance_km: 11488, hotel: "Taj Serenity Palace" },
    { from: "India", to: "England", distance_km: 7672, hotel: "Taj Serenity Palace" }
];

    constructor(from, to, distance_km, hotel) {
        this.from = from;
        this.to = to;
        this.distance_km = distance_km;
        this.hotel = hotel; // new property
    }

    static {
        this.destinationData = this.destinationData.map(d => new DestinationsModel(d.from, d.to, d.distance_km, d.hotel));
    }

    static GetAll() {
        return [...this.destinationData];
    }
}
