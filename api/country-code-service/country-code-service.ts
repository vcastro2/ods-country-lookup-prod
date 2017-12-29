import { CountryCodeResponseModel } from '../../models/CountryCodeResponseModel';

const config = require('config')
const { Client, Pool } = require('pg')
const client = new Client()

/*
    TODO: Refactor to take raw WKT style strings instead of parsing and conditioning strings
            Refactor to handle a primary country and secondary countries. Primary based on centroid
*/

export class CountryCodeApi {

    constructor(private server: any) {}

    public init() {

        this.server.get(config.apiPrefix + 'countries', (req, res, next) => {

            //TODO: Singleton DB Client/Pool
            const client = new Client({
                user: config.user,
                host: config.host,
                database: config.database,
                password: config.password ? config.password : null,
                port: config.dbPort,
                })
            
            client.connect()
            
            client.query('SELECT gid, fips, iso2, iso3, un, name, area, pop2005, region, subregion, lat, lon FROM public.borders ORDER BY name', (err, results) => {
                console.log(err ? err.stack : results.rows[0]) // Hello World!
                client.end()
                let output: CountryCodeResponseModel = {
                    data: results.rows,
                    code: 0
                };
        
                res.send(output)
                return next()
            })
                        
        })
        
        this.server.post(config.apiPrefix + 'countries', (req, res, next) => {
        
            // TODO: Validate Parameters
            let wkt = req.body['wkt']
            
            if (!wkt  ||  wkt.length < 1) {
                return next(new Error())
            }
        
            let operation = 'POINT'
            if (wkt.indexOf(',') > 0) {
        
                const points = wkt.split(',')
                if (points.length === 2) {
                    operation = 'LINESTRING'
                } else {
                    operation = 'POLYGON'
                }
        
            }
        
            // 30.000000 -98.000000 
            if (!this.isValidPoints(wkt)) {
                return next(new Error())
            }
            console.log(wkt)
        
            // TODO: Utility Conditioners
            let wktConditioned = this.conditionPoints(wkt)
            if (operation === 'POLYGON') {
                wktConditioned = '(' + wktConditioned + ')'
            }
            console.log(wktConditioned)
        
            console.log('Looking for Point: ' + wktConditioned)
        
            // TODO: Singleton Database connectivity and query
            const client = new Client({
                user: config.user,
                host: config.host,
                database: config.database,
                password: config.password ? config.password : null,
                port: config.dbPort,
                })
            
            client.connect()
            
            client.query(`SELECT gid, fips, iso2, iso3, un, name, area, pop2005, region, subregion, lat, lon 
                FROM public.borders 
                WHERE st_intersects(st_geographyfromtext('SRID=4326;${operation}(${wktConditioned})'::text), borders.geom::geography)
                ORDER BY name`
                , (err, results) => {
                    // TODO: Defensive Coding e.g. no results, no rows
                console.log(err ? err.stack : results.rows[0])
                client.end()
                let output: CountryCodeResponseModel = {
                    data: err ? err.message : results.rows,
                    code: err ? err.code : 0
                };
        
                res.send(output)
                return next()
            })
        })
        
    }

    private conditionPoints(wkt: string): string {
        
        if (!this.isValidPoints(wkt)) {
            return '';
        }
        let output = '';
        const points = wkt.split(',');
        points.forEach((pointText) => {
            if (output) {
                output += ',';
            }
            pointText = pointText.trim()
            let point = pointText.split(' ')
            let lon = point[0]
            let lat = point[1]
            output += lat + ' ' + lon;
        })
    
        return output;
        
    
    }
        
    private isValidPoints(wkt: string): boolean {
        let valid = true;
        
        const points = wkt.split(',');
        points.forEach((pointText) => {
    
            pointText = pointText.trim()
            // TODO: Test for space in string part
    
            let point = pointText.split(' ')
            let lat = point[0]
            let lon = point[1]
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
        })
    
        return valid;
        
    }
        

}