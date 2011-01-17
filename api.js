(function () {
var express = require("express");

var HOST = "localhost";
var PORT = 27017;

var request = require('request'),
    sys = require('sys'),
    DB = require('mongodb/db').Db,
    Server= require('mongodb/connection').Server;

var working_collection = undefined;

var app = express.createServer();
var db = new DB('hackertrends', new Server(HOST, PORT, {auto_reconnect: true}, {}));
db.open(function () {});
db.collection('posts', function (error, post_collection) {
    if(!error) {
        working_collection = post_collection;
    }
});

sys.puts('starting server on localhost:8000...');



function getPosts (rank, callback) {
    var q = { "rank": { "$lte": parseInt(rank) } };
    var sort = { "sort":["rank","-age"] }
    working_collection.find(q, sort, function (err, cursor) {
        cursor.toArray( function (err, posts) {
            callback(posts);
        });
    });
}




app.get('/', function ( req, res ) {
    res.contentType('text/html');
    res.sendfile('index.html');
});

app.get('/get-posts/', function ( req, res ) {
    console.log(new Date());
    var query_rank = 30;
    if(req.query.rank) {
        query_rank = req.query.rank;
    }
    getPosts( query_rank,  function ( posts ) {
        res.contentType('application/javascript');
        res.send(posts);
    });
});



app.use(express.staticProvider(__dirname + '/static'));

app.listen(8000);
})();