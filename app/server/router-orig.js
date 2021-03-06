var CT = require('./modules/country-list');
var AM = require('./modules/account-manager');
var EM = require('./modules/email-dispatcher');
var REC = require('./modules/records.js');
var mongoose = require('mongoose');

module.exports = function(app) {
    app.get('/', function(req, res){
        console.log(req.cookies.user);
        console.log(req.cookies.pass);
        if (req.cookies.user == undefined || req.cookies.pass == undefined) {
	    var name = 'Guest';
	    var Access = REC.saveRecord(mongoose,name,true,function(err){if(err){console.log(err);}});
	    var Lectures = REC.getLectures(mongoose);
	    Lectures.find({name:"tyass"}, function(err,docs) {
		var lecs = [];
		REC.setLecCode(docs,lecs);
		res.render('login', { message: 'New User:'+name, name: 'tyass',
		    id: req.session.id, lecs:lecs, title:"Welcome to YaTT - Please Login To Your Account" });
		});
        } else {
    	    AM.autoLogin(req.cookies.user, req.cookies.pass, function(o){
	        if (o != null){
console.log('auto1');
		    req.session.user = o;
		    res.redirect('/home');
		} else {
console.log('auto2');
		    var name = 'tyass';
		    var Access = REC.saveRecord(mongoose,name,true,function(err){if(err){console.log(err);}});
		    var Lectures = REC.getLectures(mongoose);
		    Lectures.find({name:"tyass"}, function(err,docs) {
			var lecs = [];
		        REC.setLecCode(docs,lecs);
		        res.render('login', { message: 'New User:'+name, name: 'tyass', id: req.session.id,
				lecs: lecs, title: "Welcome to YaTT - Please Login To Your Account" });
			});
	    /*		    res.render('login', { title: 'Welcome to YaTT - Please Login To Your Account' });    */
		}
	    });
	}
        });
    app.post('/', function(req, res){
        console.log(req.body);
        console.log(req.param('user'));
        console.log(req.param('pass'));
        console.log(req.param('remember-me'));
        AM.manualLogin(req.param('user'), req.param('pass'), function(e, o){
	    if (!o){
		res.send(e, 400);
	    } else {
		req.session.user = o;
		if (req.param('remember-me') == 'true') {
		    res.cookie('user', o.user, { maxAge: 900000 });
		    res.cookie('pass', o.pass, { maxAge: 900000 });
		}
		res.send(o, 200);
	    }
	});
        });
    app.get('/edit', function(req, res) {
console.log(req.query);
console.log(req.session.user);
        if (req.session.user == null){
	    res.redirect('/');
	} else {
	    var Access = REC.saveRecord(mongoose,req.session.user.user,true,function(err){if(err){console.log(err);}});
	    var Lectures = REC.getLectures(mongoose);
	    if(req.query.delete === "true") {
		Lectures.update({name:req.session.user.user}, { $pull: { lecs: {week: req.query.i, time: req.query.j} } },
				{ upsert:false,multi:true}, function(err){if(err){console.log(err);}});
	    } else if(req.query.delete === "list"&&req.query.Del === "OK") {
		var Classes = REC.getClasses(mongoose);
		Classes.remove({lecCode:req.query.Code}, {safe:true}, function(err){if(err){console.log(err);}});
	    }
	    Lectures.find({name:req.session.user.user}, function(err,docs) {
		var lecs = [];
		REC.setLecCode(docs,lecs);
		var Classes = REC.getClasses(mongoose);
		Classes.find({}, function(err,docs) {
		    var leclist = [];
		    REC.setLecList(docs,leclist);
		    	res.render('edit', { message: 'Edit mode!', name: req.session.user.user,
			id: req.session.id, lecs: lecs, leclist: leclist,
			title: "Welcome to YaTT by "+ req.session.user.user });
		    });
	    });
	}
        });
    app.get('/cls', function(req, res) {    /* /lecture + "GET" */
	var Classes = REC.getClasses(mongoose);
	Classes.find({lecCode:req.query.submit}, function(err,docs) {
	    if(docs[0]==undefined) {
		res.render('404', {title: 'Page Not Found'});
	    } else {
	        res.render('cls', { message: 'Lecture mode!',
		    id: req.session.id, cls: docs[0], title: "Welcome to YaTT" });
	    }
            });
	});
    app.get('/lecture', function(req, res) {
console.log(req.query);
console.log(req.session.user);
        if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
            res.redirect('/');
        } else {
	    var Classes = REC.getClasses(mongoose);
	    var Access = REC.saveRecord(mongoose,req.session.user.user,true,function(err){if(err){console.log(err);}});
	    var Lectures = REC.getLectures(mongoose);
            if(req.query.update === "create") {
console.log(req.query.Code);
		if(req.query.Code!='New') {
		    var Lectures = REC.getLectures(mongoose);
		    Lectures.update({name:req.session.user.user},
			{ $push: { lecs: {week: req.query.i, time: req.query.j, lecCode: req.query.Code} } },
			{ upsert:false,multi:true}, function(err){if(err){console.log(err);}});
		    var Classes = REC.newClasses(mongoose,req.query.Code,req.session.user.user,function(err){if(err){console.log(err);}});
		    req.query.lecCode = req.query.Code;
		}
	    }
	    if(req.query.lecCode != 'New') {
console.log(req.query.lecCode);
	        Classes.find({lecCode:req.query.lecCode}, function(err,docs) {
console.log(docs[0]);
		    if(docs[0]==undefined) {
			res.render('404', {title: 'Page Not Found'});
		    } else {
		        res.render('lecture', { message: 'Lecture mode!', name: req.session.user.user,
			    id: req.session.id, cls: docs[0],
			    title: "Welcome to YaTT by "+ req.session.user.user });
		    }
		    });
	    } else {
		var cls = { title: "New", lecCode: "New", lang: "en", objective: "New", reference: "Selecting...",
			    advreference: "Selecting...", textbook: "Selecting...",
			    group: [], date: Date.Now };
console.log(cls);
			    res.render('lecture',  { message: 'Lecture mode!', name: req.session.user.user,
			    id: req.session.id, cls: cls, i: req.query.i, j: req.query.j,
			    title: "Welcome to YaTT by "+ req.session.user.user });
	    }
    }
    });
    app.post('/lecture', function(req, res) {
console.log(req.body);
console.log(req.session.user);
        if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
            res.redirect('/');
        } else {
	    var Classes = REC.getClasses(mongoose);
	    var Access = REC.saveRecord(mongoose,req.session.user.user,true,function(err){if(err){console.log(err);}});
	    var Lectures = REC.getLectures(mongoose);
	    if(req.body.update === "true") {
		Classes.update({lecCode:req.body.lecCode},
		    { $set: { title:req.body.title,objective:req.body.objective,
			reference:req.body.reference,advreference:req.body.advreference,
		    	textbook: req.body.textbook } }, {upsert:false,multi:true}, function(err){if(err){console.log(err);}});
            } else if(req.body.update === "create") {
console.log(req.body.Code);
		if(req.body.Code!='New') {
		    var Lectures = REC.getLectures(mongoose);
		    Lectures.update({name:req.session.user.user},
			{ $push: { lecs: {week: req.body.i, time: req.body.j, lecCode: req.body.Code} } },
			{ upsert:false,multi:true}, function(err){if(err){console.log(err);}});
		    var Classes = REC.newClasses(mongoose,req.body.Code,req.session.user.user,
			function(err){if(err){console.log(err);}});
		    req.body.lecCode = req.body.Code;
		}
	    }
	    if(req.body.lecCode != 'New') {
console.log(req.body.lecCode);
	    //	    Classes.find({lecCode:req.body.lecCode}, function(err,docs) {
	        Classes.find({lecCode:req.body.lecCode}, function(err,docs) {
console.log(docs[0]);
res.render('lecture', { message: 'Lecture mode!', name: req.session.user.user,
		    id: req.session.id, cls: docs[0], title: "Welcome to YaTT by "+ req.session.user.user });
		    });
	    } else {
		var cls = { title: "New", lecCode: "New", lang: "en", objective: "New", reference: "Selecting...",
			    advreference: "Selecting...", textbook: "Selecting...",
			    group: [], date: Date.Now };
console.log(cls);
		res.render('lecture',  { message: 'Lecture mode!', name: req.session.user.user,
			    id: req.session.id, cls: cls, i: req.body.i, j: req.body.j,
			    title: "Welcome to YaTT by "+ req.session.user.user });
	    }
    }
    });
    app.get('/home', function(req, res) {
console.log(req.query);
console.log(req.session.user);
        if (req.session.user == null){
	    // if user is not logged-in redirect back to login page //
	    res.redirect('/');
	} else {
	    var Access = REC.saveRecord(mongoose,req.session.user.user,true,function(err){if(err){console.log(err);}});
	    var Lectures = REC.getLectures(mongoose);
	    Lectures.find({name:req.session.user.user}, function(err,docs) {
		if(docs[0]==undefined) {
		    var Lectures = REC.saveLectures(mongoose,req.session.user.user,function(err){if(err){console.log(err);}});
		    Lectures.find({name:req.session.user.user}, function(err,docs) {
		    var lecs = [];
		    REC.setLecCode(docs,lecs);
		    if(docs[0]==undefined) {
		        res.render('404', {title: 'Page Not Found'});
		    } else {
			res.render('home', { message: 'New User:'+req.session.user.user, name: req.session.user.user,
				    id: req.session.id, lecs: lecs, title: "Welcome to YaTT by "+ req.session.user.user });
		    }
		    });
		} else {
console.log('section1');
		    var lecs = [];
		    REC.setLecCode(docs,lecs);
			res.render('home', { message: 'New User:'+req.session.user.user, name: req.session.user.user,
			id: req.session.id, lecs: lecs, title: "Welcome to YaTT by "+ req.session.user.user });
		}
		});
        }
        });
    app.post('/home', function(req, res){
console.log(req.body);
console.log(req.session.user);
console.log(req.session.user.user);
        if (req.param('user') != undefined) {
    	    AM.update({
	        user 		: req.param('user'),
	        name 		: req.param('name'),
		email 		: req.param('email'),
		country 	: req.param('country'),
		pass		: req.param('pass')
	    }, function(o){
		if (o){
		    req.session.user = o;
		    if (req.cookies.user != undefined && req.cookies.pass != undefined){
       			res.cookie('user', o.user, { maxAge: 900000 });
			res.cookie('pass', o.pass, { maxAge: 900000 });	
		    }
		    res.send('ok', 200);
		} else {
		    res.send('error-updating-account', 400);
		}
	    });
	} else if (req.param('logout') == 'true'){
	    res.clearCookie('user');
	    res.clearCookie('pass');
	    req.session.destroy(function(e){ res.send('ok', 200); });
	}
	});
    app.get('/signup', function(req, res) {
	res.render('signup', { title: 'Signup', countries : CT } );
	});
    app.post('/signup', function(req, res){
	AM.signup({
	    name 	: req.param('name'),
	    email 	: req.param('email'),
	    user 	: req.param('user'),
	    pass	: req.param('pass'),
	    country : req.param('country')
	}, function(e, o){
	    if (e){
		res.send(e, 400);
	    } else {
		res.send('ok', 200);
	    }
	});
	});
    app.post('/lost-password', function(req, res){
    // look up the user's account via their email //
	AM.getEmail(req.param('email'), function(o){
	    if (o){
		res.send('ok', 200);
		EM.dispatchResetPasswordLink(o, function(e, m){
		// this callback takes a moment to return //
		// should add an ajax loader to give user feedback //
		    if (!e) {
		//	res.send('ok', 200);
		    } else {
		    	res.send('email-server-error', 400);
		    	for (k in e) console.log('error : ', k, e[k]);
		    }
	        });
	    } else {
		res.send('email-not-found', 400);
	    }
	});
	});
    app.get('/reset-password', function(req, res) {
	var email = req.query["e"];
	var passH = req.query["p"];
	AM.validateLink(email, passH, function(e){
	    if (e != 'ok'){
		res.redirect('/');
	    } else {
	// save the user's email in a session instead of sending to the client //
		req.session.reset = { email:email, passHash:passH };
		res.render('reset', { title : 'Reset Password' });
	    }
	})
	});
    app.post('/reset-password', function(req, res) {
	var nPass = req.param('pass');
	// retrieve the user's email from the session to lookup their account and reset password //
	var email = req.session.reset.email;
	// destory the session immediately after retrieving the stored email //
	req.session.destroy();
	AM.setPassword(email, nPass, function(o){
	    if (o){
	    	res.send('ok', 200);
	    } else{
	    	res.send('unable to update password', 400);
	    }
	})
        });
    app.get('/print', function(req, res) {
	AM.getAllRecords( function(e, accounts){
	    res.render('print', { title : 'Account List', accts : accounts } );
	})
        });
    app.get('/admin', function(req, res) {
	AM.getAllRecords( function(e, accounts){
	    res.render('admin', { title : 'Administration', accts : accounts } );
	})
        });
    app.post('/delete', function(req, res){
        AM.delete(req.body.id, function(e, obj){
	    if (!e){
	    	res.clearCookie('user');
	    	res.clearCookie('pass');
	    	req.session.destroy(function(e){ res.send('ok', 200); });
	    } else {
		res.send('record not found', 400);
	    }
	});
	});
    app.get('/reset', function(req, res) {
	AM.delAllRecords( );
	res.redirect('/print');
        });
    app.get('*', function(req, res) { res.render('404', { title: 'Page Not Found'}); });
};
