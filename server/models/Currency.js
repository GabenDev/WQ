var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CurrencySchema = new Schema({
    name: String,
    abbreviation: String,
    symbol: String
});
CurrencySchema.methods.from = function (req) {
    this.name = req.body.name;
    this.abbreviation = req.body.abbreviation;
    this.symbol = req.body.symbol;
    return this;
};
module.exports = mongoose.model('Currency', CurrencySchema);
//# sourceMappingURL=Currency.js.map