(function () {
    var HOST = "localhost";
    var PORT = 27017;

    var DB = require('mongodb/db').Db,
        Server= require('mongodb/connection').Server;

    var db = new DB('hackertrends', new Server(HOST, PORT, {auto_reconnect: false}, {}));

    var word_collection = undefined;
    db.collection('words', function (error, collection) {
        if(!error){
            word_collection = collection;
        }
    });
    
    var mapReduce = require('../mapreduce/mapreduce').mapReduce,
        command = require('../mapreduce/word_stats').word_stats, 
        processResults = require('../mapreduce/avg_word_scores').processResults;
    
    mapReduce(db, command, processResults, word_collection);
})();
