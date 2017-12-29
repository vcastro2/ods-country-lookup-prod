"use strict";
exports.__esModule = true;
/* IMPORT EXTERNAL REFERENCES */
var country_code_service_1 = require("./api/country-code-service/country-code-service");
var staticContent_1 = require("./common/staticContent");
var errorHandler_1 = require("./common/errorHandler");
var logProvider_1 = require("./common/logProvider");
var authenticationProvider_1 = require("./common/authenticationProvider");
/* INITIALIZE RESTIFY */
var restify = require('restify');
var config = require('config');
var server = restify.createServer();
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
/*
    Now that we have restify initialized
    Setup all hooks that should fire before any request is processed
    Order of declaration in this file matters
*/
/* AUTHENTICATION HOOK FIRST */
var authProvider = new authenticationProvider_1.AuthenticationProvider(server);
authProvider.pre();
/* LOGGING HOOK */
var logProvider = new logProvider_1.LogProvider(server);
logProvider.pre();
/*
    Setup any APIs here
*/
/* COUNTRY CODE API HOOK */
var countryCodeApi = new country_code_service_1.CountryCodeApi(server);
countryCodeApi.init();
/*
    Allow restify to serve static content if desired
    Leave this section out if you do not plan to serve any static content
*/
/* SERVE STATIC CONTENT SUCH AS .JS, .CSS, .HTML, .JPG */
var staticContentProvider = new staticContent_1.StaticContentProvider(server);
staticContentProvider.init();
/*
    This section defines all the error handlers
*/
/* ERROR HANDLING HOOK */
var errorHandler = new errorHandler_1.ErrorHandler(server);
errorHandler.init();
/* START LISTENING FOR REQUESTS */
var thePort = config.apiPort || config.PORT;
if (config.production === true) {
    thePort = process.env.PORT || thePort;
}
server.listen(thePort, function () {
    console.log('%s listening at %s', server.name, server.url);
});
/*

SELECT gid, fips, iso2, iso3, un, name, area, pop2005, region, subregion, lat, lon
            FROM public.borders
            WHERE st_intersects(
                    st_geographyfromtext('SRID=4326;POLYGON((-98 30,-99 31,-100 32,-98 30))'::text), borders.geom::geography)
                    
            ORDER BY name

SELECT gid, fips, iso2, iso3, un, name, area, pop2005, region, subregion, lat, lon
            FROM public.borders
            WHERE st_distance(
                st_Centroid(
                    st_geographyfromtext('SRID=4326;POLYGON((-98 30,-109 1,-100 2,-98 30))'::text)), borders.geom::geography)
                    
            ORDER BY name

SELECT gid, fips, iso2, iso3, un, name, area, pop2005, region, subregion, lat, lon,
    st_Centroid(geom) as center,
    st_distance(
        st_Centroid(geom),
        st_Centroid(st_geographyfromtext('SRID=4326;POLYGON((108 53,119 45,110 42,108 53))'::text))
    ) as distance
FROM public.borders

WHERE st_intersects(
        st_geographyfromtext('SRID=4326;POLYGON((108 53,119 45,110 42,108 53))'::text), borders.geom::geography
)
order by distance

*/ 
