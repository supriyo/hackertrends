exports.mapReduce = function(db, command, processResults, resultCollection){
    db.open(function(err, db){
        db.executeDbCommand(command, function(err, dbres){
            console.log(dbres)
           processResults(db, dbres.documents[0].result, resultCollection)
        });
    });   
}