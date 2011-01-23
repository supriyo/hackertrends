(function () {
    console.log('mapreducing...');
    var HOST = "localhost";
    var PORT = 27017;

    var DB = require('mongodb/db').Db,
        Server= require('mongodb/connection').Server;

    var db = new DB('hackertrends', new Server(HOST, PORT, {auto_reconnect: false}, {}));

    function map() {
        var words = this.title_text.match(/\w+/g);
        
        if(words == null) return;
        
        var date = this.age;
        for(var i = 0; i < words.length; i++){
            emit(
                    {
                        date: new Date(date.getFullYear(), date.getMonth(), date.getDate()), 
                        word: words[i].toLowerCase()
                    }, 
                    {
                        count: 1,
                        score: this.score,
                        num_comments: this.num_comments,
                    }
                );
        }
    }

    function reduce(key, values) {
        var count = 0;
        var score = 0;
        var num_comments = 0;
        values.forEach(function(doc){
            count += doc.count;
            score += doc.score;
            num_comments += doc.num_comments;
        });
        
        return {
            count:count, 
            score:score/count, 
            num_comments: num_comments/count,
        }
    }

    command = {
            mapreduce: "posts",
            out: "word_dates",
            map: map.toString(),
            reduce: reduce.toString(),
        }
        
    db.open(function(err, db){
        db.executeDbCommand(command, function(err, dbres){
            console.log(dbres);
            console.log('mapreduced!');
            db.close();
        });
    });
})();