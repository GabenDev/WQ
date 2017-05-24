var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var MenuCategorySchema = new Schema({
    name: String,
    order: Number,
    items: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MenuItem'
        }],
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country'
    },
    place: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place'
    }
});
MenuCategorySchema.methods.from = function (req) {
    this.name = req.body.name;
    this.order = req.body.order;
    this.items = [];
    this.country = req.body.country;
    this.place = req.body.place;
    return this;
};
MenuCategorySchema.methods.getItems = function (req) {
    return this.items;
};
module.exports = mongoose.model('Category', MenuCategorySchema);
//# sourceMappingURL=MenuCategory.js.map