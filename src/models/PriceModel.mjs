export class PriceModel{
    static data = {cost_per_km: 0.11, co2_per_km_kg: 0.255}


    /**
     * A simple way to send a couple of peices of data as an object
     * @returns {{number,number}}
     */
    static GetAll(){
        return data
    }
}
