const http = require('http');
const url = require('url');
const { StringDecoder } = require('string_decoder');

const config = require('./lib/config');
const router = require('./lib/router');
const notFoundHandler = require('./lib/handlers/notFound');

const requestHandler = (req, res) => {

    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');
    const queryString = parsedUrl.query;
    const method = req.method.toLowerCase();
    const headers = req.headers;

    const decoder = new StringDecoder('utf-8');

    let bodyBuffer = ''

    req.on('data', (data) => {
        bodyBuffer += decoder.write(data);
    })

    req.on('end', () => {
        bodyBuffer += decoder.end();

        const handler = typeof router[path] !== 'undefined' ? router[path] : notFoundHandler;

        const data = {
            path,
            method,
            headers,
            query: queryString,
            body: bodyBuffer
        };

        handler(data, (code = 200, data) => {
            payload = JSON.stringify(typeof data === 'object' ? data : {});
            res.writeHeader(code);
            res.end(payload);
            console.log(`${method.toUpperCase()} ${path}`);
        });
    })
}

const server = http.createServer(requestHandler);

server.listen(config.port, () => {
    console.log(`The server is listening on port ${config.port}`);
});
