var bcrypt = require('bcrypt')
    //var mongo = require('mongodb');
    //var Db = require('mongodb').Db;
    //var Server = require('mongodb').Server;

    //var dbPort = 27017;
    //var dbHost = global.host;
    //var dbName = 'login-testing';

var mongoose = require('mongoose');
var db = mongoose.createConnection();

//var mongoUri = process.env.MONGOLAB_URI ||
//		process.env.MONGOHQ_URL ||
//	    'mongodb://localhost/login';
//var db = mongoose.connect(mongoUri);
//var Schema = mongoose.Schema;
// var db = mongoose.createConnection('localhost', 'login-testing');

// use moment.js for pretty date-stamping //
var moment = require('moment');

var AM = {}; 

process.on('SIGINT', function() { mongoose.disconnect(); });

/* for heroku */
	var mongoUri = process.env.MONGOLAB_URI ||
		process.env.MONGOHQ_URL ||
	    'mongodb://localhost/login';
//	AM.db = new Db(dbName, new Server(dbHost, dbPort, {auto_reconnect: true}, {}));
/* for heroku */
/* var i=1;
	mongo.connect(mongoUri, function(err,db){
	    AM.accounts = db.collection('accounts',function(er,collection) {
		    collection.insert({'mykey':'myvalue'},{safe:true},function(err,rs){if(err){console.log(err);}})
		});
		}); */
//	AM.db.open(function(e, d){
//		if (e) {
//			console.log(e);
//		}	else{
//			console.log('connected to database :: ' + dbName);
//		}
//		});
/* for heroku */
//	AM.accounts = AM.db.collection('accounts');

module.exports = AM;

AM.autoLogin = function(user, pass, callback) {
    var mongoUri = process.env.MONGOLAB_URI ||
		process.env.MONGOHQ_URL ||
	    'mongodb://localhost/login';
    db.open(mongoUri,function(err){
	if(err){
	    console.error(err);
	    process.exit(1);
	}
	});
    var Schema = mongoose.Schema;
    var accountsSchema = new Schema({ name: { type: String, required: true },
				      email: { type: String, required: true },
				      user: { type: String, required: true },
				      pass: { type: String, required: true },
				      country: { type: String, required: true },
				      date: { type: String, required: true } });
    var Accounts = db.model('Accounts',accountsSchema);
    var accounts = new Accounts();

    Accounts.findOne({user:user}, function(e, o) {
    		if (o){
    			o.pass == pass ? callback(o) : callback(null);
    		}	else{
    			callback(null);
    		}
        });
    //	AM.accounts.findOne({user:user}, function(e, o) {
    //		if (o){
    //			o.pass == pass ? callback(o) : callback(null);
    //		}	else{
    //			callback(null);
    //		}
    //	});
}

AM.manualLogin = function(user, pass, callback) {
    var mongoUri = process.env.MONGOLAB_URI ||
		process.env.MONGOHQ_URL ||
	    'mongodb://localhost/login';
    db.open(mongoUri,function(err){
	if(err){
	    console.error(err);
	    process.exit(1);
	}
	});

    var Schema = mongoose.Schema;
    var accountsSchema = new Schema({ name: { type: String, required: true },
				      email: { type: String, required: true },
				      user: { type: String, required: true },
				      pass: { type: String, required: true },
				      country: { type: String, required: true },
				      date: { type: String, required: true } });
    var Accounts = db.model('Accounts',accountsSchema);
    var accounts = new Accounts();
    Accounts.findOne({user:user}, function(e, o) {
        if (o == null){
console.log('user-not-found');
            callback('user-not-found');
	} else {
	    bcrypt.compare(pass, o.pass, function(err, res) {
		if (res){
console.log('OK!');
		    callback(null, o);
		} else {
console.log('invalid!');
callback('invalid-password');
	}
		});
        }
    	});
    //    AM.accounts.findOne({user:user}, function(e, o) {
    //	if (o == null){
    //	    console.log('user-not-found');
    //callback('user-not-found');
    //	} else {
    //	    bcrypt.compare(pass, o.pass, function(err, res) {
    //		if (res){
    //console.log('OK!');
    //		    callback(null, o);
    //		} else {
    //console.log('invalid!');
    //		    callback('invalid-password');
    //		}
    //		});
    //	}
    //	});
}

// record insertion, update & deletion methods //
AM.signup = function(newData, callback)
{
    var mongoUri = process.env.MONGOLAB_URI ||
		process.env.MONGOHQ_URL ||
	    'mongodb://localhost/login';
    db.open(mongoUri,function(err){
	if(err) {
	    console.error(err);
	    process.exit(1);
	}
	});
    var Schema = mongoose.Schema;
    var accountsSchema = new Schema({ name: { type: String, required: true },
				      email: { type: String, required: true },
				      user: { type: String, required: true },
				      pass: { type: String, required: true },
				      country: { type: String, required: true },
				      date: { type: String, required: true } });
    var Accounts = db.model('Accounts',accountsSchema);
    var accounts = new Accounts();
    Accounts.findOne({user:newData.user}, function(e, o) {
	if (o) {
    	    callback('username-taken');
	} else {
    	    Accounts.findOne({email:newData.email}, function(e, o) {
    		if (o) {
    		    callback('email-taken');
    		} else {
    		    AM.saltAndHash(newData.pass, function(hash){
    			newData.pass = hash;
    			// append date stamp when record was created //
    			newData.date = moment().format('MMMM Do YYYY, h:mm:ss a');
			accounts.name = newData.name;
			accounts.email = newData.email;
			accounts.user = newData.user;
			accounts.pass = hash;
			accounts.country = newData.country;
			accounts.date = moment().format('MMMM Do YYYY, h:mm:ss a');
    			accounts.save(callback(null));
			});
    		}
		});
	}
    	});

    //	AM.accounts.findOne({user:newData.user}, function(e, o) {
    //		if (o){
    //			callback('username-taken');
    //		}	else{
    //			AM.accounts.findOne({email:newData.email}, function(e, o) {
    //				if (o){
    //					callback('email-taken');
    //				}	else{
    //					AM.saltAndHash(newData.pass, function(hash){
    //						newData.pass = hash;
    //					// append date stamp when record was created //
    //						newData.date = moment().format('MMMM Do YYYY, h:mm:ss a');
    //						AM.accounts.insert(newData, callback(null));
    //					});
    //				}
    //			});
    //		}
    //	});
}

AM.update = function(newData, callback)
{
    var mongoUri = process.env.MONGOLAB_URI ||
		process.env.MONGOHQ_URL ||
	    'mongodb://localhost/login';
    db.open(mongoUri,function(err){
	if(err){
	    console.error(err);
	    process.exit(1);
	}
	});

    var Schema = mongoose.Schema;
    var accountsSchema = new Schema({ name: { type: String, required: true },
				      email: { type: String, required: true },
				      user: { type: String, required: true },
				      pass: { type: String, required: true },
				      country: { type: String, required: true },
				      date: { type: String, required: true } });
    var Accounts = db.model('Accounts',accountsSchema);
    var accounts = new Accounts();
    Accounts.findOne({user:newData.user}, function(e, o){
    		o.name 		= newData.name;
    		o.email 	= newData.email;
    		o.country 	= newData.country;
    		if (newData.pass == ''){
    			o.save(null); callback(o);
    		}	else{
    			AM.saltAndHash(newData.pass, function(hash){
    				o.pass = hash;
    				o.save(null); callback(o);
    			});
    		}
    	});

    //	AM.accounts.findOne({user:newData.user}, function(e, o){
    //		o.name 		= newData.name;
    //		o.email 	= newData.email;
    //		o.country 	= newData.country;
    //		if (newData.pass == ''){
    //			AM.accounts.save(o); callback(o);
    //		}	else{
    //			AM.saltAndHash(newData.pass, function(hash){
    //				o.pass = hash;
    //				AM.accounts.save(o); callback(o);
    //			});
    //		}
    //	});
}

AM.setPassword = function(email, newPass, callback)
{
    var mongoUri = process.env.MONGOLAB_URI ||
		process.env.MONGOHQ_URL ||
	    'mongodb://localhost/login';
    db.open(mongoUri,function(err){
	if(err){
	    console.error(err);
	    process.exit(1);
	}
	});

    var Schema = mongoose.Schema;
    var accountsSchema = new Schema({ name: { type: String, required: true },
				      email: { type: String, required: true },
				      user: { type: String, required: true },
				      pass: { type: String, required: true },
				      country: { type: String, required: true },
				      date: { type: String, required: true } });
    var Accounts = db.model('Accounts',accountsSchema);
    var accounts = new Accounts();
    Accounts.findOne({email:email}, function(e, o){
    		AM.saltAndHash(newPass, function(hash){
    			o.pass = hash;
    			o.save(null); callback(o);
    		});
    	});

    //	AM.accounts.findOne({email:email}, function(e, o){
    //		AM.saltAndHash(newPass, function(hash){
    //			o.pass = hash;
    //			AM.accounts.save(o); callback(o);
    //		});
    //	});
}

AM.validateLink = function(email, passHash, callback)
{
    var mongoUri = process.env.MONGOLAB_URI ||
		process.env.MONGOHQ_URL ||
	    'mongodb://localhost/login';
    db.open(mongoUri,function(err){
	if(err){
	    console.error(err);
	    process.exit(1);
	}
	});

    var Schema = mongoose.Schema;
    var accountsSchema = new Schema({ name: { type: String, required: true },
				      email: { type: String, required: true },
				      user: { type: String, required: true },
				      pass: { type: String, required: true },
				      country: { type: String, required: true },
				      date: { type: String, required: true } });
    var Accounts = db.model('Accounts',accountsSchema);
    var accounts = new Accounts();
    Accounts.find({ $and: [{email:email, pass:passHash}] }, function(e, o){
        callback(o ? 'ok' : null);
	});

    //	AM.accounts.find({ $and: [{email:email, pass:passHash}] }, function(e, o){
    //		callback(o ? 'ok' : null);
    //	});
}

AM.saltAndHash = function(pass, callback)
{
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(pass, salt, function(err, hash) {
			callback(hash);
		});
	});
}

AM.delete = function(id, callback)
{
    var mongoUri = process.env.MONGOLAB_URI ||
		process.env.MONGOHQ_URL ||
	    'mongodb://localhost/login';
    db.open(mongoUri,function(err){
	if(err){
	    console.error(err);
	    process.exit(1);
	}
	});

    var Schema = mongoose.Schema;
    var accountsSchema = new Schema({ name: { type: String, required: true },
				      email: { type: String, required: true },
				      user: { type: String, required: true },
				      pass: { type: String, required: true },
				      country: { type: String, required: true },
				      date: { type: String, required: true } });
    var Accounts = db.model('Accounts',accountsSchema);

    var accounts = new Accounts();
    Accounts.remove({_id: this.getObjectId(id)}, callback);
    //    AM.accounts.remove({_id: this.getObjectId(id)}, callback);
}

// auxiliary methods //

AM.getEmail = function(email, callback)
{
    var mongoUri = process.env.MONGOLAB_URI ||
		process.env.MONGOHQ_URL ||
	    'mongodb://localhost/login';
    db.open(mongoUri,function(err){
	if(err){
	    console.error(err);
	    process.exit(1);
	}
	});

    var Schema = mongoose.Schema;
    var accountsSchema = new Schema({ name: { type: String, required: true },
				      email: { type: String, required: true },
				      user: { type: String, required: true },
				      pass: { type: String, required: true },
				      country: { type: String, required: true },
				      date: { type: String, required: true } });
    var Accounts = db.model('Accounts',accountsSchema);
    var accounts = new Accounts();
    Accounts.findOne({email:email}, function(e, o){ callback(o); });
    //	AM.accounts.findOne({email:email}, function(e, o){ callback(o); });
}

AM.getObjectId = function(id)
{
	return AM.accounts.db.bson_serializer.ObjectID.createFromHexString(id)
}

AM.getAllRecords = function(callback)
{
    var mongoUri = process.env.MONGOLAB_URI ||
		process.env.MONGOHQ_URL ||
	    'mongodb://localhost/login';
    db.open(mongoUri,function(err){
	if(err){
	    console.error(err);
	    process.exit(1);
	}
	});
    var Schema = mongoose.Schema;
    var accountsSchema = new Schema({ name: { type: String, required: true },
				      email: { type: String, required: true },
				      user: { type: String, required: true },
				      pass: { type: String, required: true },
				      country: { type: String, required: true },
				      date: { type: String, required: true } });
    var Accounts = db.model('Accounts',accountsSchema);
    var accounts = new Accounts();
    Accounts.find({},function(err,docs) {
	    console.log(docs);
	    if (err) callback(err)
		else callback(null, docs)
	 });

    //	AM.accounts.find().toArray(
    //		function(e, res) {
    //		if (e) callback(e)
    //		else callback(null, res)
    //	});
};

AM.delAllRecords = function(id, callback)
{
    var mongoUri = process.env.MONGOLAB_URI ||
		process.env.MONGOHQ_URL ||
	    'mongodb://localhost/login';
    db.open(mongoUri,function(err){
	if(err){
	    console.error(err);
	    process.exit(1);
	}
	});
    var Schema = mongoose.Schema;
    var accountsSchema = new Schema({ name: { type: String, required: true },
				      email: { type: String, required: true },
				      user: { type: String, required: true },
				      pass: { type: String, required: true },
				      country: { type: String, required: true },
				      date: { type: String, required: true } });
    var Accounts = db.model('Accounts',accountsSchema);
    var accounts = new Accounts();
    Accounts.remove(); // reset accounts collection for testing //
    //	AM.accounts.remove(); // reset accounts collection for testing //
}

// just for testing - these are not actually being used //

AM.findById = function(id, callback)
{
    var mongoUri = process.env.MONGOLAB_URI ||
		process.env.MONGOHQ_URL ||
	    'mongodb://localhost/login';
    db.open(mongoUri,function(err){
	if(err){
	    console.error(err);
	    process.exit(1);
	}
	});


    var Schema = mongoose.Schema;
    var accountsSchema = new Schema({ name: { type: String, required: true },
				      email: { type: String, required: true },
				      user: { type: String, required: true },
				      pass: { type: String, required: true },
				      country: { type: String, required: true },
				      date: { type: String, required: true } });
    var Accounts = db.model('Accounts',accountsSchema);
    var accounts = new Accounts();

    Accounts.findOne({_id: this.getObjectId(id)},
        function(e, res) {
    		if (e) callback(e)
		else callback(null, res)
    });

    //	AM.accounts.findOne({_id: this.getObjectId(id)},
    //		function(e, res) {
    //		if (e) callback(e)
    //		else callback(null, res)
    //	});
};


AM.findByMultipleFields = function(a, callback)
{
// this takes an array of name/val pairs to search against {fieldName : 'value'} //
    var mongoUri = process.env.MONGOLAB_URI ||
		process.env.MONGOHQ_URL ||
	    'mongodb://localhost/login';
    db.open(mongoUri,function(err){
	if(err){
	    console.error(err);
	    process.exit(1);
	}
	});

    var Schema = mongoose.Schema;
    var accountsSchema = new Schema({ name: { type: String, required: true },
				      email: { type: String, required: true },
				      user: { type: String, required: true },
				      pass: { type: String, required: true },
				      country: { type: String, required: true },
				      date: { type: String, required: true } });
    var Accounts = db.model('Accounts',accountsSchema);
    var accounts = new Accounts();

    Accounts.find( { $or : a } ).toArray(
    		function(e, results) {
    		if (e) callback(e)
    		else callback(null, results)
    });
    //	AM.accounts.find( { $or : a } ).toArray(
    //		function(e, results) {
    //		if (e) callback(e)
    //		else callback(null, results)
    //	});
}
