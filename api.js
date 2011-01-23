var API = function (host, port) {

    var HOST = host ? host : "localhost";
    var PORT = port ? port : 27017;

    var express = require("express"),
        sys = require('sys'),
        DB = require('mongodb/db').Db,
        Server= require('mongodb/connection').Server;

    var posts_collection = undefined,
        words_collection = undefined;
    var app = express.createServer();
    var db = new DB('hackertrends', new Server(HOST, PORT, { auto_reconnect: true }, {}));

    app.use(express.staticProvider(__dirname + '/static'));

    db.open(function () {});

    db.collection('posts', function (error, collection) {
        if(!error) {
            posts_collection = collection;
        }
    });

    db.collection('words', function(error, collection){
        if(!error) {
            words_collection = collection;
        }
    });
    
    db.collection('word_dates', function(error, collection){
        if(!error) {
            words_dates = collection;
        }
    });



    app.get('/word/', function (req, res) {
        console.log(new Date() + ' - GET /word/');
        var q_list = req.query.word.match(/\w+/g);
        var words = [];
        var queries = [];
        for(var i=0; i < q_list.length; i++){
            words.push(q_list[i].toLowerCase());
            queries.push({"_id.word":words[i]});
        }
        // if(words.length > 1)
        //     queries.push({'_id.word': {"$in": words}});
        
        var sort = {"sort":["_id.date"]};
        var lines = [];
        for(var i=0;i<queries.length;i++){
            words_dates.find(queries[i], sort, function (err, cursor){
                if(!err){
                    cursor.toArray(function(error, word_dates){
                        lines.push(word_dates);
                        if(lines.length===queries.length){
                            res.contentType('application/javascript');
                            res.send(lines);
                        }
                    });
                }
            });                
        }
    });

    app.get('/posts/', function (req, res) {
        console.log(new Date() + ' - GET /posts/');
        var query_rank = (req.query.rank) ? req.query.rank : 30;
        getPosts(query_rank, function (posts) {
            res.contentType('application/javascript');
            res.send(checkJSONP(req, posts));
        });
    });

    function getPosts (max_rank, callback) {
        var q = { "rank": { "$lte": parseInt(max_rank) } };
        var sort = { "sort":["rank","-age"] }
        posts_collection.find(q, sort, function (err, cursor) {
            cursor.toArray(function (err, posts) {
                callback(posts);
            });
        });
    }
    

    app.get('/words/', function (req, res) {
        console.log(new Date() + ' - GET /words/');
        getWords(function (words) {
            res.contentType('application/javascript');
            res.send(checkJSONP(req, words));
        });
    });

    function getWords (callback){
        words_collection.find(function (error, cursor) {
            cursor.toArray(function (error, words) {
                callback(words);
            });
        });
    }


    app.get('/', function ( req, res ) {
        console.log(new Date() + ' - GET /');
        res.contentType('text/html');
        res.sendfile('index.html');
    });


    function checkJSONP (req, data) {
        var callback = req.query.callback;
        if(callback && callback.match(/^\w+(\.\w+)*$/)) {
            data = callback + '(' + JSON.stringify(data) + ')';
        }
        return data;
    }

    this.start = function () {
        sys.puts('starting server on localhost:8000...');
        app.listen(8000);
    }    
    
    return this;
}

exports.API = API;