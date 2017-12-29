"use strict";
exports.__esModule = true;
var LogProvider = /** @class */ (function () {
    function LogProvider(server) {
        this.server = server;
    }
    LogProvider.prototype.pre = function () {
        // TODO: Log Request
        this.server.pre(function (req, res, next) {
            // Mock Logging
            return next();
        });
    };
    return LogProvider;
}());
exports.LogProvider = LogProvider;
