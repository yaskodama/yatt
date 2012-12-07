var REC = {};

module.exports = REC;

REC.saveRecord = function(mongoose,name,login_flag,callback) {
    var db = mongoose.createConnection('localhost', 'yatt');
    var Schema = mongoose.Schema;
    var accessSchema = new Schema({ name: { type: String, required: true },
				    login:{ type: Boolean, required: true },
				    date: { type: Date, default: Date.now } });
    var Access = db.model('Access', accessSchema);
    var access = new Access();
    access.name = name;
    access.login = login_flag;
    access.save(callback);
    return Access;
  };
REC.saveRecord2 = function(mongoose,name,login_flag,save_flag,callback) {
    var db = mongoose.createConnection('localhost', 'yatt');
    var Schema = mongoose.Schema;
    var accessSchema = new Schema({ name: { type: String, required: true },
				    login:{ type: Boolean, required: true },
				    date: { type: Date, default: Date.now } });
    var Access = db.model('Access', accessSchema);
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
REC.saveLectures = function(mongoose,name,callback) {
    var db = mongoose.createConnection('localhost', 'yatt');
    var Schema = mongoose.Schema;    
    var fixlecSchema = new Schema( { week:{type:Number,required:true}, time:{ type:Number, required: true },
                                     lecCode: { type: String, required: true } } );
    var lecturesSchema = new Schema( 
			    { name: { type:String,required:true}, lecs:[fixlecSchema], events:[fixlecSchema],
				       date: { type: Date, default: Date.now } } );
    var lecs = [ {week: 0, time: 1, lecCode: "HOSE0001"}, {week: 1, time: 0, lecCode: "CHIT0002"},
		 {week: 1, time: 1, lecCode: "CHIT0002"}, {week: 1, time: 2, lecCode: "CHIT0002"},
		 {week: 1, time: 1, lecCode: "CHIT0002"}, {week: 2, time: 1, lecCode: "HOIE0003"} ];
    var Lectures = db.model('Lectures', lecturesSchema);
    var lectures = new Lectures();
    lectures.name = name;
    lectures.lecs = lecs;
    lectures.events = [];
    lectures.save(callback);
    return Lectures;
  };

/*
REC.saveClasses = function(mongoose,name,callback) {
    var db = mongoose.createConnection('localhost', 'yatt');
    var Schema = mongoose.Schema;    
    var fixcontentSchema = new Schema( { name: { type: String, required: true }, 
					 date: { type: Date, default: Date.now } } );
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
    var db = mongoose.createConnection('localhost', 'yatt');
    var Schema = mongoose.Schema;    
    var fixcontentSchema = new Schema({name:{type:String,required:true},date:{type:Date,default:Date.now}});
    var fixgroupSchema = new Schema( {name:{type: String,required: true}, classes:[fixcontentSchema]});
    var classSchema = new Schema( { lecCode: { type: String, required: true },
				    title: { type: String,required: true },
                                    lang: { type: String, required: true },
				    author: { type: String, required: true },
				    group: [fixgroupSchema], objective: { type: String, required: true },
				    textbook:{ type:String,required:true },
				    reference:{type: String,required:true },
				    advreference: { type: String, required: true },
				    date: { type: Date, default: Date.now } } );
    var Classes = db.model('Classes', classSchema);
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

REC.newClasses = function(mongoose,lecCode,name,callback) {
    var db = mongoose.createConnection('localhost', 'yatt');
    var Schema = mongoose.Schema;    
    var fixcontentSchema = new Schema({name:{type:String,required:true},date:{type:Date,default:Date.now}});
    var fixgroupSchema = new Schema( { name: { type: String, required: true }, classes: [fixcontentSchema] } );
    var classSchema = new Schema( { lecCode: { type: String, required: true },title: {type: String,required:true },
                                    lang: { type: String, required: true },
				    author: { type: String, required: true },
				    group: [fixgroupSchema], objective: { type: String, required: true },
				    textbook:{ type:String,required:true }, reference:{ type:String,required:true },
				    advreference: { type: String, required: true },
				    date: { type: Date, default: Date.now } } );
    var Classes = db.model('Classes', classSchema);
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

/*
REC.updateClasses = function(Classes,req,callback) {
    Classes.update({lecCode:req.body.lecCode},
	{ $set: {title:req.body.title,objective:req.body.objective,reference:req.body.reference,advreference:req.body.advreference,
		 textbook: req.body.textbook } }, {upsert:false,multi:true}, callback );
    return Classes;
};
*/

REC.getLectures = function(mongoose) {
    var db = mongoose.createConnection('localhost', 'yatt');
    var Schema = mongoose.Schema;    
    var fixlecSchema = new Schema( { week: { type: Number, required: true },
				     time: { type: Number, required: true },
                                     lecCode: { type: String, required: true } } );
    var lecturesSchema = new Schema( { name: { type: String, required: true },
				      lecs: [fixlecSchema],
				      events: [fixlecSchema],
				       date: { type: Date, default: Date.now } } );
    var Lectures = db.model('Lectures', lecturesSchema);
    return Lectures;
};

REC.getClasses = function(mongoose) {
    var db = mongoose.createConnection('localhost', 'yatt');
    var Schema = mongoose.Schema;    
    var fixcontentSchema = new Schema({name:{type:String,required:true},date:{type:Date,default:Date.now}});
    var fixgroupSchema = new Schema({ name: { type: String, required: true }, classes: [fixcontentSchema] } );
    var classSchema = new Schema({lecCode: { type: String, required: true },title:{ type: String, required: true },
                                    lang: { type: String, required: true },
				    author: { type: String, required: true },
				    group: [fixgroupSchema], objective: { type: String, required: true },
			   textbook: { type: String, required: true }, reference: { type: String, required: true },
				    advreference: { type: String, required: true },
				    date: { type: Date, default: Date.now } } );
    var Classes = db.model('Classes', classSchema);
    return Classes;
};

REC.setLecList = function(docs,leclist) {
    var i=0;
    docs.forEach(function(f) {
	    leclist[i++] = { lecCode: f.lecCode, title: f.title, lang: f.lang, date: f.date };
	});
};

REC.setLecCode = function(docs,lecs) {
    for(var i=0; i<30; i++) lecs[i]="";
    docs[0].lecs.forEach(function(f) {
	    lecs[f.week*5+f.time] = f.lecCode;
	});
};
