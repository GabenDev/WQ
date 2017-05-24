/**
 * Created by gaben on 2017.05.23..
 */
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MenuItemSchema   = new Schema({
    name: String,
    price : Number,
    description : String,
    currency : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Currency'
    },
    language : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country'
    },
    order : Number,
    category : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
});

MenuItemSchema.methods.from = function(req : any, category : any) {
    this.name = req.name;
    this.price = req.price;
    this.description = req.description;
    this.currency = req.currency;
    this.language = req.language;
    this.order = req.order;
    this.category = category;
    return this;
};

module.exports = mongoose.model('MenuItem', MenuItemSchema);
