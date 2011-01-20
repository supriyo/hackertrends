map = function (){
    var words = this.title_text.match(/\w+/g);

    if(words == null) return;

    for(var i = 0; i < words.length; i++){
        var post = this;
        emit(
            words[i], {
                    count:1, 
                    score: post.score, 
                    num_comments: post.num_comments, 
                    rank: post.rank,
                }
            );
    }
}

reduce = function(key, values){
    var total = 0;
    var total_score = 0;
    var total_comments = 0;
    var total_rank = 0;
    var dates = [];
    values.forEach(function(doc){
        total += doc.count;
        total_score += doc.score;
        total_comments += doc.num_comments;
        total_rank += doc.rank;
        dates.push(doc.age)
        
    })

    return {count:total, score: total_score, rank: total_rank, num_comments: total_comments}
}



exports.word_stats = {
            mapreduce: "posts",
            out: "avg_word_scores",
            
            map: map.toString(),
            reduce: reduce.toString()

        }

exports.processResults = function (db, results, db_collection){
    db.collection(results, function(error, collection){
        collection.find(function(err, cursor){
            cursor.toArray(function(err, docs){
                docs.forEach(function (doc){
                    db_collection.findOne({word:doc['_id']}, function (error, result){
                        if(!error){
                            if(result){
                                result.count = doc.value.count;
                                result.avg_score = doc.value.avg_score;
                                result.avg_comments = doc.value.avg_comments;
                                result.dates = doc.value.dates;
                                db_collection.save(result, function (){
                                    console.log('updated');
                                });
                            }else {
                                db_collection.insert({
                                        word: doc['_id'],
                                        count: doc.value.count,
                                        avg_score: doc.value.avg_score,
                                        num_comments: doc.value.avg_comments,
                                        dates: doc.value.dates,
                                }, function(docs){
                                    console.log('saved!')
                                });
                            }
                        }
                    });
                });
            });
        });
    });
}
