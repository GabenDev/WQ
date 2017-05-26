export class Item {
    _id : string;
    name: string;
    price : Number;
    description : String;
    currency : any;
    language : any;
    order : Number;
    category : any;
    orders : number;
    readyDate : Date;

    constructor() {
      this.orders = 0;
    }
};
