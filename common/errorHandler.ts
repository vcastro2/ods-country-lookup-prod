import { CountryCodeResponseModel } from '../models/CountryCodeResponseModel';

export class ErrorHandler {

    constructor(private server: any) {}

    init() {

        const defaultMessage: CountryCodeResponseModel = {
            data: [],
            code: -1
        }
        this.server.on('InternalError', (req, res, err, cb) => {
            console.log('Internal Error:' + err);
            res.send(500, defaultMessage);
        });
        this.server.on('InternalServerError', (req, res, err, cb) => {
            console.log('Internal Server Error:' + err);
            res.send(500, defaultMessage);
        });
        this.server.on('restifyError', (req, res, err, cb) => {
            console.log('Restify Error:' + JSON.stringify(err));
            res.send(500, defaultMessage);
        });
        this.server.on('uncaughtException', (req, res, route, err) => {
            console.log('Uncaught Exception:' + err);
            res.send(500, defaultMessage);
            return;
        });
        
                
    }

}