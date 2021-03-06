import {Order} from "../../../mobile/src/domain/menu/Order";
/**
 * Created by gaben on 2017.05.23..
 */
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var OrderSchema   = new Schema({
    item : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem'
    },
    orders : Number,
    sequence : Number,
    place : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place'
    },
    orderDate : { type: Date, default: Date.now },
    status: {type: String, enum: [ 'IN_PROGRESS', 'DONE', 'CANCELLED' ], default: 'IN_PROGRESS' },
    readyDate : Date
});

OrderSchema.methods.from = function(order : Order, sequence : Number, place : String) {
    this.item = order.item._id;
    this.orders = order.item.orders;
    this.sequence = sequence;
    this.place = place;
    return this;
};

module.exports = mongoose.model('Order', OrderSchema);
