(function () {

var app = require("express").createServer();

var HOST = "localhost";
var PORT = 27017;

var request = require('request'),
    sys = require('sys'),
    DB = require('mongodb/db').Db,
    Server= require('mongodb/connection').Server;

var working_collection = undefined;
var db = new DB('hackertrends', new Server(HOST, PORT, {auto_reconnect: true}, {}));
db.open(function () {});
db.collection('posts', function (error, post_collection) {
    if(!error) {
        working_collection = post_collection;
    }
});

sys.puts('starting server on localhost:8000...');



function getPosts (rank, callback) {
    var q = {rank: {"$lte":parseInt(rank)}};
    working_collection.find(q, function (err, cursor) {
        cursor.toArray( function (err, posts) {
            callback(posts);
        });
    });
}



app.get('/:rank', function( request, response ) {
    console.log('got a request');
    getPosts( request.params.rank,  function ( posts ) {
        console.log(posts);
        response.send("Hello world! " + posts.length.toString());
    });
});

app.listen(8000);
})();