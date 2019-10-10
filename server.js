var uuid = require('uuid');
var bluebird = require('bluebird');
var connectionString = ('postgres://mrikelctdoichh:c7e5955d89d75e3af7d8ab6e8037a9b1a37370477207b092175de425087faed1@ec2-176-34-183-20.eu-west-1.compute.amazonaws.com:5432/d2siu1ipm9dhqj');

const pg = require('pg');
console.log('Thats me');

// monkey patch pg.Client.query to console.log for testing purposes only
// I just want to log all the queries to the console as the happen along with a
// 'clientId' so we can test simultaneous clients later.
var _query = pg.Client.prototype.query;
pg.Client.prototype.query = function(queryText) {
    if (!this.clientId) { //attach a clientId to keep track of these guys
        this.clientId = uuid.v4();
    }

    console.log(this.clientId + ': ' + queryText);

    //call the original query
    _query.apply(this, arguments);
};

// promisify the pg library. This takes avery method and makes a promise
// version with the work 'Async' on the end.
// e.g. query(string, callback) becomes queryAsync(string) : Promise
bluebird.promisifyAll(pg);

// open a connection, asyncronously, attaching a special 'disposer' to that it
// can be cleaned up automatically later in a 'using' block.
function getConnection() {

    var close;
    return pg.connectAsync(connectionString).spread(function(client, done) {
        close = done;
        return client;
    }).disposer(function(client) {

        console.log('Cleaning up client #:' + client.clientId || 'no client id')

        //close the connection
        if (close) close(client);
    });
}

// this mosule exposes a function named getConnection(). Future additions
// might be things like startTransaction()
module.exports = {
    getConnection: getConnection
}
