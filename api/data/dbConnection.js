var MongoClient = require('mongodb').MongoClient;
var dbUrl = 'mongodb://localhost:27017/meanhotel';
var _connection = null;

var open = () => {
    // to set connection to database
    MongoClient.connect(dbUrl, (error, client) => {
        if(error){
            console.log('Databasse connection is failed');
            return;
        }
        _connection = client;    
        console.log('DB connection is made');
    });
}

var get = () => {
    // to get the database
    return _connection;
}

module.exports = {
    open : open,
    get : get
};