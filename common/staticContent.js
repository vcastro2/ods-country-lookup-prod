"use strict";
exports.__esModule = true;
var restify = require('restify');
var fs = require('fs');
var StaticContentProvider = /** @class */ (function () {
    function StaticContentProvider(server) {
        this.server = server;
    }
    StaticContentProvider.prototype.init = function () {
        /* Following functions are all default for serving static content such as html, js, css, jpg */
        this.server.get('/\/.*/', restify.plugins.serveStatic({
            directory: __dirname + '/dist/',
            "default": './index.html'
        }));
        this.server.get('/', function indexHTML(req, res, next) {
            fs.readFile(__dirname + '/dist/index.html', function (err, data) {
                if (err) {
                    next(err);
                    return;
                }
                res.setHeader('Content-Type', 'text/html');
                res.writeHead(200);
                res.end(data);
                next();
            });
        });
    };
    return StaticContentProvider;
}());
exports.StaticContentProvider = StaticContentProvider;
