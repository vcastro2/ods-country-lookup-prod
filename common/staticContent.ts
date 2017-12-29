const restify = require('restify')
const fs = require('fs')

export class StaticContentProvider {

    constructor(private server: any) {}

    public init() {

        /* Following functions are all default for serving static content such as html, js, css, jpg */
        this.server.get('/\/.*/', restify.plugins.serveStatic({
            directory: __dirname + '/dist/',
            default: './index.html'
        }))

        this.server.get('/', function indexHTML(req, res, next) {
            fs.readFile(__dirname + '/dist/index.html', function (err, data) {
                if (err) {
                    next(err)
                    return
                }

                res.setHeader('Content-Type', 'text/html')
                res.writeHead(200)
                res.end(data)
                next()
            })
        })

    }

}