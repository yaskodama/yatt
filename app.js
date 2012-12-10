/**
 * Node.js Login Boilerplate
 * Author : Stephen Braitsch
 * More Info : http://bit.ly/LsODY8
 */
var http = require('http')
var exp = require('express');
var app = exp.createServer();

app.root = __dirname;
global.host = 'localhost';



require('./app/config')(app, exp);
require('./app/server/router')(app);

/*
app.listen(8080, function(){
	console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
*/

http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
