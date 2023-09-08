/* Name: Laurence Goh Ming Shen
Class : DIT/FT/1B/03
Admin num : 2220327 */

var express = require('express');
var serveStatic = require('serve-static');
var app = require('./controller/app.js');

var port = 8081;

app.use(serveStatic(__dirname + '/public')); 

var server = app.listen(port, function(){
    console.log('Web App Hosted at http://localhost:%s', port);
});