export class StayModel{

    /**
     * Simple model for each individual hotel
     * you shouldnt need to do anything else with this
     * 
     * @param {string} name 
     * @param {number} price_per_night 
     */
    constructor(name, price_per_night){
        this.name= name
        this.price_per_night= price_per_night
    }
}