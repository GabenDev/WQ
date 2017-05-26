// BASE SETUP
// =============================================================================
// call the packages we need
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var morgan = require('morgan');
// configure app
app.use(morgan('dev')); // log requests to the console
// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = process.env.PORT || 8100; // set our port
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/wisequeue'); // connect to our database
// var Todo = require('./app/models/todo');
var User = require('./models/user');
var Place = require('./models/Place');
var Currency = require('./models/Currency');
var Country = require('./models/Country');
var Category = require('./models/menu/MenuCategory');
var MenuItem = require('./models/menu/MenuItem');
var Order = require('./models/order/Order');
var Queue = require('./models/order/Queue');
// ROUTES FOR OUR API
// =============================================================================
// create our router
var router = express.Router();
// middleware to use for all requests
router.use(function (req, res, next) {
    // do logging
    console.log('Something is happening.');
    console.log(JSON.stringify(req.body));
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    next();
});
// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
    res.json({ message: 'The service is up and running!' });
});
router.route('/order/:placeId')
    .get(function (req, res) {
    Order.find({ 'place': req.params.placeId })
        .sort([['orderDate', 'ascending']])
        .exec(function (err, queue) {
        handleError(err, res);
        res.json(queue);
    });
});
router.route('/order/:placeId/active')
    .get(function (req, res) {
    var sequences = [];
    Order.find({ 'place': req.params.placeId, 'status': 'IN_PROGRESS' })
        .sort([['orderDate', 'ascending']])
        .exec(function (err, orders) {
        handleError(err, res);
        for (var index = 0; index < orders.length; ++index) {
            if (sequences.indexOf(orders[index].sequence) == -1) {
                sequences.push(orders[index].sequence);
            }
        }
        res.json(sequences);
    });
});
router.route('/order/:placeId/status/:status')
    .get(function (req, res) {
    Order.find({ 'place': req.params.placeId, 'status': req.params.status })
        .sort([['orderDate', 'ascending']])
        .exec(function (err, queue) {
        handleError(err, res);
        res.json(queue);
    });
});
router.route('/order/done')
    .post(function (req, res) {
    Order.update({ 'place': req.body.placeId, 'sequence': req.body.sequence }, { 'status': 'DONE' }, { multi: true }, function (err, item) {
        if (err)
            return res.send(500, { error: err });
        return res.json(item);
    });
});
router.route('/order/cancel')
    .post(function (req, res) {
    Order.update({ 'place': req.body.placeId, 'sequence': req.body.sequence }, { 'status': 'CANCELLED' }, { multi: true }, function (err, item) {
        if (err)
            return res.send(500, { error: err });
        return res.json(item);
    });
});
router.route('/order/:placeId/item/:sequence')
    .get(function (req, res) {
    Order.find({ 'place': req.params.placeId, 'sequence': req.params.sequence })
        .sort([['orderDate', 'descending']])
        .exec(function (err, queue) {
        handleError(err, res);
        res.json(queue);
    });
});
router.route('/order')
    .get(function (req, res) {
    Order.find({})
        .sort([['orderDate', 'descending']])
        .exec(function (err, queues) {
        handleError(err, res);
        res.json(queues);
    });
})
    .post(function (req, res) {
    var place = req.body.place;
    var orders = req.body.items;
    Queue.findOne({ 'place': place })
        .exec(function (err, queue) {
        if (queue != null) {
            queue.orders = queue.orders + 1;
        }
        else {
            queue = new Queue().from(req.body);
        }
        if (req.body.newValue) {
            queue.orders = req.body.newValue;
        }
        Queue.findOneAndUpdate({ 'place': place }, { "place": place, "orders": queue.orders }, { upsert: true }, function (err) {
            if (err)
                return res.send(500, { error: err });
        });
        for (var index = 0; index < orders.length; ++index) {
            var order = new Order().from(orders[index], queue.orders, place);
            order.save(function (err) {
                handleError(err, res);
                res.json(queue);
            });
        }
    });
})["delete"](function (req, res) {
    console.log(req.body);
    Queue.remove({}, function (err, place) {
        Order.remove({}, function (err, place) {
            return res.send("Queues and Orders Succesfully deleted! ");
        });
    });
});
router.route('/menu/category/:id/simple')
    .get(function (req, res) {
    Category.find({ '_id': req.params.id })
        .exec(function (err, place) {
        handleError(err, res);
        res.json(place);
    });
});
router.route('/menu/menuItems')
    .get(function (req, res) {
    MenuItem.find()
        .exec(function (err, menuItem) {
        handleError(err, res);
        res.json(menuItem);
    });
})["delete"](function (req, res) {
    console.log(req.body);
    // {'_id': req.body.id}
    MenuItem.remove({}, function (err, place) {
        return res.send("MenuItem Succesfully deleted: " + req.body.id);
    });
});
router.route('/menu/category/:id')
    .get(function (req, res) {
    MenuItem.find({ 'category': req.params.id })
        .populate('currency')
        .populate('language')
        .populate('category')
        .sort([['order', 'ascending']])
        .exec(function (err, items) {
        handleError(err, res);
        res.json(items);
    });
});
router.route('/menu/place/:id')
    .get(function (req, res) {
    console.log('Place Id: ' + req.params.id);
    Category.find({ 'place': req.params.id })
        .populate('country')
        .populate('items')
        .populate('place')
        .sort([['order', 'ascending']])
        .exec(function (err, place) {
        handleError(err, res);
        res.json(place);
    });
})
    .post(function (req, res) {
    var category = new Category().from(req);
    category.save(function (err) {
        var _loop_1 = function () {
            var menuItem = new MenuItem().from(req.body.items[index], category._id);
            console.log(menuItem.name);
            menuItem.save(function (err) {
                category.items.push(menuItem._id);
                Category.findOneAndUpdate({ '_id': category._id }, category, { upsert: true }, function (err, doc) {
                    if (err)
                        return res.send(500, { error: err });
                });
            });
        };
        for (var index = 0; index < req.body.items.length; ++index) {
            _loop_1();
        }
        res.json(category);
    });
})["delete"](function (req, res) {
    console.log(req.body);
    Category.remove({}, function (err, place) {
        return res.send("Category Succesfully deleted: " + req.body.id);
    });
});
router.route('/place')
    .get(function (req, res) {
    Place.find({})
        .populate('country')
        .populate('supportedCurrencies')
        .exec(function (err, place) {
        handleError(err, res);
        res.json(place);
    });
})
    .post(function (req, res) {
    var place = new Place().from(req);
    place.save(function (err) {
        handleError(err, res);
        res.json(place);
    });
})["delete"](function (req, res) {
    console.log(req.body);
    Place.findOneAndRemove({ '_id': req.body.id }, function (err, place) {
        return res.send("Place Succesfully deleted: " + req.body.id);
    });
});
router.route('/user/auth')
    .post(function (req, res) {
    User.findOne({ 'userName': req.body.userName, 'password': req.body.password }, function (err, user) {
        handleError(err, res);
        res.json(user);
    });
});
router.route('/user')
    .get(function (req, res) {
    User.find(function (err, users) {
        handleError(err, res);
        res.json(users);
    });
})
    .post(function (req, res) {
    var user = new User().from(req);
    user.save(function (err) {
        handleError(err, res);
        res.json(user);
    });
})["delete"](function (req, res) {
    console.log(req.body);
    User.findOneAndRemove({ '_id': req.body.id }, function (err, user) {
        return res.send("User Succesfully deleted: " + req.body.id);
    });
});
router.route('/currency')
    .get(function (req, res) {
    Currency.find(function (err, currency) {
        handleError(err, res);
        res.json(currency);
    });
})
    .post(function (req, res) {
    var currency = new Currency().from(req);
    currency.save(function (err) {
        handleError(err, res);
        res.json(currency);
    });
})["delete"](function (req, res) {
    console.log(req.body);
    Currency.findOneAndRemove({ '_id': req.body.id }, function (err, user) {
        return res.send("Currency Succesfully deleted: " + req.body.id);
    });
});
router.route('/country')
    .get(function (req, res) {
    Country.find({})
        .populate('currency')
        .exec(function (err, country) {
        handleError(err, res);
        res.json(country);
    });
})
    .post(function (req, res) {
    var country = new Country().from(req);
    country.save(function (err) {
        handleError(err, res);
        res.json(country);
    });
})["delete"](function (req, res) {
    console.log(req.body);
    Country.findOneAndRemove({ '_id': req.body.id }, function (err, user) {
        return res.send("Country Succesfully deleted: " + req.body.id);
    });
});
function handleError(err, res) {
    if (err) {
        console.log(err);
        res.send(err);
    }
}
// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);
// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
