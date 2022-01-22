const express = require('express');
var app = express();
var port = 9999;

function getRoot(request, response) {
    response.sendFile(path.resolve(__dirname +'/dist/FantasyBook/index.html'));
 }

 function getUndefined(request, response) {
     response.sendFile(path.resolve(__dirname + '/dist/FantasyBook/index.html'));
 }


 app.use(express.static(__dirname + '/dist/FantasyBook'));

 app.get('/', getRoot);
 app.get('/*', getUndefined);

 // Start server
 const PORT = process.env.PORT || 8080;
 var server = app.listen(PORT, function () {
     console.log("app running on port.", server.address().port);
 });