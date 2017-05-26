/**
 * Created by gaben on 2017.05.23..
 */
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var QueueSchema   = new Schema({
    place : { type : String , unique : true, required : true },
    orders : { type: Number, default: 1 }
});

QueueSchema.methods.from = function(req : any) {
    this.place = req.placeId;
    return this;
};

module.exports = mongoose.model('Queue', QueueSchema);
