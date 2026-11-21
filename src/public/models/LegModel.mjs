export class LegModel{
    
    constructor(id, name){
        this.id = id?? crypto.randomUUID()
        this.name = name
    }
}