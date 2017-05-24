var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CountrySchema = new Schema({
    name: String,
    abbreviation: String,
    countryCode: String,
    currency: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Currency'
    }
});
CountrySchema.methods.from = function (req) {
    this.name = req.body.name;
    this.abbreviation = req.body.abbreviation;
    this.currency = req.body.currency;
    this.countryCode = req.body.countryCode;
    return this;
};
module.exports = mongoose.model('Country', CountrySchema);
//# sourceMappingURL=Country.js.map