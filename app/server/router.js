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
			    id: req.session.id, lecs:lecs, title: "Welcome to YaTT - Please Login To Your Account" });
			});
        } else {
    	    AM.autoLogin(req.cookies.user, req.cookies.pass, function(o){
	        if (o != null){
		    req.session.user = o;
		    res.redirect('/home');
		} else {
		    var name = 'tyass';
		    var Access = REC.saveRecord(mongoose,name,true,function(err){if(err){console.log(err);}});
		    var Lectures = REC.getLectures(mongoose);
		    Lectures.find({name:"tyass"}, function(err,docs) {
			var lecs = [];
		        REC.setLecCode(docs,lecs);
		        res.render('login', { message: 'New User:'+name, name: 'tyass', id: req.session.id,
				lecs: lecs, title: "Welcome to YaTT - Please Login To Your Account" });
			});
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
        if (req.session.user == null){
	    res.redirect('/');
	} else {
console.log('edit - get');
	    var Access = REC.saveRecord(mongoose,req.session.user.user,true,function(err){if(err){console.log(err);}});
	    var Lectures = REC.getLectures(mongoose);
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
    app.post('/edit', function(req, res) {
        if (req.session.user == null){
	    res.redirect('/');
	} else {
console.log('edit - post');
	    var Access = REC.saveRecord(mongoose,req.session.user.user,true,function(err){if(err){console.log(err);}});
	    var Lectures = REC.getLectures(mongoose);
	    if(req.body.delete === "true") {
		Lectures.update({name:req.session.user.user}, { $pull: { lecs: {week: req.body.i, time: req.body.j}}},
				{ upsert:false,multi:true}, function(err) {
		    if(err) {
			console.log(err);
			res.send(err,400);
		    } else {
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
	    } else if(req.body.delete === "list"&&req.body.Del === "OK") {
		var Classes = REC.getClasses(mongoose);
		Classes.remove({lecCode:req.body.Code}, {safe:true}, function(err){
		    if(err) {
			console.log(err);
			res.send(err,400);
		    } else {
			;
		    }
		    });
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
    app.get('/cls', function(req, res) {    /* /cls + "GET" */
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
        if (req.session.user == null){
            res.redirect('/');
        } else {
	    var Classes = REC.getClasses(mongoose);
	    var Access = REC.saveRecord(mongoose,req.session.user.user,true,function(err){if(err){console.log(err);}});
	    var Lectures = REC.getLectures(mongoose);
	    if(req.query.lecCode != 'New') {
	        Classes.find({lecCode:req.query.lecCode}, function(err,docs) {
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
			    advreference: "Selecting...", textbook: "Selecting...", group: [], date: Date.Now };
		res.render('lecture',  { message: 'Lecture mode!', name: req.session.user.user,
			    id: req.session.id, cls: cls, i: req.query.i, j: req.query.j,
			    title: "Welcome to YaTT by "+ req.session.user.user });
	    }
    }
    });
    app.post('/lecture', function(req, res) {
        if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
            res.redirect('/');
        } else {
	    var Classes = REC.getClasses(mongoose);
	    var Access = REC.saveRecord(mongoose,req.session.user.user,true,function(err){if(err){console.log(err);}});
console.log(req.body.lecCode);
	    if(req.body.update === "true") {
		Classes.update({lecCode:req.body.lecCode},
		    { $set: { title:req.body.title,objective:req.body.objective,
			reference:req.body.reference,advreference:req.body.advreference,
		    	textbook: req.body.textbook }}, {upsert:false,multi:true}, function(err){
			if(err) {
			    console.log(err);
			    res.send(err,400);
			} else {
			    if(req.body.lecCode != 'New') {
				    Classes.find({lecCode:req.body.lecCode}, function(e,docs) {
					if(docs[0]==undefined) {
					    res.render('404',{title:'Page Not Found'});
					} else {
					    if(req.body.layout != 'true') {
						res.render('lecture', { message: 'Lecture mode!', name: req.session.user.user,
				        	    id: req.session.id, cls: docs[0], 
						    title: "Welcome to YaTT by "+ req.session.user.user });
					    } else {
						res.render('clayout', { title : 'Welcome to YaTT by '+ req.session.user.user,
						    message: 'Edit Contents Layout:'+req.session.user.user,
							    name: req.session.user.user, cls: docs[0], clss: docs[0] } );
					    }
					}
					});
			    }
			}
		    });
            } else if(req.body.update === "create") {
		if(req.body.Code!='New') {
		    var Lectures = REC.getLectures(mongoose);
		    Lectures.update({name:req.session.user.user},
			{ $push: { lecs: {week: req.body.i, time: req.body.j, lecCode: req.body.Code} } },
			{ upsert:false,multi:true}, function(err) {
			if(err) {
			    console.log(err);
			    res.send(err,400);
			} else {
			    var Classes = REC.newClasses(mongoose,req.body.Code,req.session.user.user,function(e){
				if(e){
			            console.log(e);
				    res.send(e,400);
			    	} else {
				    Classes.find({lecCode:req.body.Code}, function(e,docs) {
				    	if(docs[0]==undefined) {
					    res.render('404',{title:'Page Not Found'});
				    	} else {
					    res.render('lecture', { message: 'Lecture mode!', name:req.session.user.user,
					        id:req.session.id, cls:docs[0],
								title: "Welcome to YaTT by "+ req.session.user.user });
				    	}
					});
				}
				});
			}});
		}
	    }
	}
	});
    app.get('/home', function(req, res) {
        if (req.session.user == null){
	    // if user is not logged-in redirect back to login page //
	    res.redirect('/');
	} else {
	    var Access = REC.saveRecord(mongoose,req.session.user.user,true,function(err){if(err){console.log(err);}});
	    var Lectures = REC.getLectures(mongoose);
	    Lectures.find({name:req.session.user.user}, function(err,docs) {
		if(docs[0]==undefined) {
		    var Lectures = REC.saveLectures(mongoose,req.session.user.user,function(err){
			if(err) {
			    res.send(err,400);
			} else {
			    Lectures.find({name:req.session.user.user}, function(err,docs) {
				var lecs = [];
				REC.setLecCode(docs,lecs);
				if(docs[0]==undefined) {
				    res.render('404', {title: 'Page Not Found'});
				} else {
				    res.render('home', { message: 'New User:'+req.session.user.user,
					name: req.session.user.user, id: req.session.id, lecs: lecs, 
							 title: "Welcome to YaTT by "+ req.session.user.user });
			   	}
				});
			}
			});
		} else {
		    var lecs = [];
		    REC.setLecCode(docs,lecs);
			res.render('home', { message: 'New User:'+req.session.user.user, name: req.session.user.user,
			id: req.session.id, lecs: lecs, title: "Welcome to YaTT by "+ req.session.user.user });
		}
		});
        }
        });
    app.post('/home', function(req, res){
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
    function cdelete(grp,num) {
	num++;
	var n = [];
	if(num!=grp.length) {
	    for(var i=0; i<grp.length; i++) {
		if(num>i) n[i]=grp[i];
		else n[i-1]=grp[i];
	    }
	} else {
            for(var i=0; i<(grp.length-1); i++) {
	    	n[i]=grp[i];
	    }
	}
    	return n;
    }
    function duplicate(grp,num) {
        num++;
        var n = [];
        for(var i=0; i<grp.length; i++) {
	    if(num>i) n[i]=grp[i];
	    else n[i+1]=grp[i];
	}
	n[num]=grp[num-1];
	return n;
    }
    app.post('/clayout', function(req, res) {
        if (req.session.user == null){
            res.redirect('/');
        } else {
console.log('clayout - post');
console.log(req.body.delete);
console.log(req.body.lecCode);
console.log(req.body.i);
	    var Classes = REC.getClasses(mongoose);
	    var Access = REC.saveRecord(mongoose,req.session.user.user,true,function(err){if(err){console.log(err);}});
	    var newCls = JSON.parse(req.body.cls);
	    if(req.body.delete === "cgroup" && req.body.submit === "OK") {
		var grp = duplicate(newCls.group,req.body.i);
		Classes.update({lecCode:req.body.lecCode},
			{ $set: { group: grp } }, { upsert:false,multi:true}, function(err) {
			if(err) {
			    console.log(err);
			    res.send(err,400);
			} else {
			    Classes.find({lecCode:req.body.lecCode}, function(e,docs) {
				if(docs[0]==undefined) {
				    res.render('404',{title:'Page Not Found'});
				} else {
				    res.render('clayout', { title : 'Contents Layout',
					message: 'Edit Contents Layout:'+req.session.user.user,
					name: req.session.user.user,
					    cls: docs[0], clss: docs[0] } );
				}
				});
			}
			});
	    } else if(req.body.delete === "line" && req.body.submit === "OK") {
		var grp = cdelete(newCls.group,req.body.i);
		console.log(grp);
		Classes.update({lecCode:req.body.lecCode},
			{ $set: { group: grp } }, { upsert:false,multi:true}, function(err) {
			if(err) {
			    console.log(err);
			    res.send(err,400);
			} else {
			    Classes.find({lecCode:req.body.lecCode}, function(e,docs) {
				if(docs[0]==undefined) {
				    res.render('404',{title:'Page Not Found'});
				} else {
				    res.render('clayout', { title : 'Contents Layout',
					message: 'Edit Contents Layout:'+req.session.user.user,
					name: req.session.user.user,
					    cls: docs[0], clss: docs[0] } );
				}
				});
			}
			});
	    }
	}
	});
    app.get('/admin', function(req, res) {
	var Access = REC.getAccess();
        var Lectures = REC.getLectures(mongoose);
	Lectures.find({}, function(err,lecs) {
	    var Classes = REC.getClasses(mongoose);
	    Classes.find({}, function(err,docs) {
		var leclist = [];
		REC.setLecList(docs,leclist);
		Access.find({}, function(err,docs) {
	    	    AM.getAllRecords( function(e, accounts) {
		    	res.render('admin', { title : 'Administration', accts:accounts,
			    logs: docs, lecs: lecs, leclist: leclist } );
			})
		    })
	        })
	    })
	});
    app.post('/admin', function(req, res) {
	var Accounts = AM.getAccounts();
	var Access = REC.getAccess();
        var Lectures = REC.getLectures(mongoose);
	var Classes = REC.getClasses(mongoose);
        console.log(req.body.submit);
        console.log(req.body.delete);
        if(req.body.delete === "true" && req.body.submit === "OK") {
            console.log(req.body.submit);
            console.log(req.body.delete);
            console.log(req.body.date);
            console.log(req.body.id);
            Access.remove({_id:req.body.id}, {safe:true}, function(err){if(err){console.log(err);}});
        } else if(req.body.delete === "lecs" && req.body.submit === "OK") {
            console.log(req.body.submit);
            console.log(req.body.delete);
            console.log(req.body.user);
            Lectures.remove({name:req.body.user}, {safe:true}, function(err){if(err){console.log(err);}});
        } else if(req.body.delete === "list" && req.body.submit === "OK") {
            console.log(req.body.submit);
            console.log(req.body.delete);
            console.log(req.body.Code);
            Classes.remove({lecCode:req.body.Code}, {safe:true}, function(err){if(err){cosole.log(err);}});
        } else if(req.body.delete === "accts" && req.body.submit === "OK") {
            console.log(req.body.submit);
            console.log(req.body.delete);
            console.log(req.body.Code);
            Accounts.remove({user:req.body.user}, {safe:true}, function(err){if(err){cosole.log(err);}});
	}
	Lectures.find({}, function(err,lecs) {
	    Classes.find({}, function(err,docs) {
		var leclist = [];
		REC.setLecList(docs,leclist);
		Access.find({}, function(err,docs) {
		    AM.getAllRecords( function(e, accounts) {
			if(!e) {
			    res.render('admin', { title : 'Administration', accts:accounts,
			        logs: docs, lecs: lecs, leclist: leclist } );
			} else {
			    res.send('accounts not found', 400);
			}
			})
			})
		    })
		});
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
