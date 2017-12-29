"use strict";
exports.__esModule = true;
var ErrorHandler = /** @class */ (function () {
    function ErrorHandler(server) {
        this.server = server;
    }
    ErrorHandler.prototype.init = function () {
        var defaultMessage = {
            data: [],
            code: -1
        };
        this.server.on('InternalError', function (req, res, err, cb) {
            console.log('Internal Error:' + err);
            res.send(500, defaultMessage);
        });
        this.server.on('InternalServerError', function (req, res, err, cb) {
            console.log('Internal Server Error:' + err);
            res.send(500, defaultMessage);
        });
        this.server.on('restifyError', function (req, res, err, cb) {
            console.log('Restify Error:' + JSON.stringify(err));
            res.send(500, defaultMessage);
        });
        this.server.on('uncaughtException', function (req, res, route, err) {
            console.log('Uncaught Exception:' + err);
            res.send(500, defaultMessage);
            return;
        });
    };
    return ErrorHandler;
}());
exports.ErrorHandler = ErrorHandler;
