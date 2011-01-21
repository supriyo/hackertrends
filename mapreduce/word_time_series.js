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
        
        for(var i = 0; i < words.length; i++){
            emit({date: new Date(Date.parse(this.age)), word: words[i]}, {count:1});
        }
    }

    function reduce(key, values) {
        var count = 0;
    
        values.forEach(function(doc){
            count += doc.count;
        })
        
        return {count:count}
    }


    command = {
            mapreduce: "posts",
            out: "word_dates",
            map: map.toString(),
            reduce: reduce.toString(),
        }
    db.open(function(err, db){
        db.executeDbCommand(command, function(err, dbres){
            db.close()
            console.log('mapreduced!');
        });
    });
})();