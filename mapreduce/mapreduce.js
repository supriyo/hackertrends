exports.mapReduce = function(db, command){
    db.open(function(err, db){
        db.executeDbCommand(command, function(err, dbres){
            db.close()
        });
    });   
}