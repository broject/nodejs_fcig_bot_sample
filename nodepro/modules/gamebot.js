exports.init = function (server, app) {
    var uuidv4 = require('uuid/v4');
    var socketio = require('socket.io');
    var io = socketio(server, { origins: '*:*'/*, path: '/bot', cookie: false, serveClient: false*/ });
    //> zypper -n in redis
    //> redis-server --daemonize yes
    //> redis-cli ping
    const redis = require('socket.io-redis');
    io.adapter(redis({ host: 'localhost', port: 6379 }));
    var nsp = io.of('/bot');
    var redis_cache_server = require("redis");
    var nsp_cache = redis_cache_server.createClient();
    nsp.on('connection', function (socket) {
        socket.emit('detect', /* accept to client */
            { uuid: uuidv4() }
        );

        socket.on('context', function (data) { /* sending profile to room */
            var roomId = data.context;
            nsp_cache.set(socket.id, JSON.stringify(data));
            socket.join(roomId);
            nsp.in(roomId).clients((err, clients) => {
                console.log('nsp.in(' + roomId + ').clients is ', clients.length, 'connected.');
                clients.forEach(function (socketId) {
                    //let csocket = nsp.connected[socketId];//io.sockets.sockets[socketId]
                    nsp_cache.get(socketId, function (err, reply) {
                        let cdata = JSON.parse(reply);
                        cdata.clientsLength = clients.length;
                        nsp.to(roomId).emit('gameplay', cdata);
                    });
                });
            });
        });

        socket.on('gameplay', function (data) {
            var roomId = data.context;
            nsp.in(roomId).clients((err, clients) => {
                data.clientsLength = clients.length;
                nsp.to(roomId).emit('gameplay', data);
            });
        });

        socket.on('disconnect', function () {
            nsp_cache.get(socket.id, function (err, reply) {
                let cdata = JSON.parse(reply);
                var roomId = cdata.context;
                nsp.in(roomId).clients((err, clients) => {
                    cdata.clientsLength = clients.length;
                    cdata.partner_closed = cdata.player_id;
                    socket.to(roomId).emit('gameplay', cdata);
                    console.log('Disconnected::', cdata.context, cdata.player_id);
                });
            });
        });
    });
};