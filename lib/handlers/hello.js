const helloHandler = (req, callback) => {
    callback(200, { message: 'Hello world' });
}

module.exports = helloHandler
