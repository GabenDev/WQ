var express = require('express'),
    jwt     = require('express-jwt'),
    config  = require('./config'),
    quoter  = require('./quoter');
    bodyParser = require('body-parser');
    morgan = require('morgan');

// Domain objects
var User = require('./models/user');
    Place = require('./models/Place');
    Currency = require('./models/Currency');
    Country = require('./models/Country');
    Category = require('./models/menu/MenuCategory');
    MenuItem = require('./models/menu/MenuItem');
    Order = require('./models/order/Order');
    Queue = require('./models/order/Queue');

var router = module.exports = express.Router();
router.use(morgan('dev'));
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

// Init Mongo Connection
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/wisequeue'); // connect to our database
var wss;

//
// ROUTES FOR OUR API
// =============================================================================
// create our router
// var router = express.Router();

// Validate access_token
var jwtCheck = jwt({
  secret: config.secret,
  audience: config.audience,
  issuer: config.issuer
});

// Check for scope
function requireScope(scope) {
  return function (req, res, next) {
    var has_scopes = req.user.scope === scope;
    if (!has_scopes) { 
        res.sendStatus(401); 
        return;
    }
    next();
  };
}

// middleware to use for all requests
router.use(function (req, res, next) {
    console.log('Something is happening.');
    console.log(JSON.stringify(req.body));
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
    res.setHeader("Access-Control-Allow-Methods" , "GET,POST,PUT,DELETE,OPTIONS");
    next();
});

var protectedRoutes = function(wss) {
    console.log('Protected Routes');
    this.wss = wss;
    return router;
};

module.exports = protectedRoutes;


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
    res.json({message: 'The service is up and running!'});
});

router.use('/api', jwtCheck, requireScope('full_access'));

router.get('/api/order/:placeId', function(req, res) {
  console.log(JSON.stringify(req.user));
    Order.find({ 'place' : req.params.placeId})
        .sort([['orderDate', 'ascending']])
        .exec(function (err, queue) {
        handleError(err, res);
        res.json(queue);
    });
});


router.route('/api/order/:placeId/active')
    .get(function (req, res) {
    var sequences = [];
    Order.find({ 'place' : req.params.placeId, 'status' : 'IN_PROGRESS' })
        .sort([['orderDate', 'ascending']])
        .exec(function (err, orders) {
        handleError(err, res);
        for (var index = 0; index < orders.length; ++index) {
            if(sequences.indexOf(orders[index].sequence)  == -1 ) {
                sequences.push(orders[index].sequence);
            }
        }
        res.json(sequences);
    });
});

router.route('/api/order/:placeId/status/pending')
    .get(function (req, res) {
    Order.find({ 'place' : req.params.placeId, 'status' : 'IN_PROGRESS' })
        .sort([['orderDate', 'ascending' ]])
        .populate('item')
        .populate('item.currency')
        .exec(function (err, queue) {
        handleError(err, res);
        res.json(queue);
    });
});

router.route('/api/order/:placeId/status/done')
    .get(function (req, res) {
    Order.find({ 'place' : req.params.placeId, 'status' : 'DONE' })
        .sort([['readyDate', 'descending' ]])
        .populate('item')
        .populate('item.currency')
        .exec(function (err, queue) {
        handleError(err, res);
        res.json(queue);
    });
});

router.route('/api/order/done')
    .post(function (req, res) {
    Order.update({ 'place' : req.body.placeId, 'sequence' : req.body.sequence }, { 'readyDate' : Date.now(),'status' : 'DONE' }, {multi: true}, function(err, item){
        if (err) return res.send(500, { error: err });
        Order.find({ 'place' : req.params.placeId, 'sequence' : req.params.sequence })
            .populate('place')
            .populate('item')
            .sort([['orderDate', 'descending']])
            .exec(function (err, orders) {
                handleError(err, res);
                this.wss.clients.forEach(function each(client) {
                    client.send(JSON.stringify(orders));
                });
                return res.json(order);
            });
    });
});

router.route('/api/order/cancel')
    .post(function (req, res) {
    Order.update({ 'place' : req.body.placeId, 'sequence' : req.body.sequence }, { 'status' : 'CANCELLED' }, {multi: true}, function(err, item){
        if (err) return res.send(500, { error: err });
        return res.json(item);
    });
});


router.route('/api/order/:placeId/item/:sequence')
    .get(function (req, res) {
    Order.find({ 'place' : req.params.placeId, 'sequence' : req.params.sequence })
        .sort([['orderDate', 'descending']])
        .exec(function (err, queue) {
        handleError(err, res);
        res.json(queue);
    });
});

router.route('/api/order')
    .get(function (req, res) {
    Order.find({ })
        .sort([['orderDate', 'descending']])
        .exec(function (err, queues) {
        handleError(err, res);
        res.json(queues);
    });
})

.post(function (req, res) {
    var place = req.body.place;
    var orders = req.body.items;

    console.log('Order made');

    // Queue.findOne({ 'place' : place }).exec(function (err, queue) {
    //     if(queue != null) {
    //         queue.orders = queue.orders + 1;
    //     } else {
    //         queue = new Queue().from(req.body);
    //     }
    //     if(req.body.newValue) {
    //         queue.orders = req.body.newValue;
    //     }

        Queue.findOneAndUpdate({ 'place' :  place },
            {
                $inc : { orders : 1 }
            },
            {upsert:true}, function(err){
            if (err) return res.send(500, { error: err });
            for (var index = 0; index < orders.length; ++index) {
                var order = new Order().from(orders[index], queue.orders, place);
                order.save(function (err) {
                    handleError(err, res);
                });
            }
            res.json(queue);
        });
    // });
})

.delete(function (req, res) {
    console.log(req.body);
    Queue.remove({}, function (err, place) {
        Order.remove({}, function (err, place) {
            return res.send("Queues and Orders Succesfully deleted! ");
        });
    });

});

router.route('/api/menu/category/:id/simple')
    .get(function (req, res) {
    Category.find({ '_id' : req.params.id})
        .exec(function (err, place) {
        handleError(err, res);
        res.json(place);
    });
})
;

router.route('/api/menu/menuItems')
    .get(function (req, res) {
    MenuItem.find()
        .exec(function (err, menuItem) {
        handleError(err, res);
        res.json(menuItem);
    });
})
.delete(function (req, res) {
    console.log(req.body);
    // {'_id': req.body.id}
    MenuItem.remove({}, function (err, place) {
        return res.send("MenuItem Succesfully deleted: " + req.body.id);
    })
});

router.route('/api/menu/category/:id')
    .get(function (req, res) {
    MenuItem.find({ 'category' : req.params.id })
        .populate('currency')
        .populate('language')
        .populate('category')
        .sort([['order', 'ascending']])
        .exec(function (err, items) {
        handleError(err, res);
        res.json(items);
    });
})

router.route('/api/menu/place/:id')
    .get(function (req, res) {
    Category.find({ 'place' : req.params.id })
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
        for (var index = 0; index < req.body.items.length; ++index) {
            let menuItem = new MenuItem().from(req.body.items[index], category._id);
            console.log(menuItem.name);
            menuItem.save(function (err) {
                category.items.push(menuItem._id);
                Category.findOneAndUpdate({ '_id' :  category._id }, category, {upsert:true}, function(err, doc){
                    if (err) return res.send(500, { error: err });
                });
            });
        }
        res.json(category);
    });
})

.delete(function (req, res) {
    console.log(req.body);
    Category.remove({}, function (err, place) {
        return res.send("Category Succesfully deleted: " + req.body.id);
    })
});


router.route('/api/place')
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
    })
})

.delete(function (req, res) {
    console.log(req.body);
    Place.findOneAndRemove({'_id': req.body.id}, function (err, place) {
        return res.send("Place Succesfully deleted: " + req.body.id);
    })
});

router.route('/api/currency')
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
    })
})

.delete(function (req, res) {
    console.log(req.body);
    Currency.findOneAndRemove({'_id': req.body.id}, function (err, user) {
        return res.send("Currency Succesfully deleted: " + req.body.id);
    })
});

router.route('/api/country')
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
    })
})

.delete(function (req, res) {
    console.log(req.body);
    Country.findOneAndRemove({'_id': req.body.id}, function (err, user) {
        return res.send("Country Succesfully deleted: " + req.body.id);
    })
});

router.route('/api/user')
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
        })
    })

    .delete(function (req, res) {
        console.log(req.body);
        User.findOneAndRemove({'_id': req.body.id}, function (err, user) {
            return res.send("User Succesfully deleted: " + req.body.id);
        })
    });

router.get('random-quote', function(req, res) {
  res.status(200).send(quoter.getRandomOne());
});

function handleError(err, res) {
    if (err) {
        console.log(err);
        res.send(err);
    }
}


// exports.getRoute = function() {
//     return router;
// }
function getRoute() {
    return router;
}

