var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    firstName: String,
    lastName : String,
    userName : String,
    password : String,
    provider: {type: String, enum: ['FACEBOOK','GOOGLE', 'LOCAL']},
    last_login_dt : { type: Date, default: Date.now },
    permissions: [{
        role : { type: String, enum: ['ADMIN','WAITER'] },
        place: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Place'
        }
    }],
    token : String
});

UserSchema.methods.from = function(req : any) {
    this.firstName = req.body.firstName;
    this.lastName = req.body.lastName;
    this.userName = req.body.userName;
    this.password = req.body.password;
    this.provider = 'LOCAL';
    this.last_login_dt = req.body.last_login_dt;
    this.permissions = req.body.permissions;
    this.token = 'DUMMY_AUTH_TOKEN';
    return this;
};

UserSchema.methods.setToken = function(token : String) {
    this.token = token;
}

module.exports = mongoose.model('User', UserSchema);
