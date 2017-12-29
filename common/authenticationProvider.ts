export class AuthenticationProvider {

    constructor(private server: any) {}

    pre() {

        // TODO: Authenticate User
        this.server.pre((req, res, next) => {
            // Mock Authentication by requiring a Header with "Authorization": "Bearer: XXXYYY"
            // res.send(401, msg);
            // Up in the top of this file we will have import auth = require('./path to file')
            // if(!auth.isAuthenticated(req)) { fail this request, log it? }
            return next();
        })
        
    }

}
