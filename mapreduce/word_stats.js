exports.word_stats = {
            mapreduce: "posts",
            out: "avg_word_scores",
            map: (function (){
                var words = this.title_text.match(/\w+/g);
    
                if(words == null) return;
    
                for(var i = 0; i < words.length; i++){
                    emit(
                        words[i], {
                                count:1, 
                                score: this.score, 
                                num_comments: this.num_comments, 
                                rank: this.rank
                            }
                        );
                }
            }).toString(), 
    
            reduce: (function(key, values){
                var total = 0;
                var total_score = 0;
                var total_comments = 0;
                for (var i = 0; i < values.length; i++){
                    total += values[i].count;
                    if(values[i].score == undefined)
                        values[i].score = 0
                    total_score += values[i].score;
                    total_comments += values[i].num_comments;
                }
    
                return {
                    count: total, 
                    avg_score: total_score/total,
                    avg_comments: total_comments/total,
                };
            }).toString()
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
                                db_collection.save(result, function (){
                                    console.log('updated');
                                });
                            }else {
                                db_collection.insert({
                                        word: doc['_id'],
                                        count: doc.value.count,
                                        avg_score: doc.value.avg_score
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
