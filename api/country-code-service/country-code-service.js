"use strict";
exports.__esModule = true;
var config = require('config');
var _a = require('pg'), Client = _a.Client, Pool = _a.Pool;
var client = new Client();
/*
    TODO: Refactor to take raw WKT style strings instead of parsing and conditioning strings
            Refactor to handle a primary country and secondary countries. Primary based on centroid
*/
var CountryCodeApi = /** @class */ (function () {
    function CountryCodeApi(server) {
        this.server = server;
    }
    CountryCodeApi.prototype.init = function () {
        var _this = this;
        this.server.get(config.apiPrefix + 'countries', function (req, res, next) {
            //TODO: Singleton DB Client/Pool
            var client = new Client({
                user: config.user,
                host: config.host,
                database: config.database,
                password: config.password ? config.password : null,
                port: config.dbPort
            });
            client.connect();
            client.query('SELECT gid, fips, iso2, iso3, un, name, area, pop2005, region, subregion, lat, lon FROM public.borders ORDER BY name', function (err, results) {
                console.log(err ? err.stack : results.rows[0]); // Hello World!
                client.end();
                var output = {
                    data: results.rows,
                    code: 0
                };
                res.send(output);
                return next();
            });
        });
        this.server.post(config.apiPrefix + 'countries', function (req, res, next) {
            // TODO: Validate Parameters
            var wkt = req.body['wkt'];
            if (!wkt || wkt.length < 1) {
                return next(new Error());
            }
            var operation = 'POINT';
            if (wkt.indexOf(',') > 0) {
                var points = wkt.split(',');
                if (points.length === 2) {
                    operation = 'LINESTRING';
                }
                else {
                    operation = 'POLYGON';
                }
            }
            // 30.000000 -98.000000 
            if (!_this.isValidPoints(wkt)) {
                return next(new Error());
            }
            console.log(wkt);
            // TODO: Utility Conditioners
            var wktConditioned = _this.conditionPoints(wkt);
            if (operation === 'POLYGON') {
                wktConditioned = '(' + wktConditioned + ')';
            }
            console.log(wktConditioned);
            console.log('Looking for Point: ' + wktConditioned);
            // TODO: Singleton Database connectivity and query
            var client = new Client({
                user: config.user,
                host: config.host,
                database: config.database,
                password: config.password ? config.password : null,
                port: config.dbPort
            });
            client.connect();
            client.query("SELECT gid, fips, iso2, iso3, un, name, area, pop2005, region, subregion, lat, lon \n                FROM public.borders \n                WHERE st_intersects(st_geographyfromtext('SRID=4326;" + operation + "(" + wktConditioned + ")'::text), borders.geom::geography)\n                ORDER BY name", function (err, results) {
                // TODO: Defensive Coding e.g. no results, no rows
                console.log(err ? err.stack : results.rows[0]);
                client.end();
                var output = {
                    data: err ? err.message : results.rows,
                    code: err ? err.code : 0
                };
                res.send(output);
                return next();
            });
        });
    };
    CountryCodeApi.prototype.conditionPoints = function (wkt) {
        if (!this.isValidPoints(wkt)) {
            return '';
        }
        var output = '';
        var points = wkt.split(',');
        points.forEach(function (pointText) {
            if (output) {
                output += ',';
            }
            pointText = pointText.trim();
            var point = pointText.split(' ');
            var lon = point[0];
            var lat = point[1];
            output += lat + ' ' + lon;
        });
        return output;
    };
    CountryCodeApi.prototype.isValidPoints = function (wkt) {
        var valid = true;
        var points = wkt.split(',');
        points.forEach(function (pointText) {
            pointText = pointText.trim();
            // TODO: Test for space in string part
            var point = pointText.split(' ');
            var lat = point[0];
            var lon = point[1];
            /*if (!TestOutput.isNumeric(lat) || !TestOutput.isNumeric(lon)) {
                valid = false
                return false;
            }*/
            try {
                if (+lat < -90 || +lat > 90
                    || +lon < -180 || +lon > 180) {
                    valid = false;
                    return valid;
                }
            }
            catch (e) {
                valid = false;
                return false;
            }
        });
        return valid;
    };
    return CountryCodeApi;
}());
exports.CountryCodeApi = CountryCodeApi;
