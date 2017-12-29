/* IMPORT EXTERNAL REFERENCES */
import { CountryCodeApi } from './api/country-code-service/country-code-service';
import { StaticContentProvider } from './common/staticContent';
import { ErrorHandler } from './common/errorHandler';
import { LogProvider } from './common/logProvider';
import { AuthenticationProvider } from './common/authenticationProvider';

/* INITIALIZE RESTIFY */
const restify = require('restify')
const config = require('config')

let server = restify.createServer()
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

/*
    Now that we have restify initialized
    Setup all hooks that should fire before any request is processed
    Order of declaration in this file matters
*/
/* AUTHENTICATION HOOK FIRST */
let authProvider = new AuthenticationProvider(server);
authProvider.pre();

/* LOGGING HOOK */
let logProvider = new LogProvider(server);
logProvider.pre();

/*
    Setup any APIs here
*/
/* COUNTRY CODE API HOOK */
let countryCodeApi = new CountryCodeApi(server);
countryCodeApi.init();

/*
    Allow restify to serve static content if desired
    Leave this section out if you do not plan to serve any static content
*/
/* SERVE STATIC CONTENT SUCH AS .JS, .CSS, .HTML, .JPG */
let staticContentProvider = new StaticContentProvider(server);
staticContentProvider.init();

/*
    This section defines all the error handlers
*/
/* ERROR HANDLING HOOK */
let errorHandler = new ErrorHandler(server);
errorHandler.init();

/* START LISTENING FOR REQUESTS */
let thePort = config.apiPort || config.PORT;
if (config.production === true) {
    thePort = process.env.PORT || thePort;
}
server.listen(thePort, () => {
    console.log('%s listening at %s', server.name, server.url)
})

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