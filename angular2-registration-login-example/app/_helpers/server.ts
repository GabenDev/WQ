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
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8000; // set our port

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/wisequeue'); // connect to our database
// var Todo = require('./app/models/todo');
var User = require('../models/user');
var Place = require('../models/Place');
var Currency = require('../models/Currency');
var Country = require('../models/Country');

var Category = require('../models/menu/MenuCategory');
var MenuItem = require('../models/menu/MenuItem');

// ROUTES FOR OUR API
// =============================================================================
// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function (req : any, res : any, next : any) {
    // do logging
    console.log('Something is happening.');
    console.log(JSON.stringify(req.body));
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
    res.setHeader("Access-Control-Allow-Methods" , "GET,POST,PUT,DELETE,OPTIONS");
    next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req : any, res : any) {
    res.json({message: 'The service is up and running!'});
});

router.route('/menu/category/:id/simple')
    .get(function (req : any, res : any) {
        Category.find({ '_id' : req.params.id})
            .exec(function (err : any, place : any) {
                handleError(err, res);
                res.json(place);
            });
    })
;

router.route('/menu/menuItems')
    .get(function (req : any, res : any) {
        MenuItem.find()
            .exec(function (err : any, menuItem : any) {
                handleError(err, res);
                res.json(menuItem);
            });
    })
    .delete(function (req : any, res : any) {
        console.log(req.body);
        // {'_id': req.body.id}
        MenuItem.remove({}, function (err : any, place : any) {
            return res.send("MenuItem Succesfully deleted: " + req.body.id);
        })
    });

router.route('/menu/category/:id')
    .get(function (req : any, res : any) {
        MenuItem.find({ 'category' : req.params.id })
            .populate('currency')
            .populate('language')
            .populate('category')
            .sort([['order', 'ascending']])
            .exec(function (err : any, items : any) {
                handleError(err, res);
                res.json(items);
            });
    })

router.route('/menu/place/:id')
    .get(function (req : any, res : any) {
        console.log('Place Id: ' + req.params.id);
        Category.find({ 'place' : req.params.id })
            .populate('country')
            .populate('items')
            .populate('place')
            .sort([['order', 'ascending']])
            .exec(function (err : any, place : any) {
                handleError(err, res);
                res.json(place);
            });
    })

    .post(function (req : any, res : any) {
        var category = new Category().from(req);

        category.save(function (err : any) {
            for (var index = 0; index < req.body.items.length; ++index) {
                let menuItem = new MenuItem().from(req.body.items[index], category._id);
                console.log(menuItem.name);
                menuItem.save(function (err : any) {
                    category.items.push(menuItem._id);
                    console.log('The categoryId: ' + category._id);
                    Category.findOneAndUpdate({ '_id' :  category._id }, category, {upsert:true}, function(err : any, doc : any){
                        if (err) return res.send(500, { error: err });
                    });
                });
            }
            res.json(category);
        });
    })

    .delete(function (req : any, res : any) {
        console.log(req.body);
        Category.remove({}, function (err : any, place : any) {
            return res.send("Category Succesfully deleted: " + req.body.id);
        })
    });


router.route('/place')
    .get(function (req : any, res : any) {
        Place.find({})
            .populate('country')
            .populate('supportedCurrencies')
            .exec(function (err : any, place : any) {
                handleError(err, res);
                res.json(place);
            });
    })

    .post(function (req : any, res : any) {
        var place = new Place().from(req);
        place.save(function (err : any) {
            handleError(err, res);
            res.json(place);
        })
    })

    .delete(function (req : any, res : any) {
        console.log(req.body);
        Place.findOneAndRemove({'_id': req.body.id}, function (err : any, place : any) {
            return res.send("Place Succesfully deleted: " + req.body.id);
        })
    });


router.route('/user/auth')
    .post(function (req : any, res : any) {
        User.findOne({ 'userName': req.body.userName, 'password' : req.body.password }, function (err : any, user : any) {
            handleError(err, res);
            res.json(user);
        });
    });

router.route('/user')
    .get(function (req : any, res : any) {
        User.find(function (err : any, users : any) {
            handleError(err, res);
            res.json(users);
        });
    })

    .post(function (req : any, res : any) {
        var user = new User().from(req);
        user.save(function (err : any) {
            handleError(err, res);
            res.json(user);
        })
    })

    .delete(function (req : any, res : any) {
        console.log(req.body);
        User.findOneAndRemove({'_id': req.body.id}, function (err : any, user : any) {
            return res.send("User Succesfully deleted: " + req.body.id);
        })
    });

router.route('/currency')
    .get(function (req : any, res : any) {
        Currency.find(function (err : any, currency : any) {
            handleError(err, res);
            res.json(currency);
        });
    })

    .post(function (req : any, res : any) {
        var currency = new Currency().from(req);
        currency.save(function (err : any) {
            handleError(err, res);
            res.json(currency);
        })
    })

    .delete(function (req : any, res : any) {
        console.log(req.body);
        Currency.findOneAndRemove({'_id': req.body.id}, function (err : any, user : any) {
            return res.send("Currency Succesfully deleted: " + req.body.id);
        })
    });

router.route('/country')
    .get(function (req : any, res : any) {
        Country.find({})
            .populate('currency')
            .exec(function (err : any, country : any) {
                handleError(err, res);
                res.json(country);
            });
    })


    .post(function (req : any, res : any) {
        var country = new Country().from(req);
        country.save(function (err : any) {
            handleError(err, res);
            res.json(country);
        })
    })

    .delete(function (req : any, res : any) {
        console.log(req.body);
        Country.findOneAndRemove({'_id': req.body.id}, function (err : any, user : any) {
            return res.send("Country Succesfully deleted: " + req.body.id);
        })
    });

function handleError(err : any, res : any) {
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
