export class LogProvider {

    constructor(private server: any) {}

    pre() {

        // TODO: Log Request
        this.server.pre((req, res, next) => {
            // Mock Logging
            return next();
        })

    }
}