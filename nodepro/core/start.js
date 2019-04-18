exports.run = function (credentials) {
    var express = require('express'), path = require('path'),
        http = require('http'), https = require('https');
    var app = new express();
    var server = null;

    if (credentials == undefined)
        server = http.createServer(app);
    else
        server = https.createServer(credentials, app);

    app.use(express.static('public'));

    var bot = require('../modules/gamebot');
    bot.init(server, app);

    return server;
};