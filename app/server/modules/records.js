var REC = {};
var mongoose = require('mongoose');
var mongoUri = process.env.MONGOLAB_URI ||
		process.env.MONGOHQ_URL ||
	    'mongodb://localhost/login';
/* heroku */
//var db = mongoose.createConnection();
/* heroku */
var db = mongoose.createConnection('localhost', 'yatt');
var Schema = mongoose.Schema;
/* heroku */
//db.open(mongoUri,function(err){
//	if(err){
//	    console.error(err);
//	    process.exit(1);
//	}
//    });
/* heroku */

/* Access */
var accessSchema = new mongoose.Schema({ name: { type: String, required: true },
			    login:{ type: Boolean, required: true },
					 date: { type: Date, default: Date.now } });
var Access = db.model('Access', accessSchema);
/* Lecture */
var fixlecSchema = new mongoose.Schema( { week:{type:Number,required:true}, time:{ type:Number, required: true },
                                     lecCode: { type: String, required: true } } );
var lecturesSchema = new mongoose.Schema( 
			    { name: { type:String,required:true}, lecs:[fixlecSchema], events:[fixlecSchema],
				       date: { type: Date, default: Date.now } } );
var Lectures = db.model('Lectures', lecturesSchema);
/* Class */
var fixcontentSchema = new mongoose.Schema({name:{type:String,required:true}, date:{type:Date,default:Date.now}});
var fixgroupSchema = new mongoose.Schema( {name:{type: String,required: true}, classes:[fixcontentSchema]});
var classSchema = new mongoose.Schema( { lecCode: { type: String, required: true },
				    title: { type: String,required: true },
                                    lang: { type: String, required: true },
				    author: { type: String, required: true },
				    group: [fixgroupSchema], objective: { type: String, required: true },
				    textbook:{ type:String,required:true },
				    reference:{type: String,required:true },
				    advreference: { type: String, required: true },
				    date: { type: Date, default: Date.now } } );
var Classes = db.model('Classes', classSchema);
/* Contents */
var fixitemsSchema = new mongoose.Schema({name:{type:String,required:true}, video: {type: String}, picture: {type: String},
    items: [fixitemsSchema], date:{type:Date,default:Date.now}});
var fixpageSchema = new mongoose.Schema({name:{type:String,required:true}, video: {type: String}, picture: {type: String},
    groups: [fixitemsSchema], date:{type:Date,default:Date.now}});

var contentsSchema = new mongoose.Schema( { cntCode: { type:String,required: true }, lang: {type:String, required: true },
					    title: { type: String, required: true }, sign: {type:Number,required:true},
					    author: { type: String, required: true },
					    url: { type: String }, menu: [contentsSchema], pages: [fixpageSchema] });

var Contents = db.model('Contents',contentsSchema);
module.exports = REC;

REC.saveRecord = function(name,login_flag,callback) {
    var access = new Access();
    access.name = name;
    access.login = login_flag;
    access.save(callback);
    return Access;
  };
REC.getAccess = function() {
    var accessSchema = new mongoose.Schema({ name: { type: String, required: true },
				    login:{ type: Boolean, required: true },
					     date: { type: Date, default: Date.now }});
    var Access = db.model('Access', accessSchema);
    return Access;
  };
REC.saveRecord2 = function(mongoose,name,login_flag,save_flag,callback) {
    var access = new Access();
    access.name = name;
    access.login = login_flag;
    if(save_flag) access.save(callback);
    return Access;
  };
REC.findRecord = function(mongoose,Access,name) {
    Access.find({name:name}, function(err,docs) {
	for(var i=0, size=docs.length; i<size; ++i) {
	    console.log(docs[i].name+'['+docs[i].login+']'+docs[i].date);
	}
    });
  };
REC.saveLectures = function(name,callback) {
    var lecs = [ {week: 0, time: 1, lecCode: "HOSE0001"}, {week: 1, time: 0, lecCode: "CHIT0002"},
		 {week: 1, time: 1, lecCode: "CHIT0002"}, {week: 1, time: 2, lecCode: "CHIT0002"},
		 {week: 1, time: 1, lecCode: "CHIT0002"}, {week: 2, time: 1, lecCode: "HOIE0003"} ];
    var lectures = new Lectures();
    lectures.name = name;
    lectures.lecs = lecs;
    lectures.events = [];
    lectures.save(callback);
    return Lectures;
  };
/*
REC.saveClasses = function(mongoose,name,callback) {
    var fixgroupSchema = new Schema( { name: { type: String, required: true }, classes: [fixcontentSchema] } );
    var classSchema = new Schema( { lecCode: { type: String, required: true },title: { type: String,required:true },
                                    lang: { type: String, required: true },
				    author: { type: String, required: true },
				    group: [fixgroupSchema], objective: { type: String, required: true },
				    textbook: { type: String, required: true },
				    reference: { type: String, required: true },
				    advreference: { type: String, required: true },
				    date: { type: Date, default: Date.now } } );
    var Classes = db.model('Classes', classSchema);
    var classes = new Classes();
    classes.lecCode = "CHIT0002";
    classes.group = [ { name: "Introduction", classes: [ { name: "Introduction" } ] },
		      { name: "HowToUseEMail", classes: [ { name: "HowToUseEMail"} ] },
                      { name: "AboutDocumentProcessing", classes: [ { name: "DcomentProcessing" },
			    { name: "No1DocumentProcessing" }, { name: "No2DocumentProcessing" } ] },
			    { name: "HowToUsePowerPoint", classes: [ { name: "No1PowerPoint" },
			    { name: "No2PowerPoint" } ] },
		      { name: "HowToUseExcel", classes: [ { name: "No1Excel" }, { name: "No2Excel" },
			    { name: "No3Excel" },{ name: "No4Excel" }, { name: "No5Excel" },
			    { name: "No6Excel"}, { name: "No7Excel"} ] } ];
    classes.title = "Basic Informatics";
    classes.lang = "en";
    classes.objective = "You can learn about basic operations of PC.";
    classes.reference = "Searching";
    classes.advreference = "Searching";
    classes.textbook = "Searching";
    classes.save(callback);
    return Classes;
  };
 */
REC.saveClasses = function(mongoose,name,callback) {
    var classes = new Classes();
    classes.lecCode = "HOIE0003";
    classes.group = [ { name: "はじめに", classes: [ { name: "はじめに" } ] },
		      { name: "メールの使い方", classes: [ { name: "メールの使い方"} ] },
                      { name: "文書処理について", classes: [ { name: "文書処理" },{ name: "(1)文書処理" }, 
				{ name: "(2)文書処理" } ] },
		      { name: "パワーポイントの使い方", classes: [ { name: "(1)パワーポイントの使い方" },
								   { name: "(2)パワーポイントの使い方" } ] },
		      { name: "エクセルの使い方", classes: [ { name: "(1)エクセル" }, { name: "(2)エクセル" }, 
				{ name: "(3)エクセル" }, { name: "(4)エクセル" }, { name: "(5)エクセル" },
				{ name: "(6)エクセル"}, { name: "(7)エクセル"} ] } ];
    classes.title = "情報学基礎";
    classes.lang = "ja";
    classes.author = name;
    classes.objective = "この講義では簡単な<br>PCの使い方を説明する。";
    classes.reference = "検討中";
    classes.advreference = "検討中";
    classes.textbook = "検討中";
    classes.save(callback);
    return Classes;
  };

REC.newClasses = function(lecCode,name,callback) {
    var classes = new Classes();
    classes.lecCode = lecCode;
    classes.author = name;
    classes.group = [ { name: "はじめに", classes: [ { name: "はじめに" } ] },
		      { name: "メールの使い方", classes: [ { name: "メールの使い方"} ] },
                      { name: "文書処理について", classes: [ { name: "文書処理" },{ name: "(1)文書処理" }, 
		      { name: "(2)文書処理" } ] } ];
    classes.title = "New";
    classes.lang = "ja";
    classes.objective = "この講義では簡単なPCの使い方を説明する。";
    classes.reference = "検討中";
    classes.advreference = "検討中";
    classes.textbook = "検討中";
    classes.save(callback);
    return Classes;
  };

REC.newContents = function(cntCode,name,url,callback) {
    var contents = new Contents();
    contents.cntCode = cntCode;
    contents.author = name;
    contents.title = 'New';
    contents.url = url;
    contents.menu = [];
    contents.pages = [];
    contents.sign = 0;
    contents.lang = 'ja';
    contents.save(callback);
    return Contents;
  };

REC.getLectures = function() {
    return Lectures;
};

REC.getContents = function() {
    return Contents;
};

REC.getClasses = function() {
    return Classes;
};

REC.setLecList = function(docs,leclist) {
    var i=0;
    docs.forEach(function(f) {
	    leclist[i++] = { lecCode: f.lecCode, title: f.title, author: f.author, lang: f.lang, date: f.date };
	});
};

REC.setLecCode = function(docs,lecs) {
    for(var i=0; i<30; i++) lecs[i]="";
    docs[0].lecs.forEach(function(f) {
	lecs[f.week*5+f.time] = f.lecCode;
	});
};

REC.findHome = function(user,id,res) {
    Lectures.find({name:user}, function(err,docs) {
	if(docs[0]==undefined) {
	    res.render('404', {title: 'Page Not Found'});
	} else {
	    var lecs = [];
	    for(var i=0; i<30; i++) lecs[i]={ name: "", lecCode: "" };
	    Classes.find({author:user}, function(err,d) {
		if(d[0]==undefined) {
		    docs[0].lecs.forEach(function(f) {
			lecs[f.week*5+f.time] = { name: 'None', lecCode: f.lecCode };
			});
		} else {
		    docs[0].lecs.forEach(function(f) {
			var n = 'None';
			for(i=0;i<d.length;i++)
			    if(d[i].lecCode==f.lecCode) {
				n = d[i].title;
			    }
			    lecs[f.week*5+f.time] = { name:n, lecCode:f.lecCode };
			});
		}
		res.render('home', { message: 'New User:'+user,
		    name: user, id: id, lecs: lecs, 
		    title: "Welcome to YaTT by "+ user });
		});
	}
	});
};

REC.findLogin = function(user,id,res) {
    Lectures.find({name:user}, function(err,docs) {
	if(docs[0]==undefined) {
	    res.render('404', {title: 'Page Not Found'});
	} else {
	    var lecs = [];
	    for(var i=0; i<30; i++) lecs[i]={ name: "", lecCode: "" };
	    Classes.find({author:user}, function(err,d) {
		if(d[0]==undefined) {
		    docs[0].lecs.forEach(function(f) {
			lecs[f.week*5+f.time] = { name: 'None', lecCode: f.lecCode };
			});
		} else {
		    docs[0].lecs.forEach(function(f) {
			var n = 'None';
			for(i=0;i<d.length;i++)
			    if(d[i].lecCode==f.lecCode) {
				n = d[i].title;
			    }
			    lecs[f.week*5+f.time] = { name:n, lecCode:f.lecCode };
			});
		}
		res.render('login', { message: 'New User:',
		    name: user, id: id, lecs: lecs, title: "Welcome to YaTT - Please Login To Your Account" });
		});
	}
	});
};

REC.setLecCode0 = function(user,docs,l,res) {
    for(var i=0; i<30; i++) l[i]={ name: "", lecCode: "" };
    Classes.find({author:user}, function(err,d) {
        if(d[0]==undefined) {
	    res.render('404', {title: 'Page Not Found'});
	    //	    docs[0].lecs.forEach(function(f) {
	    //		    l[f.week*5+f.time] = { name: 'None', lecCode: f.lecCode };
	    //		});
	} else {
	    docs[0].lecs.forEach(function(f) {
	    	var n = 'None';
		for(i=0;i<d.length;i++)
		    if(d.lecCode==f.lecCode) {
			n = f.title;
			//			l[f.week*5+f.time] = { name: n, lecCode: f.lecCode };
			l[f.week*5+f.time] = { name: 'kodama', lecCode: 'kodama' };
		    }
		});
	}
        return l;
	});
};

REC.findEdit = function(user,id, res) {
    Lectures.find({name:user}, function(err,docs) {
    var lecs = [];
    REC.setLecCode(docs,lecs);
    var Classes = REC.getClasses();
    Classes.find({}, function(err,docs) {
	var leclist = [];
	REC.setLecList(docs,leclist);
	res.render('edit', { message: 'Edit mode!', name: user, id: id,
	    lecs: lecs, leclist: leclist, title: "Welcome to YaTT by "+ user });
	});
	});
};

REC.findLecture = function(Code,user,id,res) {
    var Classes = REC.getClasses();
    Classes.find({lecCode:Code}, function(err,docs) {
	if(docs[0]==undefined) {
	    res.render('404', {title: 'Page Not Found'});
	} else {
	    res.render('lecture', { message: 'Lecture mode!', name: user,
		id: id, cls: docs[0], title: "Welcome to YaTT by "+ user });
	}
	});
}
