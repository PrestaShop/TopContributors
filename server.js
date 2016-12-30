var http = require('http');
var fs = require('fs');

http.createServer(function (request, response) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Request-Method', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET');
    response.setHeader('Access-Control-Allow-Headers', '*');

    response.writeHead(200)
    fs.createReadStream('contributors.js').pipe(response)
}).listen(9615);
