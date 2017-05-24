var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PlaceSchema = new Schema({
    name: String,
    placeType: { type: String, enum: ['DEFAULT', 'PUB', 'RESTAURANT'], default: 'DEFAULT' },
    address: String,
    email: String,
    phone: String,
    coordinate: {
        longitude: Number,
        latitude: Number
    },
    devices: [{
            deviceId: String
        }],
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country'
    },
    supportedCurrencies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Currency'
        }
    ]
});
PlaceSchema.methods.from = function (req) {
    this.id = req.body.id;
    this.name = req.body.name;
    if (req.body.placeType) {
        this.placeType = req.body.placeType;
    }
    this.address = req.body.address;
    this.email = req.body.email;
    this.phone = req.body.phone;
    this.coordinate = req.body.coordinate;
    this.devices = req.body.devices;
    this.country = req.body.country;
    this.supportedCurrencies = req.body.supportedCurrencies;
    return this;
};
module.exports = mongoose.model('Place', PlaceSchema);
//# sourceMappingURL=Place.js.map